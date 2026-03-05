import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  BarChart3,
  Users,
  LogOut,
  User,
  Sun,
  Menu,
  X,
  Image,
  Inbox,
  Bell
} from 'lucide-react';
import mockApi from '../services/mockApi';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pendingEnquiries, setPendingEnquiries] = useState(0);

  useEffect(() => {
    mockApi.getEnquiries().then(r => {
      const count = r.data.filter(e => e.status === 'pending').length;
      setPendingEnquiries(count);
    }).catch(() => { });
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Inventory', href: '/admin/inventory', icon: Package },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Gallery', href: '/admin/gallery', icon: Image },
    { name: 'Enquiries', href: '/admin/enquiries', icon: Inbox, badge: pendingEnquiries },
    { name: 'Profile', href: '/admin/profile', icon: User },
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

      {/* Sidebar */}
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
              <span className="font-display font-bold text-lg">Admin Portal</span>
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
                  {item.badge > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="px-2">
              <div className="flex items-center gap-3 mb-4 p-3 bg-white/10 rounded-xl">
                <div className="h-12 w-12 bg-[var(--color-gold)] text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                  {user?.full_name?.charAt(0) || 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{user?.full_name}</div>
                  <div className="text-sm text-white/60">Administrator</div>
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
                <div className="hidden sm:block text-sm text-[var(--color-ink-muted)]">
                  Welcome back, <span className="font-semibold text-[var(--color-primary)]">{user?.full_name}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full overflow-auto">
          {user?.role === 'admin' && user?.username === 'admin' && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
              ⚠️ For security, please change your default admin username and password in Profile.
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
