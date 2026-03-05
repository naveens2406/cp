import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { ordersApi } from '../../services/apiClient';
import {
  ShoppingBag,
  Edit,
  Clock,
  CheckCircle,
  Truck,
  FileText,
  Search,
  Plus,
  Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import InvoiceModal from '../../components/InvoiceModal';


const OrderManagement = () => {
  useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [services, setServices] = useState([]);
  const [walkInOpen, setWalkInOpen] = useState(false);
  const [walkInForm, setWalkInForm] = useState({
    customer_full_name: '',
    customer_phone: '',
    service_id: '',
    quantity: 1
  });
  const [creating, setCreating] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editForm, setEditForm] = useState({ status: '', deadline: '' });
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState(null);


  useEffect(() => {
    fetchOrders();
    fetchServices();
  }, []);

  useEffect(() => {
    filterOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      const response = await ordersApi.getOrders();
      setOrders(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      // Services API not yet implemented in backend
      // const res = await ordersApi.getServices();
      // setServices(res.data.services);
    } catch (e) {
      // ignore
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.service?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const openEditModal = (order) => {
    setEditingOrder(order);
    const deadlineStr = order.deadline ? new Date(order.deadline).toISOString().slice(0, 16) : '';
    setEditForm({ status: order.status, deadline: deadlineStr });
    setEditModalOpen(true);
  };

  const updateOrderStatus = async (orderId, payload) => {
    try {
      await ordersApi.updateOrderStatus(orderId, payload.status, payload.notes);

      setOrders(prev => prev.map(o =>
        o.id === orderId
          ? { ...o, status: payload.status, deadline: payload.deadline }
          : o
      ));

      setEditModalOpen(false);
      setEditingOrder(null);
      toast.success('Order updated successfully');
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  const exportToCSV = () => {
    if (filteredOrders.length === 0) {
      toast.error('No orders to export');
      return;
    }

    const headers = ['Order Number', 'Customer', 'Type', 'Service', 'Quantity', 'Total Amount', 'Status', 'Date'];
    const csvData = filteredOrders.map(order => [
      order.order_number,
      order.customer?.full_name,
      order.customer_type,
      order.service?.name,
      order.quantity,
      order.total_amount.toFixed(2),
      order.status,
      new Date(order.created_at).toLocaleDateString()
    ]);

    const csvContent = [headers, ...csvData].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_export_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Orders exported successfully');
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-2">Order Management</h1>
          <p className="text-gray-600">Manage and track all customer orders</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportToCSV}
            className="btn-secondary flex items-center space-x-2"
            title="Export to CSV"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button
            onClick={() => setWalkInOpen(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Walk-in Order</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order number or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input lg:w-48"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-primary">Orders ({filteredOrders.length})</h2>
        </div>
        <div className="card-body p-0">
          {filteredOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Design
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-primary">#{order.order_number}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.customer?.full_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.customer_type === 'walk_in' ? 'Walk-in' : 'Online'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.service?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.template?.name || (order.custom_design_url ? 'Custom Design' : '—')}
                        </div>
                        {(order.custom_design_url || order.document_url) && (
                          <div className="text-xs text-primary space-x-2 mt-1">
                            {order.custom_design_url && (
                              <a href={order.custom_design_url} target="_blank" rel="noreferrer" className="hover:underline">
                                Design
                              </a>
                            )}
                            {order.document_url && (
                              <a href={order.document_url} target="_blank" rel="noreferrer" className="hover:underline">
                                Document
                              </a>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-primary">₹{order.total_amount.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openEditModal(order)}
                            className="text-primary hover:text-primary/80"
                            title="Update status / deadline"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setInvoiceOrder(order);
                              setInvoiceOpen(true);
                            }}
                            className="text-gray-500 hover:text-primary transition-colors"
                            title="Generate Invoice"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'No orders have been placed yet'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Walk-in Order Modal */}
      {walkInOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-primary">Add Walk-in Order</h3>
              <button
                onClick={() => setWalkInOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="form-label">Customer Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={walkInForm.customer_full_name}
                  onChange={(e) => setWalkInForm({ ...walkInForm, customer_full_name: e.target.value })}
                  placeholder="e.g., John Doe"
                />
              </div>
              <div>
                <label className="form-label">Customer Phone *</label>
                <input
                  type="tel"
                  className="form-input"
                  value={walkInForm.customer_phone}
                  onChange={(e) => setWalkInForm({ ...walkInForm, customer_phone: e.target.value })}
                  placeholder="10-digit phone"
                />
              </div>
              <div>
                <label className="form-label">Service *</label>
                <select
                  className="form-input"
                  value={walkInForm.service_id}
                  onChange={(e) => setWalkInForm({ ...walkInForm, service_id: e.target.value })}
                >
                  <option value="">Select a service</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Quantity *</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  value={walkInForm.quantity}
                  onChange={(e) => setWalkInForm({ ...walkInForm, quantity: Number(e.target.value) || 1 })}
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex items-center justify-end space-x-2">
              <button
                onClick={() => setWalkInOpen(false)}
                className="btn-secondary"
                disabled={creating}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!walkInForm.customer_full_name || !walkInForm.customer_phone || !walkInForm.service_id || walkInForm.quantity < 1) {
                    toast.error('Fill all required fields');
                    return;
                  }
                  setCreating(true);
                  try {
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 800));

                    const selectedService = services.find(s => s.id === Number(walkInForm.service_id));
                    const newOrder = {
                      id: Date.now(),
                      order_number: `WK-${Date.now().toString().slice(-4)}`,
                      customer: { full_name: walkInForm.customer_full_name },
                      customer_type: 'walk_in',
                      service: selectedService,
                      quantity: walkInForm.quantity,
                      total_amount: (selectedService?.price || 0) * walkInForm.quantity,
                      status: 'pending',
                      created_at: new Date().toISOString()
                    };

                    setOrders([newOrder, ...orders]);
                    toast.success('Walk-in order created (Mock)');
                    setWalkInOpen(false);
                    setWalkInForm({
                      customer_full_name: '',
                      customer_phone: '',
                      service_id: '',
                      quantity: 1
                    });
                  } catch (e) {
                    toast.error('Failed to create order');
                  } finally {
                    setCreating(false);
                  }
                }}
                disabled={creating || services.length === 0}
                className="btn-primary"
              >
                {creating ? 'Creating...' : 'Create Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editModalOpen && editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-primary">Update Order #{editingOrder.order_number}</h3>
              <button onClick={() => { setEditModalOpen(false); setEditingOrder(null); }} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="form-label">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="form-input"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
              <div>
                <label className="form-label">Delivery Deadline</label>
                <input
                  type="datetime-local"
                  value={editForm.deadline}
                  onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-2">
              <button onClick={() => { setEditModalOpen(false); setEditingOrder(null); }} className="btn-secondary">Cancel</button>
              <button onClick={() => updateOrderStatus(editingOrder.id, editForm)} className="btn-primary">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {orders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{orders.length}</p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
          </div>
          <div className="card p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {orders.filter(o => o.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </div>
          <div className="card p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {orders.filter(o => o.status === 'processing').length}
              </p>
              <p className="text-sm text-gray-600">Processing</p>
            </div>
          </div>
          <div className="card p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.status === 'completed' || o.status === 'delivered').length}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={invoiceOpen}
        onClose={() => {
          setInvoiceOpen(false);
          setInvoiceOrder(null);
        }}
        order={invoiceOrder}
      />
    </div>
  );
};

export default OrderManagement;
