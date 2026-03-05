import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Lock, Save, CheckCircle, Camera } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user } = useAuth();

    const [profile, setProfile] = useState({
        name: user?.name || 'Demo Customer',
        email: user?.email || 'customer@demo.com',
        phone: '+91 98765 43210',
        address: 'No. 12, Gandhi Street, Coimbatore – 641 001',
        gstin: '',
        notifications: true,
    });

    const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
    const [saving, setSaving] = useState(false);
    const [savingPwd, setSavingPwd] = useState(false);

    const handleProfileSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        await new Promise(r => setTimeout(r, 800));
        setSaving(false);
        toast.success('Profile updated successfully!');
    };

    const handlePasswordSave = async (e) => {
        e.preventDefault();
        if (passwords.newPass !== passwords.confirm) { toast.error('Passwords do not match!'); return; }
        if (passwords.newPass.length < 6) { toast.error('Password must be at least 6 characters'); return; }
        setSavingPwd(true);
        await new Promise(r => setTimeout(r, 800));
        setSavingPwd(false);
        setPasswords({ current: '', newPass: '', confirm: '' });
        toast.success('Password changed successfully!');
    };

    const initials = profile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-gray-500 text-sm">Manage your personal information and account settings</p>
                </div>
            </div>

            {/* Avatar + basic info */}
            <div className="card flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                        {initials}
                    </div>
                    <button className="absolute -bottom-1 -right-1 p-1.5 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                        <Camera className="h-3.5 w-3.5 text-gray-600" />
                    </button>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                    <p className="text-gray-500 text-sm">{profile.email}</p>
                    <div className="flex items-center space-x-2 mt-2">
                        <span className="inline-flex items-center space-x-1 bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                            <CheckCircle className="h-3 w-3" /><span>Verified Customer</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Profile form */}
            <div className="card">
                <div className="card-header">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                        <User className="h-5 w-5 text-primary" /><span>Personal Information</span>
                    </h2>
                </div>
                <form onSubmit={handleProfileSave} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="form-label">Full Name *</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })}
                                    className="form-input pl-9" placeholder="Your full name" required />
                            </div>
                        </div>
                        <div>
                            <label className="form-label">Phone Number *</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input type="tel" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                    className="form-input pl-9" placeholder="+91 98765 43210" required />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="form-label">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })}
                                className="form-input pl-9" placeholder="you@example.com" />
                        </div>
                    </div>
                    <div>
                        <label className="form-label">Delivery Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                            <textarea value={profile.address} onChange={e => setProfile({ ...profile, address: e.target.value })}
                                className="form-input pl-9" rows={2} placeholder="Your delivery address" />
                        </div>
                    </div>
                    <div>
                        <label className="form-label">GSTIN (optional)</label>
                        <input type="text" value={profile.gstin} onChange={e => setProfile({ ...profile, gstin: e.target.value })}
                            className="form-input" placeholder="22AAAAA0000A1Z5" maxLength={15} />
                        <p className="text-xs text-gray-400 mt-1">Provide your GSTIN to receive GST-compliant invoices</p>
                    </div>

                    {/* Preferences */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div>
                            <p className="font-semibold text-gray-900 text-sm">WhatsApp & SMS Notifications</p>
                            <p className="text-xs text-gray-500">Receive order status updates on your phone</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setProfile({ ...profile, notifications: !profile.notifications })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${profile.notifications ? 'bg-primary' : 'bg-gray-300'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${profile.notifications ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    <button type="submit" disabled={saving}
                        className="btn-primary flex items-center space-x-2 disabled:opacity-60 py-2.5 px-6">
                        {saving ? <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full" /> : <><Save className="h-4 w-4" /><span>Save Changes</span></>}
                    </button>
                </form>
            </div>

            {/* Password */}
            <div className="card">
                <div className="card-header">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                        <Lock className="h-5 w-5 text-primary" /><span>Change Password</span>
                    </h2>
                </div>
                <form onSubmit={handlePasswordSave} className="space-y-4">
                    <div>
                        <label className="form-label">Current Password *</label>
                        <input type="password" value={passwords.current} onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                            className="form-input" placeholder="Enter current password" required />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="form-label">New Password *</label>
                            <input type="password" value={passwords.newPass} onChange={e => setPasswords({ ...passwords, newPass: e.target.value })}
                                className="form-input" placeholder="Min. 6 characters" required />
                        </div>
                        <div>
                            <label className="form-label">Confirm New Password *</label>
                            <input type="password" value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                className="form-input" placeholder="Repeat new password" required />
                        </div>
                    </div>
                    <button type="submit" disabled={savingPwd}
                        className="bg-gray-900 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-60 flex items-center space-x-2">
                        {savingPwd ? <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full" /> : <><Lock className="h-4 w-4" /><span>Change Password</span></>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
