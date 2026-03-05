import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import mockApi from '../../services/mockApi';
import {
  Package,
  Plus,
  Edit,
  AlertTriangle,
  Search
} from 'lucide-react';
import toast from 'react-hot-toast';

const InventoryManagement = () => {
  useAuth();
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    service_id: '',
    material_name: '',
    current_stock: 0,
    unit: 'sheets',
    minimum_stock: 0,
    cost_per_unit: 0
  });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchInventory();
    axios.get('/api/services').then(r => setServices(r.data)).catch(() => { });
  }, []);

  useEffect(() => {
    filterInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inventory, searchTerm]);

  const fetchInventory = async () => {
    try {
      const response = await axios.get('/api/admin/inventory');
      setInventory(response.data.inventory.map(item => ({
        ...item,
        material_name: item.name,
        service: { name: 'Printing Service' }
      })));
    } catch (error) {
      toast.error('Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  const filterInventory = () => {
    if (searchTerm) {
      const filtered = inventory.filter(item =>
        item.material_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.service?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInventory(filtered);
    } else {
      setFilteredInventory(inventory);
    }
  };

  const getStockStatus = (current, minimum) => {
    if (current <= minimum * 0.5) {
      return { color: 'text-red-600', bg: 'bg-red-100', text: 'Critical' };
    } else if (current <= minimum) {
      return { color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Low Stock' };
    } else {
      return { color: 'text-green-600', bg: 'bg-green-100', text: 'In Stock' };
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
          <h1 className="text-2xl font-bold text-primary mb-2">Inventory Management</h1>
          <p className="text-gray-600">Track and manage raw materials for all services</p>
        </div>
        <button onClick={() => setAddModalOpen(true)} className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by material name or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-primary">Inventory Items ({filteredInventory.length})</h2>
        </div>
        <div className="card-body p-0">
          {filteredInventory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Material Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Minimum Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cost per Unit
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
                  {filteredInventory.map((item) => {
                    const stockStatus = getStockStatus(item.current_stock, item.minimum_stock);
                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{item.material_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.service?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="font-medium">{item.current_stock}</span>
                            <span className="text-gray-500 ml-1">{item.unit}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-gray-600">{item.minimum_stock}</span>
                            <span className="text-gray-500 ml-1">{item.unit}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium text-primary">₹{item.cost_per_unit.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color}`}>
                            {stockStatus.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button className="text-primary hover:text-primary/80">
                              <Edit className="h-4 w-4" />
                            </button>
                            {stockStatus.text === 'Critical' && (
                              <button className="text-red-600 hover:text-red-800">
                                <AlertTriangle className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No inventory items found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search' : 'No inventory items have been added yet'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Inventory Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-primary">Add Inventory Item</h3>
              <button onClick={() => setAddModalOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!addForm.service_id || !addForm.material_name || addForm.current_stock < 0) {
                toast.error('Fill required fields');
                return;
              }
              setAdding(true);
              try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 800));

                const selectedService = services.find(s => s.id === Number(addForm.service_id));
                const newItem = {
                  id: Date.now(),
                  ...addForm,
                  service: selectedService,
                  material_name: addForm.material_name,
                  current_stock: Number(addForm.current_stock),
                  minimum_stock: Number(addForm.minimum_stock),
                  cost_per_unit: Number(addForm.cost_per_unit)
                };

                setInventory([newItem, ...inventory]);
                toast.success('Inventory item added (Mock)');
                setAddModalOpen(false);
                setAddForm({ service_id: '', material_name: '', current_stock: 0, unit: 'sheets', minimum_stock: 0, cost_per_unit: 0 });
              } catch (err) {
                toast.error('Failed to add inventory item');
              } finally {
                setAdding(false);
              }
            }} className="p-4 space-y-4">
              <div>
                <label className="form-label">Service *</label>
                <select
                  required
                  value={addForm.service_id}
                  onChange={(e) => setAddForm({ ...addForm, service_id: e.target.value })}
                  className="form-input"
                >
                  <option value="">Select service</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Material Name *</label>
                <input
                  required
                  value={addForm.material_name}
                  onChange={(e) => setAddForm({ ...addForm, material_name: e.target.value })}
                  className="form-input"
                  placeholder="e.g., Premium Cardstock"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Current Stock</label>
                  <input type="number" min="0" step="0.01" value={addForm.current_stock} onChange={(e) => setAddForm({ ...addForm, current_stock: parseFloat(e.target.value) || 0 })} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Unit</label>
                  <select value={addForm.unit} onChange={(e) => setAddForm({ ...addForm, unit: e.target.value })} className="form-input">
                    <option value="sheets">sheets</option>
                    <option value="kg">kg</option>
                    <option value="liters">liters</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Minimum Stock</label>
                  <input type="number" min="0" step="0.01" value={addForm.minimum_stock} onChange={(e) => setAddForm({ ...addForm, minimum_stock: parseFloat(e.target.value) || 0 })} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Cost per Unit (₹)</label>
                  <input type="number" min="0" step="0.01" value={addForm.cost_per_unit} onChange={(e) => setAddForm({ ...addForm, cost_per_unit: parseFloat(e.target.value) || 0 })} className="form-input" />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setAddModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={adding} className="btn-primary">{adding ? 'Adding...' : 'Add Item'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {inventory.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{inventory.length}</p>
              <p className="text-sm text-gray-600">Total Items</p>
            </div>
          </div>
          <div className="card p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {inventory.filter(item => item.current_stock <= item.minimum_stock * 0.5).length}
              </p>
              <p className="text-sm text-gray-600">Critical Stock</p>
            </div>
          </div>
          <div className="card p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {inventory.filter(item => item.current_stock <= item.minimum_stock && item.current_stock > item.minimum_stock * 0.5).length}
              </p>
              <p className="text-sm text-gray-600">Low Stock</p>
            </div>
          </div>
          <div className="card p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {inventory.filter(item => item.current_stock > item.minimum_stock).length}
              </p>
              <p className="text-sm text-gray-600">In Stock</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
