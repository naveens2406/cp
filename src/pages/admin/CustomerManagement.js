import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import mockApi from '../../services/mockApi';
import {
  Users,
  Search,
  Mail,
  Phone,
  Calendar,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Download
} from 'lucide-react';
import toast from 'react-hot-toast';

const CustomerManagement = () => {
  useAuth();
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customers, searchTerm]);

  const fetchCustomers = async () => {
    try {
      // Use mockApi to get orders and extract unique customers
      const ordersResponse = await mockApi.getOrders();
      const orders = ordersResponse.data;

      // Extract unique customers from orders
      const uniqueCustomers = [];
      const customerIds = new Set();

      orders.forEach(order => {
        if (order.customer && !customerIds.has(order.customer.id)) {
          customerIds.add(order.customer.id);
          uniqueCustomers.push(order.customer);
        }
      });

      setCustomers(uniqueCustomers);
    } catch (error) {
      toast.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    if (searchTerm) {
      const filtered = customers.filter(customer =>
        customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  };

  const exportToCSV = () => {
    if (filteredCustomers.length === 0) {
      toast.error('No customers to export');
      return;
    }

    const headers = ['Name', 'Email', 'Phone', 'Role', 'Join Date', 'Status'];
    const csvData = filteredCustomers.map(customer => [
      customer.full_name,
      customer.email,
      customer.phone,
      customer.role,
      new Date(customer.created_at).toLocaleDateString(),
      customer.is_active ? 'Active' : 'Inactive'
    ]);

    const csvContent = [headers, ...csvData].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `customers_export_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Customers exported successfully');
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-2">Customer Management</h1>
          <p className="text-gray-600">View and manage customer accounts and information</p>
        </div>
        <button
          onClick={exportToCSV}
          className="btn-secondary flex items-center space-x-2"
          title="Export to CSV"
        >
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-primary">Customers ({filteredCustomers.length})</h2>
        </div>
        <div className="card-body p-0">
          {filteredCustomers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Join Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{customer.full_name}</div>
                        <div className="text-sm text-gray-500 capitalize">{customer.role}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm">{customer.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm">{customer.phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm">{new Date(customer.created_at).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${customer.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {customer.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search' : 'No customers have registered yet'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      {customers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{customers.length}</p>
              <p className="text-sm text-gray-600">Total Customers</p>
            </div>
          </div>
          <div className="card p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {customers.filter(c => c.is_active).length}
              </p>
              <p className="text-sm text-gray-600">Active</p>
            </div>
          </div>
          <div className="card p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {customers.filter(c => !c.is_active).length}
              </p>
              <p className="text-sm text-gray-600">Inactive</p>
            </div>
          </div>
          <div className="card p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {customers.filter(c => c.role === 'customer').length}
              </p>
              <p className="text-sm text-gray-600">Regular Customers</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
