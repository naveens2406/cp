import React, { useState } from 'react';
import { Calculator, CheckCircle, Send, Phone, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import mockApi from '../services/mockApi';

const services = [
    { id: 1, name: 'Wedding Invitation Printing', unit: 'per 100 cards', basePrice: 500 },
    { id: 2, name: 'Offset Printing', unit: 'per 1000 copies', basePrice: 800 },
    { id: 3, name: 'Bill Book & Register Printing', unit: 'per book', basePrice: 120 },
    { id: 4, name: 'Visiting Cards', unit: 'per 100 cards', basePrice: 150 },
    { id: 5, name: 'Poster Printing', unit: 'per poster (A2)', basePrice: 80 },
    { id: 6, name: 'SunPack Printing', unit: 'per sq.ft', basePrice: 35 },
    { id: 7, name: 'Flex Printing', unit: 'per sq.ft', basePrice: 25 },
    { id: 8, name: 'Sticker Printing', unit: 'per sheet', basePrice: 30 },
    { id: 9, name: 'A3+ Colour Printing', unit: 'per page', basePrice: 15 },
];

const GetQuote = () => {
    const [form, setForm] = useState({
        name: '', email: '', phone: '',
        service: '', quantity: 1, notes: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const selectedService = services.find(s => s.name === form.service);
    const estimatedPrice = selectedService
        ? (selectedService.basePrice * Math.max(1, Number(form.quantity) / 100)).toFixed(2)
        : null;

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.service) { toast.error('Please select a service.'); return; }
        setLoading(true);
        try {
            await mockApi.submitEnquiry({ ...form, type: 'quote' });
            setSubmitted(true);
            toast.success('Quote request submitted! We\'ll contact you within 2 hours.');
        } catch {
            toast.error('Failed to submit. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Quote Request Sent!</h2>
                    <p className="text-gray-600 mb-6">
                        Thank you, <strong>{form.name}</strong>! We have received your quote request for <strong>{form.service}</strong>. Our team will call you at <strong>{form.phone}</strong> within 2 business hours.
                    </p>
                    <div className="space-y-3">
                        <a
                            href={`https://wa.me/919876543210?text=Hi! I just requested a quote for ${form.service}`}
                            target="_blank"
                            rel="noreferrer"
                            className="block w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-xl transition-colors"
                        >
                            💬 Chat on WhatsApp for faster reply
                        </a>
                        <button
                            onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', service: '', quantity: 1, notes: '' }); }}
                            className="block w-full btn-secondary"
                        >
                            Request Another Quote
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <div className="bg-gradient-to-br from-primary to-primary/80 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
                        <Calculator className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Get a Free Quote</h1>
                    <p className="text-lg text-white/80">
                        Fill in the details below and we'll send you a customized quote within 2 hours — completely free!
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Quote Request Details</h2>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="form-label">Full Name *</label>
                                        <input type="text" name="name" value={form.name} onChange={handleChange} required className="form-input" placeholder="Your name" />
                                    </div>
                                    <div>
                                        <label className="form-label">Phone Number *</label>
                                        <input type="tel" name="phone" value={form.phone} onChange={handleChange} required className="form-input" placeholder="+91 98765 43210" />
                                    </div>
                                </div>

                                <div>
                                    <label className="form-label">Email Address</label>
                                    <input type="email" name="email" value={form.email} onChange={handleChange} className="form-input" placeholder="email@example.com" />
                                </div>

                                <div>
                                    <label className="form-label">Printing Service Required *</label>
                                    <select name="service" value={form.service} onChange={handleChange} required className="form-input">
                                        <option value="">Select a service...</option>
                                        {services.map(s => (
                                            <option key={s.id} value={s.name}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {selectedService && (
                                    <div>
                                        <label className="form-label">Quantity ({selectedService.unit})</label>
                                        <input type="number" name="quantity" value={form.quantity} onChange={handleChange} min="1" className="form-input" />
                                    </div>
                                )}

                                <div>
                                    <label className="form-label">Additional Notes</label>
                                    <textarea name="notes" value={form.notes} onChange={handleChange} rows={4} className="form-input" placeholder="Paper type, size, design requirements, deadline..." />
                                </div>

                                <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-60 py-3">
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                    ) : (
                                        <><Send className="h-5 w-5" /><span>Submit Quote Request</span></>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-5">
                        {/* Price Estimate */}
                        {estimatedPrice && (
                            <div className="bg-primary text-white rounded-2xl p-6">
                                <h3 className="font-bold text-lg mb-2 flex items-center space-x-2">
                                    <Calculator className="h-5 w-5" />
                                    <span>Quick Estimate</span>
                                </h3>
                                <div className="text-3xl font-bold mb-1">₹{estimatedPrice}</div>
                                <p className="text-white/70 text-sm">* Approximate price. Final quote includes GST and customisation.</p>
                            </div>
                        )}

                        {/* Contact Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="font-bold text-gray-900 mb-4">Prefer to call?</h3>
                            <div className="space-y-3">
                                <a href="tel:+919876543210" className="flex items-center space-x-3 text-primary hover:underline">
                                    <Phone className="h-5 w-5" />
                                    <span>+91 98765 43210</span>
                                </a>
                                <a
                                    href="https://wa.me/919876543210"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center space-x-3 text-green-600 hover:underline"
                                >
                                    <MessageSquare className="h-5 w-5" />
                                    <span>WhatsApp Us</span>
                                </a>
                            </div>
                        </div>

                        {/* Service Rates */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="font-bold text-gray-900 mb-4">Starting Rates</h3>
                            <div className="space-y-2">
                                {services.slice(0, 6).map(s => (
                                    <div key={s.id} className="flex justify-between text-sm">
                                        <span className="text-gray-600">{s.name.split(' ')[0]}...</span>
                                        <span className="font-semibold text-primary">₹{s.basePrice}+</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default GetQuote;
