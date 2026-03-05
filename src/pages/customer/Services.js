import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import mockApi from '../../services/mockApi';
import MagneticBtn from '../../components/MagneticBtn';
import { ServiceCardSkeleton } from '../../components/Skeleton';
import {
  ShoppingBag,
  Star,
  Clock,
  ArrowRight,
  ArrowLeft,
  Search,
  Filter,
  Calculator,
  CheckCircle,
  Zap,
  Package,
  X,
  Check,
  Heart,
  Printer,
  Contact,
  Megaphone,
  Tag,
  Image,
  BookOpen,
  ArrowUpRight
} from 'lucide-react';

const SERVICE_IMAGES = {
  wedding: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=500&q=80',
  offset: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&q=80',
  bill: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=500&q=80',
  visiting: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500&q=80',
  poster: 'https://images.unsplash.com/photo-1569974507005-6dc61f97fb6d?w=500&q=80',
  flex: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=500&q=80',
  sticker: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=500&q=80',
  a3: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
  default: 'https://images.unsplash.com/5010923-photo-1586072dd4570fb338?w=500&q=80',
};

const SERVICE_COLORS = {
  wedding: { bg: 'rgba(84,35,68,0.08)', icon: Heart },
  offset: { bg: 'rgba(201,147,58,0.10)', icon: Printer },
  bill: { bg: 'rgba(45,122,79,0.08)', icon: BookOpen },
  visiting: { bg: 'rgba(59,130,246,0.08)', icon: Contact },
  poster: { bg: 'rgba(139,92,246,0.08)', icon: Image },
  flex: { bg: 'rgba(236,72,153,0.08)', icon: Megaphone },
  sticker: { bg: 'rgba(249,115,22,0.08)', icon: Tag },
  a3: { bg: 'rgba(20,184,166,0.08)', icon: Image },
  default: { bg: 'rgba(84,35,68,0.08)', icon: Package },
};

const getServiceIcon = (name = '') => {
  const n = name.toLowerCase();
  if (n.includes('wedding')) return { key: 'wedding', ...SERVICE_COLORS.wedding };
  if (n.includes('offset')) return { key: 'offset', ...SERVICE_COLORS.offset };
  if (n.includes('bill')) return { key: 'bill', ...SERVICE_COLORS.bill };
  if (n.includes('visiting')) return { key: 'visiting', ...SERVICE_COLORS.visiting };
  if (n.includes('poster')) return { key: 'poster', ...SERVICE_COLORS.poster };
  if (n.includes('flex')) return { key: 'flex', ...SERVICE_COLORS.flex };
  if (n.includes('sticker')) return { key: 'sticker', ...SERVICE_COLORS.sticker };
  if (n.includes('a3')) return { key: 'a3', ...SERVICE_COLORS.a3 };
  return { key: 'default', ...SERVICE_COLORS.default };
};

// Design Picker Modal
const DesignPickerModal = ({ isOpen, onClose, service, templates, onSelect }) => {
  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden relative z-10 shadow-[var(--shadow-4)] animate-modal-pop flex flex-col">
        <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between sticky top-0 bg-white z-20">
          <div>
            <h2 className="font-display text-xl font-bold text-[var(--color-ink)] flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-[var(--color-primary-glass)] flex items-center justify-center">
                <Package className="h-5 w-5 text-[var(--color-primary)]" />
              </span>
              Choose a Design
            </h2>
            <p className="text-sm text-[var(--color-ink-muted)] mt-1">Select from {templates.length}+ templates</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[var(--color-cream)] rounded-full transition-colors text-[var(--color-ink-muted)]">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div key={template.id} className="group relative rounded-xl overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:ring-2 hover:ring-[var(--color-primary)]/20 transition-all duration-200 cursor-pointer" onClick={() => onSelect(template)}>
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={template.image_url} alt={template.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-3 bg-white">
                  <p className="font-semibold text-sm text-[var(--color-ink)] truncate">{template.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-cream)] flex justify-end gap-3">
          <button onClick={onClose} className="btn-ghost px-5 py-2 text-sm">Cancel</button>
        </div>
      </div>
    </div>
  );
};

