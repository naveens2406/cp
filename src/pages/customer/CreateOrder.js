import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import mockApi from '../../services/mockApi';
import {
  FileText,
  Image as ImageIcon,
  Calculator,
  ArrowLeft,
  CheckCircle,
  ShoppingBag,
  Star,
  Clock,
  ArrowRight,
  Search,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import Confetti from '../../components/Confetti';


const CreateOrder = () => {
  useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceIdFromUrl = searchParams.get('service');
  const templateIdFromUrl = searchParams.get('template');

  const [services, setServices] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [formData, setFormData] = useState({
    service_id: serviceIdFromUrl || '',
    template_id: templateIdFromUrl || '',
    quantity: 1,
    specifications: '',
    custom_design_url: '',
    document_url: '',
    deadline: ''
  });
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);


  useEffect(() => {
    fetchServices();
    if (serviceIdFromUrl) {
      fetchTemplates(serviceIdFromUrl);
    }
  }, [serviceIdFromUrl]);

  const fetchServices = async () => {
    try {
      const response = await mockApi.getServices();
      setServices(response.data);
    } catch (error) {
      toast.error('Failed to fetch services');
    }
  };

  const fetchTemplates = async (serviceId) => {
    try {
      const response = await mockApi.getTemplatesByService(serviceId);
      setTemplates(response.data);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  const handleServiceChange = (e) => {
    const serviceId = e.target.value;
    setFormData({
      ...formData,
      service_id: serviceId,
      template_id: ''
    });

    if (serviceId) {
      const numericServiceId = Number(serviceId);
      fetchTemplates(numericServiceId);
      calculatePricing(numericServiceId, formData.quantity);
    } else {
      setTemplates([]);
      setPricing(null);
    }
  };

  const handleQuantityChange = (e) => {
    const quantity = parseInt(e.target.value) || 1;
    setFormData({
      ...formData,
      quantity
    });

    if (formData.service_id) {
      calculatePricing(formData.service_id, quantity);
    }
  };

  const calculatePricing = async (serviceId, quantity) => {
    if (!serviceId || quantity < 1) {
      setPricing(null);
      return;
    }
    try {
      const res = await mockApi.getQuotation(serviceId, quantity);
      setPricing(res.data);
    } catch (error) {
      console.error('Error calculating pricing:', error);
      setPricing(null);
    }
  };

  const handleFileUpload = async (file, type) => {
    if (!file) return;

    setUploading(true);
    try {
      // Mock upload
      const res = await mockApi.uploadFile(file);
      const url = res.data?.url;
      if (url) {
        setFormData(prev => ({
          ...prev,
          [type]: url
        }));
      }
      toast.success(`${type === 'custom_design_url' ? 'Design' : 'Document'} uploaded successfully (Mock)`);
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.service_id || !formData.quantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        service_id: Number(formData.service_id),
        template_id: formData.template_id ? Number(formData.template_id) : null,
        quantity: Number(formData.quantity),
        specifications: formData.specifications || undefined,
        custom_design_url: formData.custom_design_url || undefined,
        document_url: formData.document_url || undefined,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null
      };

      const res = await mockApi.createOrder(orderData);
      setOrderId(res.data?.id || 'ORD-' + Math.floor(Math.random() * 10000));
      setShowSuccess(true);
      toast.success('Order created successfully!');
      // We'll let the user click a button on the modal instead of navigating automatically
    } catch (error) {
      toast.error('Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const selectedService = services.find(s => s.id === Number(formData.service_id));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/customer/services')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-primary">Create New Order</h1>
          <p className="text-gray-600">Fill in the details to place your printing order</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-primary">Order Details</h2>
            </div>
            <div className="card-body space-y-4">
              {/* Service Selection */}
              <div>
                <label className="form-label">Service *</label>
                <select
                  value={formData.service_id}
                  onChange={handleServiceChange}
                  className="form-input"
                  required
                >
                  <option value="">Select a service</option>
                  {services.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name} - ₹{service.base_price.toFixed(2)} per unit
                    </option>
                  ))}
                </select>
              </div>

              {/* Template Selection with images */}
              {templates.length > 0 && (
                <div>
                  <label className="form-label">Choose a Design Template (Optional)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {templates.map(template => (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, template_id: template.id })}
                        className={`text-left rounded-lg border transition-all ${Number(formData.template_id) === template.id
                          ? 'border-primary ring-2 ring-primary/30'
                          : 'border-gray-200 hover:border-primary/50'
                          }`}
                      >
                        <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-gray-100">
                          <img
                            src={template.image_url}
                            alt={template.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                          {!template.image_url && (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <div className="font-medium text-sm text-primary">{template.name}</div>
                          <div className="text-xs text-gray-600">{template.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Selected: {templates.find(t => t.id === Number(formData.template_id))?.name || 'None'}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="form-label">Quantity *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={handleQuantityChange}
                  className="form-input"
                  required
                />
                {formData.quantity > 50 && (
                  <p className="text-sm text-green-600 mt-1">
                    {formData.quantity > 100 ? '10%' : '5%'} bulk discount applied!
                  </p>
                )}
              </div>

              {/* Specifications */}
              <div>
                <label className="form-label">Specifications</label>
                <textarea
                  value={formData.specifications}
                  onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                  className="form-input"
                  rows={3}
                  placeholder="Enter any special requirements or specifications..."
                />
              </div>

              {/* Deadline */}
              <div>
                <label className="form-label">Delivery Deadline (Optional)</label>
                <input
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="form-input"
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
            </div>
          </div>

          {/* File Uploads */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-primary">File Uploads</h2>
            </div>
            <div className="card-body space-y-4">
              {/* Custom Design Upload */}
              <div>
                <label className="form-label">Custom Design (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload(e.target.files[0], 'custom_design_url')}
                    className="hidden"
                    id="design-upload"
                  />
                  <label htmlFor="design-upload" className="cursor-pointer">
                    {formData.custom_design_url ? (
                      <div className="flex items-center justify-center space-x-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span>Design uploaded</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <ImageIcon className="h-12 w-12 text-gray-400 mx-auto" />
                        <p className="text-sm text-gray-600">
                          Click to upload custom design
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, PDF, DOC up to 10MB
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Document Upload */}
              <div>
                <label className="form-label">Document for Printing (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => handleFileUpload(e.target.files[0], 'document_url')}
                    className="hidden"
                    id="document-upload"
                  />
                  <label htmlFor="document-upload" className="cursor-pointer">
                    {formData.document_url ? (
                      <div className="flex items-center justify-center space-x-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span>Document uploaded</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto" />
                        <p className="text-sm text-gray-600">
                          Click to upload document
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, DOC, DOCX, TXT up to 10MB
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Sidebar */}
        <div className="space-y-6">
          {/* Pricing Calculator */}
          {pricing && (
            <div className="card">
              <div className="card-header">
                <div className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold text-primary">Pricing Details</h2>
                </div>
              </div>
              <div className="card-body space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Price:</span>
                  <span className="font-medium">₹{pricing.selling_price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GST ({selectedService?.gst_rate}%):</span>
                  <span className="font-medium">₹{pricing.gst_amount.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-primary">Total:</span>
                    <span className="text-xl font-bold text-primary">₹{pricing.total_amount.toFixed(2)}</span>
                  </div>
                </div>
                {formData.quantity > 1 && (
                  <div className="text-sm text-gray-500">
                    ₹{(pricing.total_amount / formData.quantity).toFixed(2)} per unit
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Service Info */}
          {selectedService && (
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold text-primary">Service Information</h2>
              </div>
              <div className="card-body space-y-3">
                <div>
                  <h3 className="font-medium text-primary">{selectedService.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{selectedService.description}</p>
                </div>
                <div className="text-sm text-gray-500">
                  <p>• GST Rate: {selectedService.gst_rate}%</p>
                  <p>• Base Price: ₹{selectedService.base_price.toFixed(2)} per unit</p>
                  <p>• Delivery: 2-3 business days</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.service_id || uploading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Order...
              </div>
            ) : (
              'Create Order'
            )}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <Confetti />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => navigate('/customer/orders')} />
          <div className="bg-white rounded-3xl p-8 max-w-md w-full relative z-10 text-center shadow-2xl animate-modal-pop">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12" />
            </div>
            <h2 className="text-3xl font-extrabold text-primary mb-2">Order Success!</h2>
            <p className="text-gray-600 mb-6">
              Your order <span className="font-bold text-gray-900">#{orderId}</span> has been placed successfully and is now in processing.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/customer/orders')}
                className="w-full btn-primary py-3 flex items-center justify-center space-x-2"
              >
                <span>View My Orders</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateOrder;
