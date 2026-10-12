import React from 'react';
import { useCafe } from '../context/CafeContext';
import { formatINR, formatTime } from '../utils/formatters';
import {
  TrendingUp,
  Receipt,
  Clock,
  CheckCircle,
  Users,
  CalendarCheck,
  AlertTriangle,
  PlusCircle,
  CalendarPlus,
  LayoutGrid,
  UtensilsCrossed,
  Eye,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

export default function OverviewPage() {
  const {
    orders,
    tables,
    reservations,
    inventory,
    menu,
    setCurrentView,
    setActiveReceiptOrder
  } = useCafe();

  // Dynamic greeting based on time of day
  const hour = new Date().getHours();
  let greeting = 'Good evening, Café Manager.';
  if (hour < 12) greeting = 'Good morning, Café Manager.';
  else if (hour < 17) greeting = 'Good afternoon, Café Manager.';

  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Calculate Today's Stats from actual data
  const todayOrders = orders.filter((o) => o.date === todayStr);
  const todayRevenue = todayOrders.reduce((sum, o) => (o.status !== 'Cancelled' ? sum + o.total : sum), 0);
  const activeOrders = orders.filter((o) => ['Pending', 'Preparing', 'Ready', 'Served'].includes(o.status));
  const availableTables = tables.filter((t) => t.status === 'Available');
  const occupiedTables = tables.filter((t) => t.status === 'Occupied');
  const todayReservations = reservations.filter((r) => r.date === todayStr && r.status !== 'Cancelled');
  
  const completedOrders = orders.filter((o) => o.status === 'Completed');
  const avgOrderValue = completedOrders.length > 0
    ? completedOrders.reduce((sum, o) => sum + o.total, 0) / completedOrders.length
    : (orders.length > 0 ? orders.reduce((sum, o) => sum + o.total, 0) / orders.length : 0);

  const lowStockIngredients = inventory.filter((i) => i.currentStock <= i.minStock);

  // 2. Revenue Overview for last 7 days from actual data
  const getLast7DaysData = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' });
      
      const dayOrders = orders.filter((o) => o.date === dStr && o.status !== 'Cancelled');
      const revenue = dayOrders.reduce((sum, o) => sum + o.total, 0);
      days.push({ date: dStr, label: dayLabel, revenue, count: dayOrders.length });
    }
    return days;
  };

  const last7Days = getLast7DaysData();
  const maxRevenue = Math.max(...last7Days.map((d) => d.revenue), 1000);

  // 3. Popular dishes from actual order history
  const getPopularDishes = () => {
    const dishCounts = {};
    orders.forEach((ord) => {
      if (ord.status !== 'Cancelled') {
        ord.items?.forEach((item) => {
          if (!dishCounts[item.name]) {
            dishCounts[item.name] = { name: item.name, count: 0, revenue: 0 };
          }
          dishCounts[item.name].count += item.quantity;
          dishCounts[item.name].revenue += item.price * item.quantity;
        });
      }
    });

    return Object.values(dishCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const popularDishes = getPopularDishes();

  // Status badge styling helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return <span className="status-pill status-available">Completed</span>;
      case 'Preparing': return <span className="status-pill status-reserved">Preparing</span>;
      case 'Ready': return <span className="status-pill status-available">Ready</span>;
      case 'Served': return <span className="status-pill status-occupied">Served</span>;
      case 'Cancelled': return <span className="status-pill status-cleaning">Cancelled</span>;
      default: return <span className="status-pill status-reserved">Pending</span>;
    }
  };

  return (
    <div className="page-container overview-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{greeting}</h1>
          <p className="page-subtitle">Here is what's happening at Hogwarts Cafe today.</p>
        </div>

        {/* Quick Actions Bar */}
        <div className="quick-actions-bar">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setCurrentView('orders')}
            id="qa-new-order"
          >
            <PlusCircle size={15} /> New Order
          </button>
          <button
            className="btn btn-brass btn-sm"
            onClick={() => setCurrentView('reservations')}
            id="qa-new-reservation"
          >
            <CalendarPlus size={15} /> New Reservation
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setCurrentView('floorplan')}
            id="qa-manage-tables"
          >
            <LayoutGrid size={15} /> Floor Plan
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setCurrentView('menu')}
            id="qa-add-menu-item"
          >
            <UtensilsCrossed size={15} /> Menu Catalog
          </button>
        </div>
      </div>

      {/* 8 Metric Stat Cards */}
      <div className="metrics-grid">
        <div className="card metric-card">
          <div className="metric-header">
            <span className="metric-label">Today's Revenue</span>
            <div className="metric-icon-box brass-glow">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="metric-value">{formatINR(todayRevenue)}</div>
          <div className="metric-foot">
            <span className="foot-note">{todayOrders.length} orders recorded today</span>
          </div>
        </div>

        <div className="card metric-card">
          <div className="metric-header">
            <span className="metric-label">Orders Received</span>
            <div className="metric-icon-box">
              <Receipt size={16} />
            </div>
          </div>
          <div className="metric-value">{todayOrders.length}</div>
          <div className="metric-foot">
            <span className="foot-note">Today's total bookings</span>
          </div>
        </div>

        <div className="card metric-card">
          <div className="metric-header">
            <span className="metric-label">Active Orders</span>
            <div className="metric-icon-box woodland-glow">
              <Clock size={16} />
            </div>
          </div>
          <div className="metric-value highlight-gold">{activeOrders.length}</div>
          <div className="metric-foot">
            <span className="foot-note">Kitchen & hall in progress</span>
          </div>
        </div>

        <div className="card metric-card">
          <div className="metric-header">
            <span className="metric-label">Available Tables</span>
            <div className="metric-icon-box">
              <CheckCircle size={16} />
            </div>
          </div>
          <div className="metric-value">{availableTables.length} <span className="metric-max">/ 20</span></div>
          <div className="metric-foot">
            <span className="foot-note">Ready for walk-in guests</span>
          </div>
        </div>

        <div className="card metric-card">
          <div className="metric-header">
            <span className="metric-label">Occupied Tables</span>
            <div className="metric-icon-box burgundy-glow">
              <Users size={16} />
            </div>
          </div>
          <div className="metric-value">{occupiedTables.length} <span className="metric-max">/ 20</span></div>
          <div className="metric-foot">
            <span className="foot-note">Current hall occupancy</span>
          </div>
        </div>

        <div className="card metric-card">
          <div className="metric-header">
            <span className="metric-label">Reservations Today</span>
            <div className="metric-icon-box">
              <CalendarCheck size={16} />
            </div>
          </div>
          <div className="metric-value">{todayReservations.length}</div>
          <div className="metric-foot">
            <span className="foot-note">Confirmed guest arrivals</span>
          </div>
        </div>

        <div className="card metric-card">
          <div className="metric-header">
            <span className="metric-label">Average Order Value</span>
            <div className="metric-icon-box">
              <Sparkles size={16} />
            </div>
          </div>
          <div className="metric-value">{formatINR(avgOrderValue)}</div>
          <div className="metric-foot">
            <span className="foot-note">Based on order records</span>
          </div>
        </div>

        <div className="card metric-card">
          <div className="metric-header">
            <span className="metric-label">Low-Stock Ingredients</span>
            <div className={`metric-icon-box ${lowStockIngredients.length > 0 ? 'alert-glow' : ''}`}>
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className={`metric-value ${lowStockIngredients.length > 0 ? 'text-burgundy' : ''}`}>
            {lowStockIngredients.length}
          </div>
          <div className="metric-foot">
            <span className="foot-note">{lowStockIngredients.length > 0 ? 'Action required in pantry' : 'Pantry well stocked'}</span>
          </div>
        </div>
      </div>

      {/* Main Content Dashboard Grid */}
      <div className="dashboard-sections-grid">
        {/* A. 7-Day Revenue Overview Chart */}
        <div className="card chart-card">
          <div className="card-header-flex">
            <div>
              <h3 className="section-title">Revenue Overview</h3>
              <p className="card-subtitle">Daily earnings over the last seven days (INR)</p>
            </div>
            <span className="header-meta-badge">Last 7 Days</span>
          </div>

          <div className="chart-wrapper">
            <div className="revenue-bars-container">
              {last7Days.map((day, idx) => {
                const heightPercent = maxRevenue > 0 ? Math.max(12, (day.revenue / maxRevenue) * 100) : 12;
                return (
                  <div key={idx} className="chart-column">
                    <div className="bar-hover-info">
                      <span className="tooltip-amount">{formatINR(day.revenue)}</span>
                      <span className="tooltip-orders">{day.count} orders</span>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{ height: `${heightPercent}%` }}
                      ></div>
                    </div>
                    <span className="bar-day-label">{day.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="chart-legend-row">
            <div className="legend-item">
              <span className="legend-box brass-box"></span>
              <span>Daily Gross Revenue</span>
            </div>
            <div className="legend-total">
              7-Day Total: <strong>{formatINR(last7Days.reduce((acc, d) => acc + d.revenue, 0))}</strong>
            </div>
          </div>
        </div>

        {/* D. Popular Dishes */}
        <div className="card popular-dishes-card">
          <div className="card-header-flex">
            <div>
              <h3 className="section-title">Popular Dishes</h3>
              <p className="card-subtitle">Most ordered items based on actual order history</p>
            </div>
            <button className="link-button" onClick={() => setCurrentView('menu')}>
              Menu <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="popular-dishes-list">
            {popularDishes.length === 0 ? (
              <p className="empty-subtle">No order records found yet.</p>
            ) : (
              popularDishes.map((dish, i) => (
                <div key={i} className="popular-dish-row">
                  <div className="dish-rank-badge">#{i + 1}</div>
                  <div className="dish-info-col">
                    <span className="dish-name">{dish.name}</span>
                    <span className="dish-count-subtle">{dish.count} servings ordered</span>
                  </div>
                  <div className="dish-revenue-col">
                    <strong className="dish-rev-text">{formatINR(dish.revenue)}</strong>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Second Row: Recent Orders & Table Occupancy */}
      <div className="dashboard-bottom-grid">
        {/* B. Recent Orders */}
        <div className="card recent-orders-card">
          <div className="card-header-flex">
            <div>
              <h3 className="section-title">Recent Orders</h3>
              <p className="card-subtitle">Latest recorded café orders & invoices</p>
            </div>
            <button className="link-button" onClick={() => setCurrentView('orders')}>
              All Orders <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="table-responsive">
            <table className="heritage-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Table</th>
                  <th>Time</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 6).map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong className="order-num-text">{order.orderNumber}</strong>
                    </td>
                    <td>{order.customerName}</td>
                    <td>
                      <span className="table-tag">{order.tableNumber}</span>
                    </td>
                    <td className="text-muted">{formatTime(order.time)}</td>
                    <td>
                      <span className="items-summary" title={order.items.map((it) => `${it.quantity}x ${it.name}`).join(', ')}>
                        {order.items.reduce((s, it) => s + it.quantity, 0)} items
                      </span>
                    </td>
                    <td>
                      <strong>{formatINR(order.total)}</strong>
                    </td>
                    <td>
                      <span className="payment-tag">{order.paymentMethod}</span>
                    </td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-outline btn-sm action-icon-btn"
                        onClick={() => setActiveReceiptOrder(order)}
                        title="View & Print Bill"
                      >
                        <Eye size={13} /> Bill
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* C. Table Occupancy Snapshot */}
        <div className="card table-occupancy-card">
          <div className="card-header-flex">
            <div>
              <h3 className="section-title">Table Occupancy</h3>
              <p className="card-subtitle">Real-time status across all 5 dining halls</p>
            </div>
            <button className="link-button" onClick={() => setCurrentView('floorplan')}>
              View Floor Plan <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="table-mini-grid">
            {tables.map((tbl) => {
              let statusClass = 'avail';
              if (tbl.status === 'Occupied') statusClass = 'occ';
              else if (tbl.status === 'Reserved') statusClass = 'res';
              else if (tbl.status === 'Cleaning') statusClass = 'clean';

              return (
                <div
                  key={tbl.id}
                  className={`mini-table-tile tile-${statusClass}`}
                  onClick={() => setCurrentView('floorplan')}
                  title={`Table ${tbl.number} (${tbl.area}) - ${tbl.status} (${tbl.seats} seats)`}
                >
                  <span className="mini-tbl-num">{tbl.number}</span>
                  <span className="mini-tbl-seats">{tbl.seats}s</span>
                  <span className="mini-status-dot"></span>
                </div>
              );
            })}
          </div>

          <div className="occupancy-legend-row">
            <span className="legend-chip"><span className="legend-dot dot-avail"></span> Available ({availableTables.length})</span>
            <span className="legend-chip"><span className="legend-dot dot-occ"></span> Occupied ({occupiedTables.length})</span>
            <span className="legend-chip"><span className="legend-dot dot-res"></span> Reserved ({tables.filter((t) => t.status === 'Reserved').length})</span>
            <span className="legend-chip"><span className="legend-dot dot-clean"></span> Cleaning ({tables.filter((t) => t.status === 'Cleaning').length})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
