import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  ShoppingBag,
  PlusCircle,
  History,
  LogOut,
  Sun,
  Menu,
  X,
  Bell,
  User,
  Home,
  FileText,
  Calculator
} from 'lucide-react';

const CustomerLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifications = [];
  const unreadCount = 0;

  const navigation = [
    { name: 'Dashboard', href: '/customer/dashboard', icon: LayoutDashboard },
    { name: 'Services', href: '/customer/services', icon: ShoppingBag },
    { name: 'Create Order', href: '/customer/create-order', icon: PlusCircle },
    { name: 'Order History', href: '/customer/orders', icon: History },
    { name: 'My Profile', href: '/customer/profile', icon: User },
  ];

  // Mobile bottom tab navigation
  const mobileTabs = [
    { name: 'Home', href: '/customer/dashboard', icon: Home },
    { name: 'Services', href: '/customer/services', icon: ShoppingBag },
    { name: 'Quote', href: '/customer/create-order', icon: Calculator },
    { name: 'Orders', href: '/customer/orders', icon: FileText },
    { name: 'Profile', href: '/customer/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)] lg:grid lg:grid-cols-[280px_1fr]">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out
        bg-gradient-to-b from-[var(--color-primary-dark)] to-[var(--color-primary)] text-white
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0 lg:sticky lg:top-0 lg:h-screen
      `}>
        <div className="flex items-center justify-between h-20 px-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-xl p-2">
              <Sun className="h-7 w-7" />
            </div>
            <div>
              <span className="font-display font-bold text-lg">Customer Portal</span>
              <p className="text-xs text-white/50">Sunlight Printers</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6 px-4">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center justify-between px-4 py-3 rounded-xl transition-all relative
                    ${isActive
                      ? 'bg-white text-[var(--color-primary)]'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--color-gold)] rounded-r-full" />
                  )}
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="px-2">
              <div className="flex items-center gap-3 mb-4 p-3 bg-white/10 rounded-xl">
                <div className="h-12 w-12 bg-[var(--color-gold)] text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{user?.full_name}</div>
                  <div className="text-sm text-white/60">Customer</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-red-500/20 hover:text-red-300 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="min-h-screen flex flex-col">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-[var(--color-border)] sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-[var(--color-ink)] hover:bg-[var(--color-cream)] transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>

              <div className="flex items-center gap-4">
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    className="p-2 rounded-lg hover:bg-[var(--color-cream)] relative transition-colors"
                  >
                    <Bell className="h-5 w-5 text-[var(--color-ink-muted)]" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  {notifOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-[var(--shadow-3)] border border-[var(--color-border)] z-20 max-h-96 overflow-auto">
                        <div className="p-3 border-b border-[var(--color-border)] font-semibold text-[var(--color-primary)]">Notifications</div>
                        {notifications.length === 0 ? (
                          <div className="p-4 text-sm text-[var(--color-ink-muted)]">No notifications</div>
                        ) : (
                          notifications.slice(0, 10).map((n) => (
                            <div key={n.id} className="p-3 border-b border-[var(--color-border)] hover:bg-[var(--color-cream)] cursor-pointer" onClick={() => setNotifOpen(false)}>
                              <div className="font-semibold text-sm text-[var(--color-ink)]">{n.title}</div>
                              <div className="text-xs text-[var(--color-ink-muted)]">{n.message}</div>
                              <div className="text-xs text-[var(--color-ink-faint)] mt-1">{new Date(n.created_at).toLocaleString()}</div>
                            </div>
                          ))
                        )}
                      </div>
                    </>
                  )}
                </div>
                <div className="hidden sm:block text-sm text-[var(--color-ink-muted)]">
                  Welcome back, <span className="font-semibold text-[var(--color-primary)]">{user?.full_name}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-auto pb-24 lg:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className="mobile-tab-bar lg:hidden">
        {mobileTabs.map((tab) => {
          const isActive = location.pathname === tab.href;
          return (
            <Link
              key={tab.name}
              to={tab.href}
              className={`mobile-tab relative ${isActive ? 'mobile-tab-active' : ''}`}
            >
              <tab.icon className="h-6 w-6" />
              <span className="text-xs font-medium">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CustomerLayout;