// Premium Service Card with Hover Reveal
const ServiceCard = ({ service, onOpenPicker }) => {
  const { key, bg, icon: IconComponent } = getServiceIcon(service.name);
  const imgSrc = SERVICE_IMAGES[key] || SERVICE_IMAGES.default;

  return (
    <div className="service-card group cursor-pointer" onClick={() => onOpenPicker(service)}>
      <div className="relative rounded-xl overflow-hidden h-36 mb-4">
        <img src={imgSrc} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-xs font-semibold text-[var(--color-ink)]">{service.gst_rate}% GST</span>
        </div>
      </div>

      <div className="service-card-icon" style={{ background: bg }}>
        <IconComponent className="h-5 w-5 text-[var(--color-primary)]" />
      </div>

      <h3 className="font-display font-bold text-lg text-[var(--color-ink)] mb-2">{service.name}</h3>
      <p className="text-sm text-[var(--color-ink-muted)] line-clamp-2 mb-4">{service.description}</p>

      <div className="pt-4 border-t border-dashed border-[var(--color-border)]">
        <div className="flex items-baseline gap-1">
          <span className="service-card-price-prefix">from</span>
          <span className="service-card-price text-xl">₹{service.base_price.toFixed(0)}</span>
          <span className="text-xs text-[var(--color-ink-muted)]">/copy</span>
        </div>
      </div>

      <div className="service-card-cta">
        <span className="font-semibold text-sm">Get Quote</span>
        <ArrowUpRight className="h-4 w-4" />
      </div>
    </div>
  );
};

