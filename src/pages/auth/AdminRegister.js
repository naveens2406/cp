import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Sun, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData, role: 'admin' };
      const res = await axios.post('/api/admin/users', payload);
      if (res.data?.id) {
        toast.success('Admin user created');
        navigate('/admin/dashboard');
      } else {
        toast.success('Admin user created');
      }
    } catch (error) {
      const detail = error.response?.data?.detail;
      let message = 'Failed to create admin';
      if (typeof detail === 'string') message = detail;
      else if (Array.isArray(detail)) message = detail.map(d => d?.msg || JSON.stringify(d)).join(', ');
      else if (detail && typeof detail === 'object') message = detail.msg || JSON.stringify(detail);
      else if (error.message) message = error.message;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Sun className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-primary">Create Admin Account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Requires an existing admin session
          </p>
        </div>

        <div className="card">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Username *</label>
                <input name="username" className="form-input" required value={formData.username} onChange={handleChange} />
              </div>
              <div>
                <label className="form-label">Email *</label>
                <input name="email" type="email" className="form-input" required value={formData.email} onChange={handleChange} />
              </div>
            </div>
            <div>
              <label className="form-label">Full Name *</label>
              <input name="full_name" className="form-input" required value={formData.full_name} onChange={handleChange} />
            </div>
            <div>
              <label className="form-label">Phone *</label>
              <input name="phone" className="form-input" required value={formData.phone} onChange={handleChange} />
            </div>
            <div>
              <label className="form-label">Password *</label>
              <input name="password" type="password" className="form-input" required value={formData.password} onChange={handleChange} />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary flex justify-center items-center disabled:opacity-50">
              {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <>
                <UserPlus className="h-5 w-5 mr-2" />
                Create Admin
              </>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
