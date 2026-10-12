import React, { useState, useEffect } from 'react';
import { useCafe } from '../context/CafeContext';
import {
  LayoutDashboard,
  UtensilsCrossed,
  CalendarDays,
  LayoutGrid,
  Receipt,
  Boxes,
  Users,
  BarChart3,
  Settings as SettingsIcon,
  Clock,
  Sparkles,
  ChevronRight,
  Menu as MenuIcon,
  X
} from 'lucide-react';

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const { currentView, setCurrentView, orders, tables, inventory } = useCafe();
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  // Live clock updating every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );
      setDateStr(
        now.toLocaleDateString('en-GB', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute live badges
  const activeOrdersCount = orders.filter(
    (o) => o.status === 'Pending' || o.status === 'Preparing' || o.status === 'Ready' || o.status === 'Served'
  ).length;

  const occupiedTablesCount = tables.filter((t) => t.status === 'Occupied').length;
  const lowStockCount = inventory.filter((i) => i.currentStock <= i.minStock).length;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders & POS', icon: Receipt, badge: activeOrdersCount > 0 ? activeOrdersCount : null, badgeType: 'active' },
    { id: 'reservations', label: 'Reservations', icon: CalendarDays },
    { id: 'floorplan', label: 'Floor Plan', icon: LayoutGrid, badge: occupiedTablesCount > 0 ? `${occupiedTablesCount}/20` : null },
    { id: 'menu', label: 'Menu Catalog', icon: UtensilsCrossed },
    { id: 'inventory', label: 'Inventory', icon: Boxes, badge: lowStockCount > 0 ? `${lowStockCount} low` : null, badgeType: 'alert' },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const handleNavClick = (id) => {
    setCurrentView(id);
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div className="sidebar-backdrop" onClick={() => setMobileOpen(false)}></div>
      )}

      <aside className={`cafe-sidebar ${mobileOpen ? 'mobile-visible' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand-box">
          <div className="brand-crest-wrapper">
            <div className="brand-crest">
              <span className="crest-monogram">HC</span>
            </div>
            <div className="brand-meta">
              <h1 className="brand-title">HOGWARTS CAFE</h1>
              <span className="brand-subtitle">THE WIZARDING WORLD'S DINING ROOM</span>
            </div>
          </div>
          {setMobileOpen && (
            <button
              className="mobile-close-btn"
              onClick={() => setMobileOpen(false)}
              aria-label="Close Navigation"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Live Clock / Service Bar */}
        <div className="sidebar-clock-card">
          <div className="clock-time-row">
            <Clock size={13} className="clock-icon" />
            <span className="clock-time">{timeStr || 'Loading...'}</span>
          </div>
          <div className="clock-date-row">
            <span className="clock-date">{dateStr}</span>
            <span className="service-status-dot" title="Grand Hall Service Active">● Active</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">MANAGEMENT PORTAL</div>
          <ul className="nav-list">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <li key={item.id} className="nav-item">
                  <button
                    className={`nav-button ${isActive ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.id)}
                    id={`nav-btn-${item.id}`}
                  >
                    <div className="nav-icon-title">
                      <Icon size={17} className="nav-icon" />
                      <span className="nav-label">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`nav-badge ${item.badgeType === 'alert' ? 'badge-alert' : ''}`}>
                        {item.badge}
                      </span>
                    )}

                    {isActive && <ChevronRight size={13} className="nav-active-arrow" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer Status */}
        <div className="sidebar-service-footer">
          <div className="hall-indicator">
            <span className="hall-name">Great Hall Service</span>
            <span className="hall-detail">Tables: {occupiedTablesCount} occupied</span>
          </div>
          <div className="system-tag">Hogwarts OS • v2.6 Heritage</div>
        </div>
      </aside>
    </>
  );
}
