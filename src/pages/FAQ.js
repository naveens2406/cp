import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQS = [
    {
        topic: '📦 Ordering',
        questions: [
            { q: 'How do I place an order?', a: 'You can place an order by registering as a customer, browsing our services, and clicking "Order Now". You can upload your design files and choose your specifications. Alternatively, use our "Get a Quote" page for a free estimate first.' },
            { q: 'Can I order without registering?', a: 'For placing orders, registration is required so we can track your order and send you updates. However, you can get a free quote without logging in via the "Get a Quote" page.' },
            { q: 'What file formats do you accept?', a: 'We accept PDF, AI (Adobe Illustrator), PSD (Photoshop), CDR (CorelDraw), PNG, JPG, and TIFF. For best results, please provide print-ready files in PDF format with 3mm bleed on all sides.' },
            { q: 'What is the minimum order quantity?', a: 'Minimum quantities vary by product: Visiting Cards (100 pcs), Offset Printing (500 pcs), Flex Banners (1 piece), Stickers (1 sheet). Contact us for custom quantities.' },
            { q: 'Can I reorder previous orders?', a: 'Yes! In your Order History page, click the "Order Again" button on any previous order to quickly create a new order with the same specifications.' },
        ],
    },
    {
        topic: '💰 Pricing & Payment',
        questions: [
            { q: 'How is pricing calculated?', a: 'Pricing is based on paper type, quantity, size, finishing (lamination, UV, foil), and delivery time. Use our "Get a Quote" page for an instant estimate.' },
            { q: 'Do you include GST in your prices?', a: 'All prices shown are exclusive of GST. GST is added at checkout as per the applicable rate for each service (12% or 18%). You will receive a proper GST invoice for every order.' },
            { q: 'What payment methods are accepted?', a: 'We currently accept cash payments at the shop and bank transfers (NEFT/UPI). Online payment integration is coming soon!' },
            { q: 'Are there discounts for bulk orders?', a: 'Yes! Orders above ₹5,000 get a 5% discount, orders above ₹10,000 get 10%, and orders above ₹25,000 get 15% off. Contact us for a custom bulk quote.' },
        ],
    },
    {
        topic: '🚚 Delivery & Turnaround',
        questions: [
            { q: 'How long does printing take?', a: 'Standard turnaround times: Visiting Cards (1–2 days), Offset Printing (2–4 days), Flex Banners (1 day), Wedding Cards (3–5 days). Rush orders are available for an additional charge.' },
            { q: 'Do you offer home delivery?', a: 'Yes, we offer delivery within Coimbatore for orders above ₹500. Outstation orders are shipped via courier (3–7 business days). Delivery charges apply.' },
            { q: 'Can I pick up my order from the shop?', a: 'Absolutely! Walk in to our shop at No. 45, Market Street, Coimbatore. We\'ll notify you via SMS or WhatsApp when your order is ready.' },
        ],
    },
    {
        topic: '🎨 Design & Files',
        questions: [
            { q: 'Do you provide design services?', a: 'Yes, our in-house design team can create designs for you. Basic design assistance is free; complex custom designs are charged at ₹200–500 depending on complexity.' },
            { q: 'What resolution should my images be?', a: 'For print quality, images must be at least 300 DPI (dots per inch) at final print size. Lower resolution may result in blurry or pixelated prints.' },
            { q: 'Can I see a proof before printing?', a: 'Yes! We provide digital proofs (PDF) for all orders above ₹1,000. Physical proofs are available for large orders. Please allow 1 extra business day for proofing.' },
            { q: 'What is bleed and why is it needed?', a: 'Bleed is extra space (usually 3mm) added beyond the final print size to ensure there are no white borders after trimming. If your design has a background that reaches the edges, please add 3mm bleed.' },
        ],
    },
    {
        topic: '📋 General',
        questions: [
            { q: 'Where is Sunlight Offset Printers located?', a: 'We are at No. 45, Market Street, Near Bus Stand, Coimbatore – 641 001, Tamil Nadu. Open Monday–Saturday 9AM–7PM, Sunday 10AM–4PM.' },
            { q: 'How can I contact you urgently?', a: 'Call or WhatsApp us at +91 98765 43210. We typically respond within 30 minutes during business hours.' },
            { q: 'Do you work on weekends?', a: 'We are open Saturday 9AM–6PM and Sunday 10AM–4PM. Emergency orders on public holidays can be accommodated via prior arrangement.' },
        ],
    },
];

