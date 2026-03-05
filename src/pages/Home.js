import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Star, ChevronLeft, ChevronRight,
  Clock, CheckCircle, Award, Users, Phone,
  Image, Calculator, Printer, Heart, Zap, Shield, Package,
  ArrowUpRight, Gem, Contact, BookOpen, Megaphone, Tag
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const SLIDE_META = [
  { 
    ctaLink: '/get-quote', 
    bg: 'from-[#542344] via-[#3d1832] to-[#6b2654]', 
    image: 'https://images.unsplash.com/photo-1599720234625-424a1f3e6f13?w=800&q=80&auto=format&fit=crop&crop=entropy',
    bgImage: 'https://images.unsplash.com/photo-1599720234625-424a1f3e6f13?w=1920&q=80&auto=format&fit=crop&crop=entropy'
  },
  { 
    ctaLink: '/customer/services', 
    bg: 'from-[#1a3a5c] via-[#112840] to-[#1e4976]', 
    image: 'https://images.unsplash.com/photo-1600858621957-c9a39a7b4d7e?w=800&q=80&auto=format&fit=crop&crop=entropy',
    bgImage: 'https://images.unsplash.com/photo-1600858621957-c9a39a7b4d7e?w=1920&q=80&auto=format&fit=crop&crop=entropy'
  },
  { 
    ctaLink: '/gallery', 
    bg: 'from-[#1a4a2e] via-[#103320] to-[#1e5c38]', 
    image: 'https://images.unsplash.com/photo-1577720643272-265e434f6b5f?w=800&q=80&auto=format&fit=crop&crop=entropy',
    bgImage: 'https://images.unsplash.com/photo-1577720643272-265e434f6b5f?w=1920&q=80&auto=format&fit=crop&crop=entropy'
  },
];

const HERO_SERVICES = [
  { icon: Gem, name: 'Wedding', href: '/customer/services?category=wedding' },
  { icon: Printer, name: 'Offset', href: '/customer/services?category=offset' },
  { icon: Contact, name: 'Business', href: '/customer/services?category=visiting' },
  { icon: Megaphone, name: 'Banners', href: '/customer/services?category=flex' },
  { icon: Tag, name: 'Stickers', href: '/customer/services?category=sticker' },
  { icon: BookOpen, name: 'Books', href: '/customer/services?category=bill' },
];

const STAT_META = [
  { value: 500, suffix: '+', icon: Heart, key: 'happyCustomers' },
  { value: 1000, suffix: '+', icon: Printer, key: 'projectsDone' },
  { value: 8, suffix: '+', icon: Award, key: 'yearsExp' },
  { value: 250, suffix: '+', icon: Star, key: 'starReviews' },
];

const SERVICES = [
  { id: 1, emoji: '💒', name: 'Wedding Invitations', desc: 'Premium cards for your special day', price: '₹5', color: 'from-pink-50 to-rose-50', border: 'border-pink-200' },
  { id: 2, emoji: '🖨️', name: 'Offset Printing', desc: 'High-volume precision print jobs', price: '₹0.80', color: 'from-blue-50 to-indigo-50', border: 'border-blue-200' },
  { id: 3, emoji: '💼', name: 'Visiting Cards', desc: 'Make a great first impression', price: '₹1.50', color: 'from-emerald-50 to-teal-50', border: 'border-emerald-200' },
  { id: 4, emoji: '📣', name: 'Flex Banners', desc: 'Large format outdoor advertising', price: '₹25', color: 'from-orange-50 to-amber-50', border: 'border-orange-200' },
  { id: 5, emoji: '🏷️', name: 'Sticker Printing', desc: 'Custom labels in any shape', price: '₹30', color: 'from-purple-50 to-violet-50', border: 'border-purple-200' },
  { id: 6, emoji: '📋', name: 'Poster Printing', desc: 'Vibrant A1/A2 event posters', price: '₹80', color: 'from-yellow-50 to-lime-50', border: 'border-yellow-200' },
];

