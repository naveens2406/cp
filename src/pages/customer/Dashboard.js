import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import mockApi from '../../services/mockApi';
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  PlusCircle,
  History,
  TrendingUp,
  Calendar,
  FileText
} from 'lucide-react';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalSpent: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await mockApi.getOrders();
      const orders = response.data.orders;

      // Calculate stats
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(order => order.status.toLowerCase() === 'pending' || order.status.toLowerCase() === 'processing').length;
      const completedOrders = orders.filter(order => order.status.toLowerCase() === 'completed' || order.status.toLowerCase() === 'delivered').length;
      const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);

      setStats({
        totalOrders,
        pendingOrders,
        completedOrders,
        totalSpent
      });

      // Get recent orders (last 5)
      const recent = orders
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
      setRecentOrders(recent.map(o => ({
        ...o,
        order_number: `ORD-${o.id}`,
        created_at: o.date,
        total_amount: o.total,
        service: { name: o.service }
      })));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.full_name}!
        </h1>
        <p className="text-primary/100">
          Manage your printing orders and track their progress from your dashboard.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/customer/create-order"
          className="card p-6 hover:scale-105 transition-transform duration-200 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <PlusCircle className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-primary mb-1">Create Order</h3>
          <p className="text-sm text-gray-600">Start a new printing order</p>
        </Link>

        <Link
          to="/customer/orders"
          className="card p-6 hover:scale-105 transition-transform duration-200 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-secondary rounded-lg group-hover:bg-secondary/80 transition-colors">
              <History className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-primary mb-1">Order History</h3>
          <p className="text-sm text-gray-600">View all your orders</p>
        </Link>

        <Link
          to="/customer/services"
          className="card p-6 hover:scale-105 transition-transform duration-200 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-accent rounded-lg group-hover:bg-accent/80 transition-colors border border-accent">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-primary mb-1">Browse Services</h3>
          <p className="text-sm text-gray-600">Explore our services</p>
        </Link>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-highlight rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-primary mb-1">Total Spent</h3>
          <p className="text-2xl font-bold text-primary">₹{stats.totalSpent.toFixed(2)}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-primary">{stats.totalOrders}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Orders</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed Orders</p>
              <p className="text-2xl font-bold text-green-600">{stats.completedOrders}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-primary">Recent Orders</h2>
            <Link
              to="/customer/orders"
              className="text-primary hover:text-primary/80 font-medium text-sm"
            >
              View All
            </Link>
          </div>
        </div>
        <div className="card-body">
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-medium text-primary">#{order.order_number}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {order.service?.name || 'Service'}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(order.created_at).toLocaleDateString()}</span>
                        </span>
                        <span>Qty: {order.quantity}</span>
                        <span className="font-medium text-primary">₹{order.total_amount.toFixed(2)}</span>
                      </div>
                    </div>
                    <Link
                      to={`/customer/orders/${order.id}`}
                      className="btn-secondary text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No orders yet</p>
              <Link to="/customer/create-order" className="btn-primary">
                Create Your First Order
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
