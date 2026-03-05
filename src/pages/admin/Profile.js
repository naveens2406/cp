import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, Save, AlertTriangle } from 'lucide-react';

const Profile = () => {
  const { user, changeCredentials } = useAuth();
  const [form, setForm] = useState({
    current_password: '',
    new_username: user?.username || '',
    new_password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.new_password && form.new_password !== form.confirm_password) {
      return;
    }
    setLoading(true);
    try {
      await changeCredentials({
        current_password: form.current_password,
        new_username: form.new_username !== user?.username ? form.new_username : undefined,
        new_password: form.new_password || undefined
      });
      setForm(f => ({ ...f, current_password: '', new_password: '', confirm_password: '' }));
    } finally {
      setLoading(false);
    }
  };

  const showDefaultWarning = user?.role === 'admin' && user?.username === 'admin';

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary flex items-center">
          <Shield className="h-6 w-6 mr-2" />
          Admin Profile
        </h1>
        <p className="text-gray-600">Update your username and password</p>
      </div>

      {showDefaultWarning && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-900 flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 mt-0.5" />
          <div>
            <p className="font-medium">You are using the default admin username.</p>
            <p>For security, change your username and password now.</p>
          </div>
        </div>
      )}

      <div className="card max-w-2xl">
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="form-label">Current Password</label>
            <input
              type="password"
              name="current_password"
              className="form-input"
              required
              placeholder="Enter current password"
              value={form.current_password}
              onChange={onChange}
            />
          </div>

          <div>
            <label className="form-label">Username</label>
            <input
              type="text"
              name="new_username"
              className="form-input"
              placeholder="New username"
              value={form.new_username}
              onChange={onChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">New Password</label>
              <input
                type="password"
                name="new_password"
                className="form-input"
                placeholder="Leave blank to keep same"
                value={form.new_password}
                onChange={onChange}
              />
            </div>
            <div>
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                name="confirm_password"
                className="form-input"
                placeholder="Re-enter new password"
                value={form.confirm_password}
                onChange={onChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary inline-flex items-center"
            >
              <Save className="h-5 w-5 mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
