import React from 'react';
import { useCafe } from '../context/CafeContext';
import { Menu, PlusCircle, CalendarPlus, Bell, Search, Coffee } from 'lucide-react';

export default function TopBar({ onOpenMobileNav }) {
  const { currentView, setCurrentView, tables, orders, inventory } = useCafe();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning, Café Manager.';
    if (hour < 17) return 'Good afternoon, Café Manager.';
    return 'Good evening, Café Manager.';
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'overview': return 'Overview Dashboard';
      case 'orders': return 'Orders & POS Management';
      case 'reservations': return 'Table Reservation Book';
      case 'floorplan': return 'Hogwarts Floor Plan & Seating';
      case 'menu': return 'Wizarding Menu & Recipes';
      case 'inventory': return 'Pantry & Ingredient Inventory';
      case 'customers': return 'Patron & Guest Directory';
      case 'reports': return 'Revenue Reports & Dining Analytics';
      case 'settings': return 'Café Operations & Settings';
      default: return 'Hogwarts Cafe';
    }
  };

  const lowStockCount = inventory.filter((i) => i.currentStock <= i.minStock).length;

  return (
    <header className="cafe-topbar no-print">
      <div className="topbar-left">
        <button
          className="topbar-mobile-menu-btn"
          onClick={onOpenMobileNav}
          aria-label="Open Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <div className="topbar-breadcrumbs">
          <span className="crumb-brand">Hogwarts Cafe</span>
          <span className="crumb-divider">/</span>
          <span className="crumb-current">{getPageTitle()}</span>
        </div>
      </div>

      <div className="topbar-right">
        {lowStockCount > 0 && (
          <button
            className="topbar-alert-pill"
            onClick={() => setCurrentView('inventory')}
            title={`${lowStockCount} ingredients low in pantry`}
          >
            <Bell size={13} className="alert-bell-icon" />
            <span>{lowStockCount} Low Stock</span>
          </button>
        )}

        <div className="topbar-quick-actions">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setCurrentView('reservations')}
            id="topbar-new-res-btn"
          >
            <CalendarPlus size={14} />
            <span className="btn-label-desktop">New Reservation</span>
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => setCurrentView('orders')}
            id="topbar-new-order-btn"
          >
            <PlusCircle size={14} />
            <span className="btn-label-desktop">New Order</span>
          </button>
        </div>
      </div>
    </header>
  );
}