// Main Component
const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [pickerModal, setPickerModal] = useState({ isOpen: false, service: null, templates: [] });
  const [calcService, setCalcService] = useState(null);
  const [calcQuantity, setCalcQuantity] = useState(100);
  const [calcResult, setCalcResult] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'wedding', label: 'Cards' },
    { id: 'offset', label: 'Print' },
    { id: 'visiting', label: 'Business' },
    { id: 'flex', label: 'Banners' },
    { id: 'sticker', label: 'Stickers' },
  ];

  useEffect(() => { fetchServices(); }, []);

  useEffect(() => {
    let filtered = services;
    if (activeCategory !== 'all') {
      filtered = services.filter(s => s.name.toLowerCase().includes(activeCategory));
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(s => s.name.toLowerCase().includes(lower) || s.description.toLowerCase().includes(lower));
    }
    setFilteredServices(filtered);
  }, [searchTerm, services, activeCategory]);

  const fetchServices = async () => {
    try {
      const response = await mockApi.getServices();
      setServices(response.data);
      setFilteredServices(response.data);
      if (response.data.length > 0) setCalcService(response.data[0]);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!calcService) return;
    const base = calcService.base_price * calcQuantity;
    let discount = 0;
    if (calcQuantity >= 500) discount = 0.15;
    else if (calcQuantity >= 100) discount = 0.10;
    else if (calcQuantity >= 50) discount = 0.05;
    const net = base * (1 - discount);
    const gst = net * (calcService.gst_rate / 100);
    setCalcResult({ subtotal: net, gst, total: net + gst, discountPercent: discount * 100 });
  }, [calcService, calcQuantity]);

  const openPicker = async (service) => {
    setLoading(true);
    try {
      const res = await mockApi.getTemplatesByService(service.id);
      setPickerModal({ isOpen: true, service, templates: res.data });
    } catch (err) {
      console.error('Failed to load templates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (template) => {
    navigate(`/customer/create-order?service=${pickerModal.service.id}&template=${template.id}`);
  };

  return (
    <div className="space-y-12">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[var(--color-ink-muted)] hover:text-[var(--color-primary)] transition-colors">
        <ArrowLeft className="h-5 w-5" />
        <span className="font-semibold">Back to Home</span>
      </button>

      {/* Price Calculator */}
      <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="relative z-10 lg:grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-white/80 text-xs font-semibold uppercase tracking-wider">
              <Calculator className="h-4 w-4" />
              <span>Instant Pricing</span>
            </div>
            <h2 className="font-display text-3xl font-bold text-white">Estimate Your Cost</h2>
            <p className="text-white/60">Get live pricing with bulk discounts & GST included.</p>
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <p className="text-xs text-white/50 uppercase font-semibold">Subtotal</p>
                <p className="price text-2xl font-bold text-white">₹{calcResult?.subtotal.toFixed(0)}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <p className="text-xs text-white/50 uppercase font-semibold">GST {calcService?.gst_rate}%</p>
                <p className="price text-2xl font-bold text-[var(--color-gold-light)]">₹{calcResult?.gst.toFixed(0)}</p>
              </div>
              <div className="bg-[var(--color-gold)] rounded-xl p-4 shadow-lg">
                <p className="text-xs text-white/70 uppercase font-semibold">Total</p>
                <p className="price text-3xl font-bold text-white">₹{calcResult?.total.toFixed(0)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 mt-8 lg:mt-0">
            <div>
              <label className="text-sm font-semibold text-white/90 mb-2 block">Select Service</label>
              <select
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:ring-2 focus:ring-[var(--color-gold)] outline-none backdrop-blur-sm transition-all"
                value={calcService?.id}
                onChange={(e) => setCalcService(services.find(s => s.id === Number(e.target.value)))}
              >
                {services.map(s => <option key={s.id} value={s.id} className="text-gray-900">{s.name}</option>)}
              </select>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-white/90">Quantity</label>
                <span className="price text-xl font-bold text-[var(--color-gold)]">{calcQuantity} units</span>
              </div>
              <input type="range" min="1" max="5000" step="10" value={calcQuantity} onChange={(e) => setCalcQuantity(Number(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--color-gold)]" />
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-white/40">1</span>
                <span className="text-[10px] text-white/40">5000+</span>
              </div>
            </div>
            {calcResult?.discountPercent > 0 && (
              <div className="flex items-center gap-3 bg-[var(--color-gold)]/20 text-[var(--color-gold-light)] p-4 rounded-xl border border-[var(--color-gold)]/30">
                <Zap className="h-5 w-5" />
                <div>
                  <p className="font-bold">Bulk Discount Unlocked!</p>
                  <p className="text-sm text-white/70">{calcResult.discountPercent}% off on {calcQuantity}+ units</p>
                </div>
              </div>
            )}
            <MagneticBtn as={Link} to={`/customer/create-order?service=${calcService?.id}&quantity=${calcQuantity}`} className="btn-gold w-full py-4 text-center">
              Proceed to Order
            </MagneticBtn>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div>
        <div className="section-label text-center justify-center">
          What We Offer
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat.id 
                  ? 'bg-[var(--color-primary)] text-white shadow-md' 
                  : 'bg-white text-[var(--color-ink-muted)] border border-[var(--color-border)] hover:border-[var(--color-primary)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-ink-faint)]" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-12"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)
          ) : filteredServices.length > 0 ? (
            filteredServices.map(service => <ServiceCard key={service.id} service={service} onOpenPicker={openPicker} />)
          ) : (
            <div className="empty-state col-span-full">
              <Search className="empty-state-icon" />
              <h3 className="empty-state-title">No Services Found</h3>
              <p className="empty-state-text">Try adjusting your search or filter criteria</p>
              <button onClick={() => { setSearchTerm(''); setActiveCategory('all'); }} className="btn-primary">Clear Filters</button>
            </div>
          )}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-[var(--color-cream)] border-t border-b border-[var(--color-border)] py-16">
        <div className="max-w-6xl mx-auto">
          <div className="section-label text-center justify-center">
            Why Choose Us
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Premium Quality', desc: 'State-of-the-art printing technology & premium materials', icon: Star },
              { title: 'Fast Delivery', desc: 'Quick turnaround with free delivery on orders above ₹500', icon: Clock },
              { title: 'Best Pricing', desc: 'Competitive prices with transparent GST billing', icon: Calculator },
            ].map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--color-primary-glass)] flex items-center justify-center">
                  <feature.icon className="h-8 w-8 text-[var(--color-primary)]" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-[var(--color-ink-muted)]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DesignPickerModal 
        isOpen={pickerModal.isOpen} 
        onClose={() => setPickerModal({ ...pickerModal, isOpen: false })} 
        service={pickerModal.service} 
        templates={pickerModal.templates} 
        onSelect={handleTemplateSelect} 
      />
    </div>
  );
};

export default Services;
