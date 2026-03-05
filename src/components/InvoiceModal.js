import React from 'react';
import { Printer, Download, X, Sun } from 'lucide-react';

const InvoiceModal = ({ order, isOpen, onClose }) => {
    if (!isOpen || !order) return null;

    const handlePrint = () => {
        window.print();
    };

    const subtotal = order.total_amount / (1 + (order.service?.gst_rate || 18) / 100);
    const gstAmount = order.total_amount - subtotal;

    return (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm print:p-0 print:bg-white">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col print:shadow-none print:max-h-none print:rounded-none">
                {/* Header - Hidden on print */}
                <div className="p-4 border-b flex items-center justify-between bg-gray-50 print:hidden">
                    <h3 className="text-lg font-bold text-primary">Tax Invoice / Bill of Supply</h3>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handlePrint}
                            className="btn-primary py-2 px-4 flex items-center space-x-2"
                        >
                            <Printer className="h-4 w-4" />
                            <span>Print Invoice</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Invoice Content */}
                <div className="flex-1 overflow-auto p-8 print:p-0" id="invoice-content">
                    <div className="max-w-2xl mx-auto space-y-8">
                        {/* Business Info */}
                        <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-3">
                                <div className="bg-primary p-2 rounded-xl">
                                    <Sun className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-black text-primary uppercase tracking-tight">Sunlight Offset Printers</h1>
                                    <p className="text-xs text-gray-600">Premium Printing Solutions</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <h2 className="text-2xl font-bold text-gray-900 uppercase">Invoice</h2>
                                <p className="text-sm text-gray-500">#{order.order_number}</p>
                                <p className="text-sm text-gray-500">Date: {new Date(order.created_at || Date.now()).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 border-t border-b py-6 border-gray-100">
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">From</h4>
                                <div className="text-sm font-bold text-gray-900">Sunlight Offset Printers</div>
                                <div className="text-sm text-gray-600">
                                    123 Printing Street, Sivakasi<br />
                                    Tamil Nadu, India - 626123<br />
                                    GSTIN: 33AAAAA0000A1Z5<br />
                                    Phone: +91 98765 43210
                                </div>
                            </div>
                            <div className="text-right">
                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Bill To</h4>
                                <div className="text-sm font-bold text-gray-900">{order.customer?.full_name}</div>
                                <div className="text-sm text-gray-600">
                                    {order.customer?.phone || 'N/A'}<br />
                                    {order.customer?.email || 'N/A'}<br />
                                    {order.customer?.address || 'N/A'}
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b-2 border-gray-900">
                                    <th className="py-4 text-xs font-black uppercase text-gray-900">Description</th>
                                    <th className="py-4 text-xs font-black uppercase text-gray-900 text-right">Qty</th>
                                    <th className="py-4 text-xs font-black uppercase text-gray-900 text-right">Unit Price</th>
                                    <th className="py-4 text-xs font-black uppercase text-gray-900 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr>
                                    <td className="py-4">
                                        <div className="font-bold text-gray-900">{order.service?.name}</div>
                                        <div className="text-xs text-gray-500 mt-1">{order.specifications || 'Standard specifications'}</div>
                                    </td>
                                    <td className="py-4 text-right text-gray-900 font-medium">{order.quantity}</td>
                                    <td className="py-4 text-right text-gray-900 font-medium">₹{(subtotal / order.quantity).toFixed(2)}</td>
                                    <td className="py-4 text-right text-gray-900 font-bold">₹{subtotal.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Totals */}
                        <div className="flex justify-end">
                            <div className="w-64 space-y-2">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>GST ({order.service?.gst_rate || 18}%)</span>
                                    <span>₹{gstAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-black text-primary border-t pt-2 border-gray-900">
                                    <span>Total</span>
                                    <span>₹{order.total_amount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t pt-8 border-gray-100 mt-12">
                            <div className="flex justify-between items-end">
                                <div className="text-xs text-gray-500 max-w-xs">
                                    <p className="font-bold mb-1">Terms & Conditions:</p>
                                    <p>1. Quality issues must be reported within 24 hours.</p>
                                    <p>2. Goods once sold will not be taken back.</p>
                                    <p>3. This is a computer-generated invoice.</p>
                                </div>
                                <div className="text-right">
                                    <div className="inline-block border-b border-gray-900 w-32 mb-1"></div>
                                    <p className="text-[10px] font-bold uppercase text-gray-900">Authorized Signatory</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceModal;
