import React from 'react';
import { CheckCircle, ArrowRight, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const SERVICES = [
    { name: 'Visiting Cards', price: '₹1.50', unit: '/card', gst: '12%', delivery: '1–2 days', moq: '100 pcs', highlight: false },
    { name: 'Wedding Invitations', price: '₹5.00', unit: '/card', gst: '12%', delivery: '3–5 days', moq: '50 pcs', highlight: true },
    { name: 'Offset Printing', price: '₹0.80', unit: '/copy', gst: '18%', delivery: '2–4 days', moq: '500 pcs', highlight: false },
    { name: 'Bill Book & Registers', price: '₹120', unit: '/book', gst: '12%', delivery: '2–3 days', moq: '10 pcs', highlight: false },
    { name: 'Poster Printing (A2)', price: '₹80', unit: '/poster', gst: '18%', delivery: '1–2 days', moq: '1 pc', highlight: false },
    { name: 'SunPack Boards', price: '₹35', unit: '/sq.ft', gst: '18%', delivery: '1 day', moq: '1 sq.ft', highlight: false },
    { name: 'Flex Printing', price: '₹25', unit: '/sq.ft', gst: '18%', delivery: '1 day', moq: '4 sq.ft', highlight: false },
    { name: 'Sticker Printing', price: '₹30', unit: '/sheet', gst: '12%', delivery: '1–2 days', moq: '10 sheets', highlight: false },
    { name: 'A3+ Colour Printing', price: '₹15', unit: '/page', gst: '18%', delivery: 'Same day', moq: '1 page', highlight: false },
];

const FEATURES = [
    'GST Invoice included',
    'Quality check on all orders',
    'Design assistance available',
    'Door delivery in Coimbatore',
    'WhatsApp order updates',
    'Bulk order discounts',
];

const Pricing = () => (
    <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="hero-gradient text-white py-16 relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-56 h-56 bg-white/5 rounded-full animate-float" />
            <div className="max-w-4xl mx-auto px-4 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-2xl mb-5 animate-bounce-soft">
                    <span className="text-2xl">💰</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Transparent Pricing</h1>
                <p className="text-white/80 text-lg mb-6">No hidden fees. No surprises. What you see is what you pay (+ GST).</p>
                <div className="flex flex-wrap justify-center gap-3">
                    {FEATURES.map(f => (
                        <span key={f} className="flex items-center space-x-1 bg-white/10 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full">
                            <CheckCircle className="h-3.5 w-3.5 text-green-400" />
                            <span>{f}</span>
                        </span>
                    ))}
                </div>
            </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Pricing Table */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-6 py-4 text-sm font-bold text-gray-900">Service</th>
                                <th className="text-center px-4 py-4 text-sm font-bold text-gray-900">Starting Price</th>
                                <th className="text-center px-4 py-4 text-sm font-bold text-gray-900">GST Rate</th>
                                <th className="text-center px-4 py-4 text-sm font-bold text-gray-900">Min. Order</th>
                                <th className="text-center px-4 py-4 text-sm font-bold text-gray-900">Delivery</th>
                                <th className="text-center px-4 py-4 text-sm font-bold text-gray-900">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {SERVICES.map((svc, i) => (
                                <tr
                                    key={svc.name}
                                    className={`transition-colors hover:bg-primary/5 ${svc.highlight ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <span className="font-semibold text-gray-900 text-sm">{svc.name}</span>
                                            {svc.highlight && (
                                                <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full font-semibold">Popular</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span className="text-lg font-extrabold text-primary">{svc.price}</span>
                                        <span className="text-gray-400 text-xs ml-0.5">{svc.unit}</span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">{svc.gst}</span>
                                    </td>
                                    <td className="px-4 py-4 text-center text-sm text-gray-600">{svc.moq}</td>
                                    <td className="px-4 py-4 text-center">
                                        <span className="bg-green-50 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">{svc.delivery}</span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <Link to="/get-quote" className="text-primary text-sm font-semibold hover:underline inline-flex items-center space-x-1">
                                            <span>Quote</span><ArrowRight className="h-3.5 w-3.5" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <p className="text-xs text-gray-400">* All prices are starting rates and may vary based on paper type, quantity, size, and finishing options. GST is added at checkout.</p>
                </div>
            </div>

            {/* Bulk Discount */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                    { label: 'Standard', range: 'Orders up to ₹5,000', discount: '0%', color: 'border-gray-200 bg-white' },
                    { label: 'Silver', range: 'Orders ₹5,000 – ₹10,000', discount: '5% off', color: 'border-indigo-200 bg-indigo-50', badge: 'Most Used' },
                    { label: 'Gold', range: 'Orders above ₹25,000', discount: '15% off', color: 'border-amber-200 bg-amber-50', badge: 'Best Value' },
                ].map(tier => (
                    <div key={tier.label} className={`rounded-2xl border-2 p-6 text-center ${tier.color}`}>
                        {tier.badge && (
                            <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-0.5 rounded-full mb-3">{tier.badge}</span>
                        )}
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{tier.label}</h3>
                        <p className="text-gray-500 text-sm mb-3">{tier.range}</p>
                        <p className="text-3xl font-extrabold text-primary">{tier.discount}</p>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <div className="mt-12 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Need a Custom Quote?</h2>
                <p className="text-gray-500 mb-6">Fill in your requirements — we'll get back with a precise quote within 2 hours.</p>
                <div className="flex flex-wrap justify-center gap-4">
                    <Link to="/get-quote" className="btn-primary px-8 py-3 inline-flex items-center space-x-2">
                        <ArrowRight className="h-5 w-5" /><span>Get Free Quote</span>
                    </Link>
                    <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer"
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-xl transition-all inline-flex items-center space-x-2">
                        <MessageCircle className="h-5 w-5" /><span>WhatsApp</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
);

export default Pricing;
