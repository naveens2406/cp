import React, { useState, useEffect } from 'react';
import mockApi from '../../services/mockApi';
import {
    MessageSquare, Mail, Phone, Clock, CheckCircle,
    Inbox, Search, Filter, Eye, Reply
} from 'lucide-react';
import toast from 'react-hot-toast';

const Enquiries = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selected, setSelected] = useState(null);

    useEffect(() => { fetchEnquiries(); }, []);

    const fetchEnquiries = async () => {
        try {
            const res = await mockApi.getEnquiries();
            setEnquiries(res.data);
        } catch { toast.error('Failed to load enquiries'); }
        finally { setLoading(false); }
    };

    const markResolved = async (id) => {
        try {
            await mockApi.resolveEnquiry(id);
            setEnquiries(enqs => enqs.map(e => e.id === id ? { ...e, status: 'resolved' } : e));
            if (selected?.id === id) setSelected(s => ({ ...s, status: 'resolved' }));
            toast.success('Enquiry marked as resolved.');
        } catch { toast.error('Failed to update status.'); }
    };

    const filtered = enquiries.filter(e => {
        const matchSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.message.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === 'all' || e.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const pending = enquiries.filter(e => e.status === 'pending').length;
    const resolved = enquiries.filter(e => e.status === 'resolved').length;
    const quoteRequests = enquiries.filter(e => e.type === 'quote').length;

    const getTypeColor = (type) =>
        type === 'quote' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700';

    const getStatusColor = (status) =>
        status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700';

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-primary flex items-center space-x-2">
                    <Inbox className="h-6 w-6" />
                    <span>Customer Enquiries</span>
                    {pending > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{pending} new</span>
                    )}
                </h1>
                <p className="text-gray-500 text-sm mt-1">Manage messages from the contact form and quote requests.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Total', value: enquiries.length, color: 'text-gray-900' },
                    { label: 'Pending', value: pending, color: 'text-yellow-600' },
                    { label: 'Resolved', value: resolved, color: 'text-green-600' },
                    { label: 'Quote Requests', value: quoteRequests, color: 'text-blue-600' },
                ].map(stat => (
                    <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</p>
                        <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or message..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="form-input pl-10"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-gray-400" />
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="form-input sm:w-36">
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="resolved">Resolved</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* List + Detail Split */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* List */}
                <div className="lg:col-span-2 space-y-3">
                    {loading ? (
                        [...Array(5)].map((_, i) => <div key={i} className="bg-white rounded-xl p-4 shadow-sm animate-pulse h-20" />)
                    ) : filtered.length === 0 ? (
                        <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                            <Inbox className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-400">No enquiries found.</p>
                        </div>
                    ) : filtered.map(e => (
                        <div
                            key={e.id}
                            onClick={() => setSelected(e)}
                            className={`bg-white rounded-xl p-4 shadow-sm border cursor-pointer transition-all hover:shadow-md ${selected?.id === e.id ? 'border-primary ring-2 ring-primary/20' : 'border-gray-100 hover:border-gray-200'
                                } ${e.status === 'pending' ? 'border-l-4 border-l-yellow-400' : 'border-l-4 border-l-green-400'}`}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <p className="font-semibold text-gray-900 text-sm">{e.name}</p>
                                <div className="flex space-x-1">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getTypeColor(e.type)}`}>{e.type}</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mb-1 flex items-center space-x-1">
                                <Mail className="h-3 w-3" /><span>{e.email || '—'}</span>
                            </p>
                            <p className="text-xs text-gray-400 line-clamp-2">{e.message}</p>
                            <p className="text-xs text-gray-400 mt-2 flex items-center space-x-1">
                                <Clock className="h-3 w-3" /><span>{new Date(e.created_at).toLocaleDateString()}</span>
                            </p>
                        </div>
                    ))}
                </div>

                {/* Detail */}
                <div className="lg:col-span-3">
                    {selected ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{selected.name}</h3>
                                    <div className="flex items-center space-x-3 mt-1">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getTypeColor(selected.type)}`}>{selected.type}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(selected.status)}`}>{selected.status}</span>
                                    </div>
                                </div>
                                {selected.status === 'pending' && (
                                    <button
                                        onClick={() => markResolved(selected.id)}
                                        className="flex items-center space-x-1 text-sm bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        <CheckCircle className="h-4 w-4" />
                                        <span>Mark Resolved</span>
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-2 text-sm">
                                        <div className="p-2 bg-blue-50 rounded-lg"><Mail className="h-4 w-4 text-blue-600" /></div>
                                        <div>
                                            <p className="text-xs text-gray-400">Email</p>
                                            <p className="font-medium text-gray-900">{selected.email || '—'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm">
                                        <div className="p-2 bg-green-50 rounded-lg"><Phone className="h-4 w-4 text-green-600" /></div>
                                        <div>
                                            <p className="text-xs text-gray-400">Phone</p>
                                            <p className="font-medium text-gray-900">{selected.phone || '—'}</p>
                                        </div>
                                    </div>
                                    {selected.service && (
                                        <div className="flex items-center space-x-2 text-sm">
                                            <div className="p-2 bg-purple-50 rounded-lg"><Eye className="h-4 w-4 text-purple-600" /></div>
                                            <div>
                                                <p className="text-xs text-gray-400">Service Requested</p>
                                                <p className="font-medium text-gray-900">{selected.service}</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center space-x-2 text-sm">
                                        <div className="p-2 bg-gray-50 rounded-lg"><Clock className="h-4 w-4 text-gray-500" /></div>
                                        <div>
                                            <p className="text-xs text-gray-400">Received On</p>
                                            <p className="font-medium text-gray-900">{new Date(selected.created_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs text-gray-400 mb-2 flex items-center space-x-1"><MessageSquare className="h-3 w-3" /><span>Message</span></p>
                                    <p className="text-gray-700 text-sm leading-relaxed">{selected.message}</p>
                                </div>

                                <div className="flex space-x-3 pt-2">
                                    {selected.email && (
                                        <a
                                            href={`mailto:${selected.email}?subject=Re: Your enquiry at Sunlight Offset Printers`}
                                            className="flex-1 flex items-center justify-center space-x-2 btn-primary text-sm"
                                        >
                                            <Reply className="h-4 w-4" /><span>Reply via Email</span>
                                        </a>
                                    )}
                                    {selected.phone && (
                                        <a
                                            href={`https://wa.me/91${selected.phone.replace(/\D/g, '')}?text=Hi ${selected.name}, regarding your enquiry...`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex-1 flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-xl transition-colors text-sm"
                                        >
                                            <MessageSquare className="h-4 w-4" /><span>WhatsApp</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                            <Inbox className="h-14 w-14 text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-400">Select an enquiry from the list to view details.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Enquiries;
