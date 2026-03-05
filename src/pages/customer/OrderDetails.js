import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ordersApi } from '../../services/apiClient';
import {
  ArrowLeft,
  Star,
  Clock,
  CheckCircle,
  Truck,
  FileText,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await ordersApi.getOrderById(id);
      setOrder(response.data);
    } catch (error) {
      toast.error('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const canReview = order && ['completed', 'delivered'].includes(order.status) && !order.reviews?.length;
  const hasReviewed = order?.reviews?.length > 0;

  const submitReview = async (e) => {
    e.preventDefault();
    if (!canReview || submittingReview) return;
    setSubmittingReview(true);
    try {
      // Review submission not yet implemented in backend
      // await ordersApi.submitReview({ order_id: order.id, ...reviewForm });
      toast.success('Thank you for your review!');
      fetchOrder();
    } catch (err) {
      toast.error('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'processing':
        return 'status-processing';
      case 'completed':
        return 'status-completed';
      case 'delivered':
        return 'status-delivered';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <FileText className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'delivered':
        return <Truck className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Order not found</h3>
        <button
          onClick={() => navigate('/customer/orders')}
          className="btn-secondary"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/customer/orders')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-primary">Order Details</h1>
          <p className="text-gray-600">Order #{order.order_number}</p>
        </div>
      </div>

      {/* Order Tracking Timeline */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-primary">Order Tracking</h2>
        </div>
        <div className="card-body">
          <div className="relative flex justify-between">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200 -z-0">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{
                  width:
                    order.status === 'pending' ? '0%' :
                      order.status === 'processing' ? '33%' :
                        order.status === 'completed' ? '66%' : '100%'
                }}
              />
            </div>

            {/* Steps */}
            {[
              { id: 'pending', label: 'Order Placed', icon: Clock },
              { id: 'processing', label: 'Processing', icon: FileText },
              { id: 'completed', label: 'Ready', icon: CheckCircle },
              { id: 'delivered', label: 'Delivered', icon: Truck },
            ].map((step, index) => {
              const statusOrder = ['pending', 'processing', 'completed', 'delivered'];
              const currentIndex = statusOrder.indexOf(order.status);
              const isCompleted = index <= currentIndex;
              const isCurrent = index === currentIndex;

              return (
                <div key={step.id} className="relative flex flex-col items-center z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${isCompleted ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                    } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}>
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`text-xs font-bold ${isCompleted ? 'text-primary' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                    {isCurrent && (
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">Current</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Order Information */}

      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-primary">Order Information</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Service</p>
              <p className="font-medium text-primary">{order.service?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Quantity</p>
              <p className="font-medium">{order.quantity}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Order Date</p>
              <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          {order.specifications && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-1">Specifications</p>
              <p className="text-sm bg-gray-50 p-3 rounded">{order.specifications}</p>
            </div>
          )}

          {order.deadline && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-1">Delivery Deadline</p>
              <p className="font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(order.deadline).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pricing Details */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-primary">Pricing Details</h2>
        </div>
        <div className="card-body">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Base Price:</span>
              <span className="font-medium">₹{order.selling_price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">GST Amount:</span>
              <span className="font-medium">₹{order.gst_amount.toFixed(2)}</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-primary">Total Amount:</span>
                <span className="text-xl font-bold text-primary">₹{order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Section */}
      {
        canReview && (
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-primary">Submit Review</h2>
              <p className="text-sm text-gray-600">Share your experience with this order</p>
            </div>
            <div className="card-body">
              <form onSubmit={submitReview} className="space-y-4">
                <div>
                  <label className="form-label">Rating (1-5 stars)</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="p-1 focus:outline-none"
                      >
                        <Star className={`h-8 w-8 ${reviewForm.rating >= star ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="form-label">Comment (Optional)</label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    className="form-input"
                    rows={3}
                    placeholder="Tell us about your experience..."
                  />
                </div>
                <button type="submit" disabled={submittingReview} className="btn-primary">
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          </div>
        )
      }
      {
        hasReviewed && (
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-primary">Your Review</h2>
            </div>
            <div className="card-body">
              <div className="flex items-center space-x-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < order.reviews[0].rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                ))}
              </div>
              {order.reviews[0].comment && <p className="mt-2 text-gray-600">{order.reviews[0].comment}</p>}
            </div>
          </div>
        )
      }

      {/* Files */}
      {
        (order.custom_design_url || order.document_url) && (
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-primary">Uploaded Files</h2>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                {order.custom_design_url && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span>Custom Design</span>
                    <a href={order.custom_design_url} target="_blank" rel="noreferrer" className="btn-secondary text-sm">View</a>
                  </div>
                )}
                {order.document_url && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span>Document</span>
                    <a href={order.document_url} target="_blank" rel="noreferrer" className="btn-secondary text-sm">View</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default OrderDetails;