const FAQItem = ({ q, a }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${open ? 'border-primary/30 shadow-md' : 'border-gray-100 shadow-sm'}`}>
            <button
                className="w-full flex items-center justify-between text-left p-5 hover:bg-gray-50 transition-colors"
                onClick={() => setOpen(!open)}
            >
                <span className={`font-semibold text-sm ${open ? 'text-primary' : 'text-gray-900'}`}>{q}</span>
                <div className={`flex-shrink-0 ml-4 p-1 rounded-full transition-all ${open ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
            </button>
            {open && (
                <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed animate-fade-in border-t border-gray-100 pt-4 bg-primary/5">
                    {a}
                </div>
            )}
        </div>
    );
};

const FAQ = () => {
    const [search, setSearch] = useState('');
    const [activeTopic, setActiveTopic] = useState('all');

    const filtered = FAQS.map(section => ({
        ...section,
        questions: section.questions.filter(
            faq =>
                (!search || faq.q.toLowerCase().includes(search.toLowerCase()) || faq.a.toLowerCase().includes(search.toLowerCase())) &&
                (activeTopic === 'all' || section.topic === activeTopic)
        ),
    })).filter(s => s.questions.length > 0);

    const totalResults = filtered.reduce((sum, s) => sum + s.questions.length, 0);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <div className="hero-gradient text-white py-16 relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full animate-float" />
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-5 animate-bounce-soft">
                        <span className="text-3xl">❓</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Frequently Asked Questions</h1>
                    <p className="text-white/80 text-lg mb-8">Everything you need to know about our printing services.</p>
                    {/* Search */}
                    <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-2xl text-gray-900 text-sm outline-none shadow-xl focus:ring-2 focus:ring-white/50"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Topic filter */}
                <div className="flex flex-wrap gap-2 mb-8">
                    <button
                        onClick={() => setActiveTopic('all')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTopic === 'all' ? 'bg-primary text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary/40'}`}
                    >
                        All Topics
                    </button>
                    {FAQS.map(s => (
                        <button
                            key={s.topic}
                            onClick={() => setActiveTopic(s.topic)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTopic === s.topic ? 'bg-primary text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary/40'}`}
                        >
                            {s.topic}
                        </button>
                    ))}
                </div>

                {search && (
                    <p className="text-sm text-gray-500 mb-6">{totalResults} result{totalResults !== 1 ? 's' : ''} for "<strong>{search}</strong>"</p>
                )}

                {filtered.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                        <div className="text-5xl mb-4">🤔</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
                        <p className="text-gray-500 mb-6">Can't find your answer? Talk to us directly!</p>
                        <a
                            href="https://wa.me/919876543210"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                        >
                            <MessageCircle className="h-5 w-5" />
                            <span>Chat on WhatsApp</span>
                        </a>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {filtered.map(section => (
                            <div key={section.topic}>
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                                    <span>{section.topic}</span>
                                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{section.questions.length}</span>
                                </h2>
                                <div className="space-y-3">
                                    {section.questions.map((faq, i) => <FAQItem key={i} {...faq} />)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Still have questions */}
                <div className="mt-16 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h3>
                    <p className="text-gray-500 mb-6">Our team is available 6 days a week to help you.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer"
                            className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5">
                            <MessageCircle className="h-5 w-5" /><span>WhatsApp Us</span>
                        </a>
                        <Link to="/contact" className="inline-flex items-center space-x-2 btn-primary px-6 py-3">
                            <ArrowRight className="h-5 w-5" /><span>Contact Page</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