const TESTIMONIALS = [
  { name: 'Rajesh Kumar', role: 'Business Owner', text: 'Absolutely stunning wedding cards! Everyone at the wedding was asking who printed them. Fast delivery too.', rating: 5, avatar: 'RK', color: 'bg-rose-500' },
  { name: 'Priya Sharma', role: 'Marketing Manager', text: 'We ordered 5000 brochures for our product launch. The quality was excellent and delivered right on time.', rating: 5, avatar: 'PS', color: 'bg-indigo-500' },
  { name: 'Mohan Dass', role: 'Shop Owner', text: 'My flex banner looks amazing! Very professional printing at an affordable price. Highly recommended.', rating: 5, avatar: 'MD', color: 'bg-emerald-500' },
];

const MARQUEE_ITEMS = [
  'Wedding Cards', 'Offset Print', 'Visiting Cards', 'Flex Banners', 'Stickers', 'Posters',
  'Wedding Cards', 'Offset Print', 'Visiting Cards', 'Flex Banners', 'Stickers', 'Posters',
];

const Counter = ({ end, suffix, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const step = Math.max(1, Math.floor(end / (duration / 16)));
        const timer = setInterval(() => {
          setCount(c => {
            if (c + step >= end) { clearInterval(timer); return end; }
            return c + step;
          });
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref} className="price counter-animate">{count}{suffix}</span>;
};

const RevealSection = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${visible ? 'visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

const Home = () => {
  const { t } = useLanguage();
  const [heroIndex, setHeroIndex] = useState(0);
  const [serviceIndex, setServiceIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isHeroAnimating, setIsHeroAnimating] = useState(false);
  const [imageError, setImageError] = useState({});

  const HERO_SLIDES = SLIDE_META.map((meta, i) => ({ ...meta, id: i + 1, ...t.hero[i] }));
  const STATS = STAT_META.map(s => ({ ...s, label: t.stats[s.key] }));

  useEffect(() => {
    const t = setInterval(() => changeHero((heroIndex + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, [heroIndex]);

  useEffect(() => {
    const t = setInterval(() => setTestimonialIndex(i => (i + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const changeHero = useCallback((idx) => {
    setIsHeroAnimating(true);
    setTimeout(() => { setHeroIndex(idx); setIsHeroAnimating(false); }, 300);
  }, []);

  const handleImageError = (index) => {
    setImageError(prev => ({ ...prev, [index]: true }));
  };

  const slide = HERO_SLIDES[heroIndex];

  return (
    <div className="overflow-hidden bg-[var(--color-cream)]">

      {/* Marquee Ticker */}
      <div className="bg-[var(--color-primary)] text-white py-3 ticker-wrapper">
        <div className="ticker-content">
          {MARQUEE_ITEMS.concat(MARQUEE_ITEMS).map((item, i) => (
            <span key={i} className="mx-6 text-sm font-semibold uppercase tracking-widest opacity-90 flex items-center">
              {item} <span className="mx-4 text-[var(--color-gold)]">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* Hero Section - Premium Professional Design */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background - Gradient with image overlay */}
        <div className="absolute inset-0 z-0">
          {/* Dark gradient background base */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] via-[#441f37] to-[var(--color-primary-dark)]" />
          
          {/* Animated decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-gold)]/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--color-gold)]/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          
          {/* Grid pattern overlay (subtle) */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(90deg, white 1px, transparent 1px), linear-gradient(white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content - Text & CTA */}
            <div className={`space-y-8 transition-all duration-700 ${isHeroAnimating ? 'opacity-0 -translate-x-8' : 'opacity-100 translate-x-0'}`}>
              {/* Animated Badge */}
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-3 rounded-full hover:bg-white/15 transition-all duration-300">
                <span className="w-2 h-2 bg-[var(--color-gold)] rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-white/90">{slide.tag}</span>
              </div>

              {/* Premium Title */}
              <div className="space-y-6">
                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
                  {slide.title}
                </h1>
                
                {/* Accent line with color gradient */}
                <div className="flex items-center gap-4">
                  <div className="h-1.5 w-16 bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold)]/40 rounded-full" />
                  <span className="text-[var(--color-gold)] font-semibold text-sm tracking-widest uppercase">Premium Printing</span>
                </div>
              </div>

              {/* Subtitle with better readability */}
              <p className="text-lg md:text-xl text-white/80 max-w-lg leading-relaxed font-light">
                {slide.subtitle}
              </p>

              {/* Feature Icons Row */}
              <div className="flex flex-col sm:flex-row gap-6 pt-4">
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-[var(--color-gold)]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--color-gold)]/30 transition-colors">
                    <Shield className="w-6 h-6 text-[var(--color-gold)]" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">GST Registered</p>
                    <p className="text-xs text-white/60">100% Certified Quality</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-[var(--color-gold)]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--color-gold)]/30 transition-colors">
                    <Zap className="w-6 h-6 text-[var(--color-gold)]" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">Fast Delivery</p>
                    <p className="text-xs text-white/60">24-48 Hours</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-8">
                <Link 
                  to={slide.ctaLink} 
                  className="group inline-flex items-center gap-2 bg-[var(--color-gold)] text-[var(--color-primary)] px-8 py-4 rounded-xl font-bold hover:bg-[var(--color-gold-light)] transition-all hover:shadow-lg hover:shadow-[var(--color-gold)]/40 hover:scale-105 duration-300"
                >
                  <span>{slide.cta}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/customer/services" 
                  className="inline-flex items-center gap-2 border-2 border-white/40 text-white px-8 py-4 rounded-xl font-semibold hover:border-white hover:bg-white/10 transition-all duration-300"
                >
                  Explore Services
                </Link>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 pt-12 border-t border-white/10">
                <div className="group">
                  <p className="text-3xl font-black text-[var(--color-gold)] font-mono">500+</p>
                  <p className="text-xs text-white/70 mt-2 font-medium">Happy Customers</p>
                </div>
                <div className="group">
                  <p className="text-3xl font-black text-[var(--color-gold)] font-mono">1000+</p>
                  <p className="text-xs text-white/70 mt-2 font-medium">Projects Done</p>
                </div>
                <div className="group">
                  <p className="text-3xl font-black text-[var(--color-gold)] font-mono">8+</p>
                  <p className="text-xs text-white/70 mt-2 font-medium">Years in Business</p>
                </div>
              </div>
            </div>

            {/* Right Side - Image with floating elements */}
            <div className={`relative hidden lg:flex justify-center items-center transition-all duration-700 ${isHeroAnimating ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'}`}>
              <div className="relative w-full max-w-lg">
                {/* Floating background glow */}
                <div className="absolute -inset-6 bg-gradient-to-br from-[var(--color-gold)]/20 to-[var(--color-primary)]/20 rounded-3xl blur-3xl animate-pulse" />
                
                {/* Main image container with premium frame */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-sm group hover:shadow-2xl hover:shadow-[var(--color-gold)]/30 transition-all duration-500 bg-white/5">
                  {imageError[heroIndex] ? (
                    <div className="w-full h-[480px] bg-gradient-to-br from-[var(--color-gold)]/20 to-[var(--color-primary)]/20 flex items-center justify-center">
                      <div className="text-center">
                        <Image className="w-12 h-12 text-white/50 mx-auto mb-2" />
                        <p className="text-white/60 text-sm">Loading image...</p>
                      </div>
                    </div>
                  ) : (
                    <img 
                      src={slide.image} 
                      alt={slide.title}
                      className="w-full h-[480px] object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={() => handleImageError(heroIndex)}
                      loading="lazy"
                    />
                  )}
                  {/* Premium gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/40 via-transparent to-transparent" />
                </div>

                {/* Floating rating card - Premium Style */}
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-2xl border border-[var(--color-border)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all duration-300 group">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-light)] rounded-xl flex items-center justify-center shadow-lg">
                        <Star className="w-8 h-8 text-white fill-white" />
                      </div>
                    </div>
                    <div>
                      <p className="text-3xl font-black text-[var(--color-primary)]">4.9</p>
                      <p className="text-xs text-[var(--color-ink-muted)] font-medium">250+ Reviews</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Service Quick Links Grid */}
          <div className={`mt-20 pt-16 border-t border-white/10 transition-all duration-700 delay-300 ${isHeroAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Our Popular Services</h3>
              <p className="text-white/70 font-light">Quick access to our most requested printing solutions</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {HERO_SERVICES.map((service) => (
                <Link
                  key={service.name}
                  to={service.href}
                  className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-white/5 border border-white/10 hover:border-[var(--color-gold)]/50 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-[var(--color-gold)]/10"
                >
                  <div className="w-12 h-12 bg-[var(--color-gold)]/15 group-hover:bg-[var(--color-gold)]/30 rounded-xl flex items-center justify-center transition-all duration-300">
                    <service.icon className="w-6 h-6 text-[var(--color-gold)] group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-sm font-semibold text-white text-center group-hover:text-[var(--color-gold)] transition-colors">{service.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center justify-center gap-4 mt-14">
            <button 
              onClick={() => changeHero((heroIndex - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
              className="p-3 rounded-full border border-white/20 hover:border-[var(--color-gold)] hover:bg-white/10 text-white/70 hover:text-[var(--color-gold)] transition-all duration-300 backdrop-blur-sm"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => changeHero(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === heroIndex 
                      ? 'w-8 h-2 bg-[var(--color-gold)]' 
                      : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <button 
              onClick={() => changeHero((heroIndex + 1) % HERO_SLIDES.length)}
              className="p-3 rounded-full border border-white/20 hover:border-[var(--color-gold)] hover:bg-white/10 text-white/70 hover:text-[var(--color-gold)] transition-all duration-300 backdrop-blur-sm"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-white py-16 border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <RevealSection key={stat.label} delay={i * 100}>
                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-[var(--color-primary-glass)] rounded-2xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="h-6 w-6 text-[var(--color-primary)]" />
                  </div>
                  <div className="text-4xl md:text-5xl font-black text-[var(--color-ink)]" style={{ fontFamily: 'var(--font-mono)' }}>
                    <Counter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-[var(--color-ink-muted)] font-medium mt-1">{stat.label}</div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-[var(--color-cream)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="text-center mb-12">
              <span className="section-label">What We Offer</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--color-ink)] mb-3">Everything You Need to Print</h2>
              <p className="text-[var(--color-ink-muted)] max-w-2xl mx-auto">Premium quality printing services for all your personal and business needs.</p>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.slice(serviceIndex, serviceIndex + 6).concat(
              serviceIndex + 6 > SERVICES.length ? SERVICES.slice(0, (serviceIndex + 6) - SERVICES.length) : []
            ).slice(0, 6).map((service, i) => (
              <RevealSection key={service.id} delay={i * 80}>
                <div className={`card group cursor-pointer`}>
                  <div className="relative rounded-xl overflow-hidden h-40 mb-4">
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color}`} />
                    <div className="absolute inset-0 flex items-center justify-center text-6xl">{service.emoji}</div>
                    <div className="absolute bottom-3 right-3">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-bold text-[var(--color-ink)] price">₹{service.price}</span>
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-lg text-[var(--color-ink)] mb-1">{service.name}</h3>
                  <p className="text-sm text-[var(--color-ink-muted)] mb-4">{service.desc}</p>
                  <Link to="/get-quote" className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)] group-hover:gap-2 transition-all">
                    Get Quote <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </RevealSection>
            ))}
          </div>

          <div className="flex justify-center items-center space-x-4 mt-10">
            <button onClick={() => setServiceIndex(i => (i - 3 + SERVICES.length) % SERVICES.length)} className="p-2.5 bg-white border border-[var(--color-border)] rounded-full hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-glass)] transition-all shadow-sm">
              <ChevronLeft className="h-5 w-5 text-[var(--color-ink-muted)]" />
            </button>
            <Link to="/services" className="btn-primary px-8 py-2.5 text-sm">
              View All Services
            </Link>
            <button onClick={() => setServiceIndex(i => (i + 3) % SERVICES.length)} className="p-2.5 bg-white border border-[var(--color-border)] rounded-full hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-glass)] transition-all shadow-sm">
              <ChevronRight className="h-5 w-5 text-[var(--color-ink-muted)]" />
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="text-center mb-14">
              <span className="section-label">Why Choose Us</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--color-ink)]">The Sunlight Difference</h2>
            </div>
          </RevealSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Lightning Fast', desc: 'Most orders delivered in 1–3 business days. Rush orders available.', color: 'from-yellow-400 to-amber-500' },
              { icon: Shield, title: '100% Quality', desc: 'Every order goes through strict quality control until you\'re delighted.', color: 'from-green-400 to-emerald-500' },
              { icon: Calculator, title: 'GST Invoices', desc: 'Proper GST billing with itemised invoices for all business orders.', color: 'from-blue-400 to-indigo-500' },
            ].map((feat, i) => (
              <RevealSection key={feat.title} delay={i * 100}>
                <div className="card text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feat.color} rounded-2xl mb-4 shadow-lg`}>
                    <feat.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-[var(--color-ink)] mb-2">{feat.title}</h3>
                  <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">{feat.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[var(--color-cream)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="text-center mb-12">
              <span className="section-label">Testimonials</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--color-ink)] mb-3">What Our Customers Say</h2>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[0, 1, 2].map(offset => {
              const t = TESTIMONIALS[(testimonialIndex + offset) % TESTIMONIALS.length];
              return (
                <div key={`${testimonialIndex}-${offset}`} className="card animate-fade-in" style={{ animationDelay: `${offset * 100}ms` }}>
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[var(--color-gold)] text-[var(--color-gold)]" />
                    ))}
                  </div>
                  <p className="text-[var(--color-ink-muted)] text-sm leading-relaxed mb-5 italic font-light">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className={`${t.color} text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0`}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--color-ink)] text-sm">{t.name}</p>
                      <p className="text-xs text-[var(--color-ink-faint)]">{t.role}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center items-center space-x-3">
            <button onClick={() => setTestimonialIndex(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)} className="p-2.5 bg-white border border-[var(--color-border)] rounded-full hover:border-[var(--color-primary)] shadow-sm transition-all">
              <ChevronLeft className="h-5 w-5 text-[var(--color-ink-muted)]" />
            </button>
            <div className="flex space-x-2">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setTestimonialIndex(i)} className={`rounded-full transition-all duration-300 ${i === testimonialIndex ? 'bg-[var(--color-primary)] w-8 h-2' : 'bg-[var(--color-border)] w-2 h-2'}`} />
              ))}
            </div>
            <button onClick={() => setTestimonialIndex(i => (i + 1) % TESTIMONIALS.length)} className="p-2.5 bg-white border border-[var(--color-border)] rounded-full hover:border-[var(--color-primary)] shadow-sm transition-all">
              <ChevronRight className="h-5 w-5 text-[var(--color-ink-muted)]" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 hero-gradient text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full animate-float" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -translate-x-24 -translate-y-24" />
        
        {/* Diagonal pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, white 10px, white 11px)' }} />

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <RevealSection>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Ready to Print?</h2>
            <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto">Get a free quote for your printing needs. Our team is ready to help!</p>
            <Link to="/get-quote" className="btn-gold inline-flex items-center gap-2 px-8 py-3.5 text-base">
              <Calculator className="h-5 w-5" />
              <span>Get Free Quote</span>
            </Link>
          </RevealSection>
        </div>
      </section>
    </div>
  );
};

export default Home;
