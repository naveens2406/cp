import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import mockApi from '../../services/mockApi';
import {
  ShoppingBag,
  Calendar,
  Search,
  Download,
  Eye,
  Star,
  Clock,
  CheckCircle,
  Truck,
  FileText,
  RefreshCcw
} from 'lucide-react';
import toast from 'react-hot-toast';

const OrderHistory = () => {
  const navigate = useNavigate();
  useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [invoices, setInvoices] = useState({});

  useEffect(() => {
    fetchOrders();
    fetchInvoices();
  }, []);

  useEffect(() => {
    filterOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      const response = await mockApi.getOrders();
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoices = async () => {
    try {
      const response = await mockApi.getInvoices();
      const invoiceMap = {};
      response.data.forEach(invoice => {
        invoiceMap[invoice.order_id] = invoice;
      });
      setInvoices(invoiceMap);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.service?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
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

  const downloadInvoice = async (orderId) => {
    try {
      const invoice = invoices[orderId];
      if (!invoice) {
        toast.error('Invoice not available');
        return;
      }

      const response = await mockApi.downloadInvoicePdf(invoice.id);

      const link = document.createElement('a');
      link.href = response.url;
      link.setAttribute('download', `invoice_${invoice.invoice_number}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('Invoice downloaded successfully (Mock)');
    } catch (error) {
      toast.error('Failed to download invoice');
    }
  };

  const handleOrderAgain = (order) => {
    navigate(`/customer/create-order?service=${order.service_id}&reorder=true`, {
      state: {
        service_id: order.service_id,
        quantity: order.quantity,
        specifications: order.specifications,
        template_id: order.template_id
      }
    });
  };


  const canReview = (order) => {
    return (order.status === 'completed' || order.status === 'delivered') &&
      (!order.reviews || order.reviews.length === 0);
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
      <div>
        <h1 className="text-2xl font-bold text-primary mb-2">Order History</h1>
        <p className="text-gray-600">
          Track and manage all your printing orders
        </p>
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

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="card hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Order Header */}
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="font-semibold text-primary text-lg">
                        #{order.order_number}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                      </span>
                      {order.customer_type === 'walk_in' && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          Walk-in
                        </span>
                      )}
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Service</p>
                        <p className="font-medium text-primary">{order.service?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Quantity</p>
                        <p className="font-medium">{order.quantity} units</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Order Date</p>
                        <p className="font-medium">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                        <p className="font-semibold text-primary text-lg">
                          ₹{order.total_amount.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Specifications */}
                    {order.specifications && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">Specifications</p>
                        <p className="text-sm bg-gray-50 p-2 rounded">{order.specifications}</p>
                      </div>
                    )}

                    {/* Deadline */}
                    {order.deadline && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">Delivery Deadline</p>
                        <p className="text-sm font-medium flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(order.deadline).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/customer/orders/${order.id}`}
                        className="btn-secondary text-sm flex items-center space-x-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </Link>

                      {invoices[order.id] && (
                        <button
                          onClick={() => downloadInvoice(order.id)}
                          className="btn-accent text-sm flex items-center space-x-1"
                        >
                          <Download className="h-4 w-4" />
                          <span>Invoice</span>
                        </button>
                      )}

                      {canReview(order) && (
                        <Link
                          to={`/customer/orders/${order.id}/review`}
                          className="btn-primary text-sm flex items-center space-x-1"
                        >
                          <Star className="h-4 w-4" />
                          <span>Review</span>
                        </Link>
                      )}

                      <button
                        onClick={() => handleOrderAgain(order)}
                        className="btn-primary-outline text-sm flex items-center space-x-1"
                      >
                        <RefreshCcw className="h-4 w-4" />
                        <span>Order Again</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || statusFilter !== 'all' ? 'No matching orders found' : 'No orders yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Start by creating your first printing order'
            }
          </p>
          {(!searchTerm && statusFilter === 'all') && (
            <Link to="/customer/create-order" className="btn-primary">
              Create Your First Order
            </Link>
          )}
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
    </div>
  );
};

export default OrderHistory;
