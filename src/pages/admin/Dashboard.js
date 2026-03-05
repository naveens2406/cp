import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import mockApi from '../../services/mockApi';
import {
  Users,
  ShoppingBag,
  Package,
  DollarSign,
  Clock,
  BarChart3,
  ArrowUp
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    revenueGrowth: 0,
    ordersGrowth: 0
  });
  const [revenueData, setRevenueData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Use mockApi instead of axios
      const [analytics, orders, services] = await Promise.all([
        mockApi.getAnalytics(),
        mockApi.getOrders(),
        mockApi.getServices()
      ]);

      const revenue = analytics.data;
      const ordersList = orders.data;
      const servicesList = services.data;

      // Calculate stats
      const totalRevenue = revenue.total_revenue;
      const totalOrders = revenue.total_orders;
      const pendingOrdersCount = ordersList.filter(order => order.status === 'pending').length;

      // Get unique customers
      const uniqueCustomers = [...new Set(ordersList.map(order => order.customer_id))].length;

      setStats({
        totalRevenue,
        totalOrders,
        totalCustomers: uniqueCustomers,
        pendingOrders: pendingOrdersCount,
        revenueGrowth: 12.5,
        ordersGrowth: 8.3
      });

      // Process revenue data for chart
      setRevenueData(revenue.daily_breakdown.slice(-7));

      // Process service data for pie chart
      const topServices = servicesList.slice(0, 5).map(service => ({
        name: service.name,
        value: Math.floor(Math.random() * 50) + 10, // Simulated count
        revenue: Math.floor(Math.random() * 5000) + 1000
      }));
      setServiceData(topServices);

      // Get recent orders
      const recent = ordersList
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);
      setRecentOrders(recent);

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

  const COLORS = ['#542344', '#BFD1E5', '#EBF5EE', '#D8BFAA', '#808080'];

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
        <h1 className="text-2xl font-bold text-primary mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Overview of your printing business performance and analytics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div className="flex items-center space-x-1 text-green-600">
              <ArrowUp className="h-4 w-4" />
              <span className="text-sm font-medium">{stats.revenueGrowth}%</span>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Revenue</h3>
          <p className="text-2xl font-bold text-primary">₹{stats.totalRevenue.toFixed(2)}</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-secondary rounded-lg">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <div className="flex items-center space-x-1 text-green-600">
              <ArrowUp className="h-4 w-4" />
              <span className="text-sm font-medium">{stats.ordersGrowth}%</span>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Orders</h3>
          <p className="text-2xl font-bold text-primary">{stats.totalOrders}</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-accent rounded-lg border border-accent">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Customers</h3>
          <p className="text-2xl font-bold text-primary">{stats.totalCustomers}</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-highlight rounded-lg">
              <Clock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Pending Orders</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-primary">Revenue Trend (Last 7 Days)</h2>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [`₹${value}`, 'Revenue']}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#542344"
                  strokeWidth={2}
                  dot={{ fill: '#542344' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Distribution */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-primary">Service Distribution</h2>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Orders']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-primary">Recent Orders</h2>
            <Link
              to="/admin/orders"
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
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {order.customer_type === 'walk_in' ? 'Walk-in' : 'Online'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {order.service?.name || 'Service'}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Qty: {order.quantity}</span>
                        <span className="font-medium text-primary">₹{order.total_amount.toFixed(2)}</span>
                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Link
                      to={`/admin/orders/${order.id}`}
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
              <p className="text-gray-600">No orders yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/orders"
          className="card p-6 hover:scale-105 transition-transform duration-200 group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-primary">Manage Orders</h3>
              <p className="text-sm text-gray-600">View and update order status</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/inventory"
          className="card p-6 hover:scale-105 transition-transform duration-200 group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-secondary rounded-lg group-hover:bg-secondary/80 transition-colors">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-primary">Inventory</h3>
              <p className="text-sm text-gray-600">Manage raw materials</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/analytics"
          className="card p-6 hover:scale-105 transition-transform duration-200 group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-accent rounded-lg group-hover:bg-accent/80 transition-colors border border-accent">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-primary">Analytics</h3>
              <p className="text-sm text-gray-600">View detailed reports</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
