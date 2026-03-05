import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Sun,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Search,
  Package,
  Printer,
  Image,
  Megaphone,
  Tag,
  Contact,
  BookOpen,
  ArrowRight,
  Heart
} from 'lucide-react';

import DarkModeToggle from './DarkModeToggle';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../contexts/LanguageContext';

const serviceCategories = [
  { name: 'Wedding Cards', icon: Heart, href: '/customer/services?category=wedding' },
  { name: 'Business Cards', icon: Contact, href: '/customer/services?category=visiting' },
  { name: 'Bill Books', icon: BookOpen, href: '/customer/services?category=bill' },
  { name: 'Posters', icon: Image, href: '/customer/services?category=poster' },
  { name: 'Flex & Banners', icon: Megaphone, href: '/customer/services?category=flex' },
  { name: 'Stickers', icon: Tag, href: '/customer/services?category=sticker' },
  { name: 'Offset Print', icon: Printer, href: '/customer/services?category=offset' },
  { name: 'A3+ Colour', icon: Image, href: '/customer/services?category=a3' },
];

const Layout = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
    setActiveMegaMenu(null);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/customer/services?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/customer/services', isMegaMenu: true },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Get Quote', href: '/get-quote', isCTA: true },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex flex-col">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="bg-[var(--color-primary)] rounded-xl p-2 relative overflow-hidden">
              <Sun className="h-5 w-5 text-white group-hover:animate-pulse" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[var(--color-gold)] rounded-full animate-ping" />
            </div>
            <span className="text-lg font-bold text-[var(--color-ink)]">Sunlight <span className="text-[var(--color-primary)]">Printers</span></span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => (
              item.isCTA ? (
                <Link
                  key={item.name}
                  to={item.href}
                  className="ml-2 px-5 py-2 text-sm font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] rounded-full transition-all hover:shadow-lg hover:shadow-primary/30"
                >
                  {item.name}
                </Link>
              ) : item.isMegaMenu ? (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setActiveMegaMenu('services')}
                  onMouseLeave={() => setActiveMegaMenu(null)}
                >
                  <Link
                    to={item.href}
                    className={`px-4 py-2 text-sm font-medium transition-all flex items-center gap-1 ${isActive(item.href) ? 'text-[var(--color-primary)]' : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'}`}
                  >
                    {item.name}
                    <ChevronDown className={`h-4 w-4 transition-transform ${activeMegaMenu === 'services' ? 'rotate-180' : ''}`} />
                  </Link>
                  {activeMegaMenu === 'services' && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[480px] bg-white rounded-2xl shadow-[var(--shadow-4)] border border-[var(--color-border)] p-4 animate-fade-in">
                      <div className="grid grid-cols-2 gap-2">
                        {serviceCategories.map((cat) => (
                          <Link
                            key={cat.name}
                            to={cat.href}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--color-cream)] transition-colors group"
                          >
                            <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-glass)] flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                              <cat.icon className="h-5 w-5 text-[var(--color-primary)] group-hover:text-white" />
                            </div>
                            <span className="text-sm font-medium text-[var(--color-ink)]">{cat.name}</span>
                          </Link>
                        ))}
                      </div>
                      <Link to="/customer/services" className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-[var(--color-border)] text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-light)] transition-colors">
                        View All Services <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 text-sm font-medium transition-all relative group ${isActive(item.href) ? 'text-[var(--color-primary)]' : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'}`}
                >
                  {item.name}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[var(--color-gold)] group-hover:w-full transition-all duration-300 rounded-full" />
                </Link>
              )
            ))}
          </nav>

          {/* Auth + Search + DarkMode */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center bg-[var(--color-cream)] rounded-full px-3 py-1.5 border border-[var(--color-border)] animate-fade-in">
                  <Search className="h-4 w-4 text-[var(--color-ink-muted)]" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="bg-transparent border-none outline-none text-sm px-2 w-24"
                  />
                  <button type="button" onClick={() => setIsSearchOpen(false)}>
                    <X className="h-4 w-4 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-[var(--color-ink-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-cream)] rounded-full transition-all"
                >
                  <Search className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="h-4 w-px bg-[var(--color-border)]" />
            <LanguageToggle />
            <DarkModeToggle />

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to={user?.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'}
                  className="flex items-center gap-1.5 text-sm font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] px-4 py-2 rounded-lg transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>{t.nav.dashboard}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/customer/login"
                  className="text-sm font-semibold text-[var(--color-ink-muted)] hover:text-[var(--color-primary)] px-4 py-2 rounded-lg hover:bg-[var(--color-primary-glass)] transition-colors"
                >
                  {t.nav.login}
                </Link>
                <Link
                  to="/admin/login"
                  className="text-sm font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] px-4 py-2 rounded-lg transition-colors"
                >
                  {t.nav.adminLogin}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 text-[var(--color-ink)] hover:bg-[var(--color-cream)] rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-[var(--color-border)] bg-white p-4 space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-4 py-3 rounded-lg font-medium text-sm transition-colors ${isActive(item.href)
                  ? 'bg-[var(--color-primary-glass)] text-[var(--color-primary)]'
                  : 'text-[var(--color-ink-muted)] hover:bg-[var(--color-cream)]'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-[var(--color-border)] space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to={user?.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'}
                    className="block px-4 py-3 bg-[var(--color-primary-glass)] text-[var(--color-primary)] rounded-lg text-sm font-semibold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t.nav.dashboard}
                  </Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-red-600 text-sm font-medium">
                    {t.nav.logout}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/customer/login" className="block px-4 py-3 text-[var(--color-ink-muted)] text-sm font-semibold" onClick={() => setIsMenuOpen(false)}>{t.nav.login}</Link>
                  <Link to="/admin/login" className="block px-4 py-3 bg-[var(--color-primary)] text-white rounded-lg text-sm font-semibold text-center" onClick={() => setIsMenuOpen(false)}>{t.nav.adminLogin}</Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[var(--color-primary)] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-white/20 rounded-xl p-2">
                  <Sun className="h-5 w-5 text-white" />
                </div>
                <span className="font-display font-bold text-lg">Sunlight Offset Printers</span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">Your trusted partner for premium quality printing services in Coimbatore since 2019.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                {navLinks.map(l => (
                  <Link key={l.name} to={l.href} className="block text-white/70 hover:text-white text-sm transition-colors">{l.name}</Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <p className="text-white/70 text-sm">📞 +91 98765 43210</p>
              <p className="text-white/70 text-sm mt-1">📧 info@sunlightprinters.com</p>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/20 text-center text-white/50 text-sm">
            © 2026 Sunlight Offset Printers. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
