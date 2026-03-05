import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TrendingUp,
  DollarSign,
  Users,
  ShoppingBag,
  Download
} from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import mockApi from '../../services/mockApi';

const AdminAnalytics = () => {
  const [period, setPeriod] = useState('month');
  const [revenueData, setRevenueData] = useState(null);
  const [serviceData, setServiceData] = useState([]);
  const [customerData, setCustomerData] = useState(null);
  const [profitData, setProfitData] = useState(null);
  const [designData, setDesignData] = useState([]);
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const response = await mockApi.getAnalytics(period);
      const data = response.data;

      setRevenueData({
        total_revenue: data.revenue.total,
        total_orders: 120, // Mock value
        average_order_value: data.revenue.average_order,
        daily_breakdown: data.revenue.trend.map(t => ({
          date: t.date,
          revenue: t.revenue,
          orders: Math.floor(t.revenue / 100) // Mock calculation
        }))
      });
      setServiceData(data.service_analytics.map(s => ({
        service_name: s.name,
        revenue: s.revenue,
        total_orders: Math.floor(s.revenue / 150), // Mock calculation
        average_quantity: 1,
        popularity_score: (s.revenue / data.revenue.total) * 100
      })));
      setCustomerData({
        total_customers: data.customer_analytics.online_customers + data.customer_analytics.walkin_customers,
        online_customers: data.customer_analytics.online_customers,
        walk_in_customers: data.customer_analytics.walkin_customers
      });
      setProfitData({
        total_revenue: data.revenue.total,
        total_cost: data.revenue.total - data.profit.total_profit,
        gross_profit: data.profit.total_profit,
        profit_margin: data.profit.profit_margin,
        profit_by_service: data.service_analytics.map(s => ({
          service_name: s.name,
          profit: s.revenue * 0.3 // Mock 30% profit
        }))
      });
      setDesignData([]);
      setReviewData(null);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    // Create CSV content
    const csvContent = [
      ['Metric', 'Value'],
      ['Total Revenue', revenueData?.total_revenue || 0],
      ['Total Orders', revenueData?.total_orders || 0],
      ['Average Order Value', revenueData?.average_order_value || 0],
      ['Total Customers', customerData?.total_customers || 0],
      ['Gross Profit', profitData?.gross_profit || 0],
      ['Profit Margin', `${profitData?.profit_margin || 0}%`]
    ].map(row => row.join(',')).join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${period}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
          <h1 className="text-2xl font-bold text-primary mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">
            Comprehensive insights into your printing business performance
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="form-input"
          >
            <option value="day">Daily</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
          </select>
          <button
            onClick={exportData}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-primary/10 rounded-lg">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Revenue</h3>
          <p className="text-2xl font-bold text-primary">₹{revenueData?.total_revenue?.toFixed(2) || '0.00'}</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-secondary rounded-lg">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Orders</h3>
          <p className="text-2xl font-bold text-primary">{revenueData?.total_orders || 0}</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-accent rounded-lg border border-accent">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Customers</h3>
          <p className="text-2xl font-bold text-primary">{customerData?.total_customers || 0}</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-highlight rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Profit Margin</h3>
          <p className="text-2xl font-bold text-primary">{profitData?.profit_margin?.toFixed(1) || '0.0'}%</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-primary">Revenue Trend</h2>
          <p className="text-sm text-gray-600">Revenue over time</p>
        </div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={revenueData?.daily_breakdown || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value, name) => [
                  name === 'revenue' ? `₹${value}` : value,
                  name === 'revenue' ? 'Revenue' : 'Orders'
                ]}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#542344"
                fill="#542344"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Popularity */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-primary">Service Popularity</h2>
            <p className="text-sm text-gray-600">Most ordered services</p>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={serviceData.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="service_name"
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [value, 'Orders']} />
                <Bar dataKey="total_orders" fill="#542344" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Distribution */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-primary">Customer Distribution</h2>
            <p className="text-sm text-gray-600">Online vs Walk-in customers</p>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-secondary rounded-lg">
                <div className="text-2xl font-bold text-primary">{customerData?.online_customers || 0}</div>
                <div className="text-sm text-gray-600">Online Customers</div>
              </div>
              <div className="text-center p-4 bg-accent rounded-lg border border-accent">
                <div className="text-2xl font-bold text-primary">{customerData?.walk_in_customers || 0}</div>
                <div className="text-sm text-gray-600">Walk-in Customers</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Online', value: customerData?.online_customers || 0 },
                    { name: 'Walk-in', value: customerData?.walk_in_customers || 0 }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#542344" />
                  <Cell fill="#BFD1E5" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Profit Analysis */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-primary">Profit Analysis</h2>
          <p className="text-sm text-gray-600">Revenue, costs, and profit margins</p>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">₹{profitData?.total_revenue?.toFixed(2) || '0.00'}</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">₹{profitData?.total_cost?.toFixed(2) || '0.00'}</div>
              <div className="text-sm text-gray-600">Total Cost</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">₹{profitData?.gross_profit?.toFixed(2) || '0.00'}</div>
              <div className="text-sm text-gray-600">Gross Profit</div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={profitData?.profit_by_service?.slice(0, 5) || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="service_name"
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [`₹${value}`, 'Profit']} />
              <Bar dataKey="profit" fill="#542344" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Design Popularity */}
      {designData.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-primary">Most Popular Designs</h2>
            <p className="text-sm text-gray-600">Design templates by usage</p>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={designData.slice(0, 8)} layout="vertical" margin={{ left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="template_name" type="category" width={80} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value, name) => [value, name === 'usage_count' ? 'Orders' : 'Revenue']} />
                <Bar dataKey="usage_count" fill="#542344" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Review Analytics */}
      {reviewData && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-primary">Customer Review Analytics</h2>
            <p className="text-sm text-gray-600">Ratings and feedback</p>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-secondary rounded-lg">
                <div className="text-2xl font-bold text-primary">{reviewData.total_reviews || 0}</div>
                <div className="text-sm text-gray-600">Total Reviews</div>
              </div>
              <div className="text-center p-4 bg-accent rounded-lg border border-accent">
                <div className="text-2xl font-bold text-primary">{reviewData.average_rating?.toFixed(1) || '0.0'}</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="text-center p-4 bg-highlight rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {reviewData.rating_distribution ? Object.entries(reviewData.rating_distribution).map(([k, v]) => `${k}★:${v}`).join(' ') : '-'}
                </div>
                <div className="text-sm text-gray-600">Rating Distribution</div>
              </div>
            </div>
            {reviewData.breakdown?.length > 0 && (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={reviewData.breakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#542344" name="Reviews" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      {/* Service Details Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-primary">Service Performance</h2>
          <p className="text-sm text-gray-600">Detailed breakdown of all services</p>
        </div>
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Popularity Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {serviceData.map((service, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {service.service_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {service.total_orders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{service.revenue.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {service.average_quantity.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${service.popularity_score}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{service.popularity_score.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
