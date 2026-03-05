import React, { useEffect, useRef, useState } from 'react';
import { Sun, Users, Award, Clock, CheckCircle, Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Scroll-reveal hook
const useReveal = (threshold = 0.15) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, visible];
};

const RevealDiv = ({ children, className = '', delay = 0, direction = 'up' }) => {
  const [ref, visible] = useReveal();
  const initial = direction === 'left' ? 'translate-x-[-40px]' : direction === 'right' ? 'translate-x-[40px]' : 'translate-y-[32px]';
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${initial}`} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const TEAM = [
  { initials: 'SK', name: 'Sundar Kumar', role: 'Founder & Owner', desc: '20+ years of printing expertise, started Sunlight Printers with a passion for quality.', color: 'bg-rose-500' },
  { initials: 'RP', name: 'Ramesh Prabhu', role: 'Production Manager', desc: 'Oversees all print operations and ensures every job meets our high quality standards.', color: 'bg-indigo-500' },
  { initials: 'MV', name: 'Meena Vanitha', role: 'Customer Relations', desc: 'First point of contact for customers — dedicated to ensuring a smooth experience.', color: 'bg-emerald-500' },
];

const MILESTONES = [
  { year: '2015', event: 'Founded Sunlight Offset Printers with a single Risograph machine.' },
  { year: '2017', event: 'Expanded to full offset printing with professional-grade equipment.' },
  { year: '2019', event: 'Launched flex and large-format printing services.' },
  { year: '2022', event: 'Crossed 500 happy customers and launched the online ordering portal.' },
  { year: '2024', event: 'Added digital printing and A3+ colour printing services.' },
];

const STATS = [
  { value: '500+', label: 'Happy Customers', icon: Users },
  { value: '8+', label: 'Years in Business', icon: Clock },
  { value: '1000+', label: 'Projects Done', icon: Award },
  { value: '4.9★', label: 'Average Rating', icon: Star },
];

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="hero-gradient text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-48 -translate-y-24 animate-float" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <RevealDiv><div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-6 animate-bounce-soft">
            <Sun className="h-10 w-10 text-white" />
          </div></RevealDiv>
          <RevealDiv delay={100}>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-5">About <span className="text-yellow-300">Sunlight</span> Offset Printers</h1>
          </RevealDiv>
          <RevealDiv delay={200}>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Your trusted partner for premium quality printing services in Coimbatore — since 2015!
            </p>
          </RevealDiv>
          <RevealDiv delay={300}>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <Link to="/get-quote" className="inline-flex items-center space-x-2 bg-white text-primary font-bold px-6 py-3 rounded-xl hover:-translate-y-1 transition-all shadow-lg">
                <span>Get a Free Quote</span><ChevronRight className="h-4 w-4" />
              </Link>
              <Link to="/gallery" className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white font-bold px-6 py-3 rounded-xl hover:-translate-y-1 transition-all">
                <span>View Our Work</span>
              </Link>
            </div>
          </RevealDiv>
        </div>
      </div>

      {/* ── Stats Row ────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <RevealDiv key={s.label} delay={i * 80} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-2xl mb-3">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="text-2xl font-extrabold text-primary">{s.value}</div>
                <div className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</div>
              </RevealDiv>
            ))}
          </div>
        </div>
      </div>

      {/* ── Story + Values ───────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Story */}
          <RevealDiv direction="left">
            <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">Our Story</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-5">From a Small Local Shop to a Trusted Name</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>Founded in 2015 with a single machine and big dreams, Sunlight Offset Printers started as a small neighbourhood print shop in the heart of Coimbatore. What began as a simple venture quickly grew into a full-service printing powerhouse.</p>
              <p>Today, we offer over 9 different printing services — from delicate wedding invitations to massive flex banners — all under one roof. Our commitment to quality and customer satisfaction has earned us the trust of 500+ businesses and individuals.</p>
              <p>We combine traditional printing craftsmanship with the latest digital technology to deliver results that exceed expectations — every single time.</p>
            </div>
          </RevealDiv>

          {/* Values */}
          <RevealDiv direction="right" delay={100}>
            <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">Our Values</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6">What We Stand For</h2>
            <div className="space-y-4">
              {[
                { icon: Award, title: 'Quality Excellence', desc: 'Every print job goes through rigorous quality checks — we only ship what we\'d be proud to present ourselves.', bg: 'bg-amber-50', iconColor: 'text-amber-600' },
                { icon: Users, title: 'Customer First', desc: 'We listen, understand your needs, and go the extra mile to make sure you\'re completely satisfied.', bg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
                { icon: Clock, title: 'Timely Delivery', desc: 'We understand deadlines. Our efficient workflow ensures on-time delivery, every time.', bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
                { icon: CheckCircle, title: 'Transparent Pricing', desc: 'No hidden charges. What you see on the quote is exactly what you pay — with proper GST invoicing.', bg: 'bg-rose-50', iconColor: 'text-rose-600' },
              ].map((v, i) => (
                <div key={v.title} className="flex items-start space-x-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm card-hover"
                  style={{ animationDelay: `${i * 100}ms` }}>
                  <div className={`p-2.5 ${v.bg} rounded-xl flex-shrink-0`}>
                    <v.icon className={`h-5 w-5 ${v.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-0.5">{v.title}</h3>
                    <p className="text-gray-500 text-sm">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </RevealDiv>
        </div>

        {/* ── Timeline ───────────────────────────────────────────────────── */}
        <div className="mb-20">
          <RevealDiv className="text-center mb-12">
            <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-3">Our Journey</span>
            <h2 className="text-3xl font-extrabold text-gray-900">Milestones That Define Us</h2>
          </RevealDiv>
          <div className="relative max-w-3xl mx-auto">
            {/* Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary/20 hidden sm:block" />
            <div className="space-y-6">
              {MILESTONES.map((m, i) => (
                <RevealDiv key={m.year} delay={i * 100} className="flex items-start space-x-6">
                  <div className="relative flex-shrink-0 z-10">
                    <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center font-bold text-xs text-center leading-tight animate-pulse-glow">
                      {m.year}
                    </div>
                  </div>
                  <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 card-hover">
                    <p className="text-gray-700 text-sm leading-relaxed">{m.event}</p>
                  </div>
                </RevealDiv>
              ))}
            </div>
          </div>
        </div>

        {/* ── Team ───────────────────────────────────────────────────────── */}
        <div>
          <RevealDiv className="text-center mb-12">
            <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-3">Meet the Team</span>
            <h2 className="text-3xl font-extrabold text-gray-900">The People Behind the Prints</h2>
          </RevealDiv>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEAM.map((member, i) => (
              <RevealDiv key={member.name} delay={i * 120}>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center card-hover">
                  <div className={`${member.color} text-white w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-2xl mx-auto mb-4 animate-float`}
                    style={{ animationDelay: `${i * 0.5}s` }}>
                    {member.initials}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-primary text-sm font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-500 text-sm">{member.desc}</p>
                </div>
              </RevealDiv>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <div className="hero-gradient text-white py-16">
        <RevealDiv className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Let's Create Something Beautiful Together</h2>
          <p className="text-white/80 mb-8">Get in touch for a free consultation and quote. No commitment required!</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/get-quote" className="bg-white text-primary font-bold px-8 py-3.5 rounded-xl hover:-translate-y-1 transition-all shadow-lg">Get Free Quote</Link>
            <Link to="/contact" className="bg-white/20 backdrop-blur-sm text-white font-bold px-8 py-3.5 rounded-xl hover:-translate-y-1 transition-all">Contact Us</Link>
          </div>
        </RevealDiv>
      </div>
    </div>
  );
};

export default About;
