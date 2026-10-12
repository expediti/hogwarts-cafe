import React, { useState } from 'react';
import { useCafe } from '../context/CafeContext';
import { formatINR, exportOrdersToCSV } from '../utils/formatters';
import {
  TrendingUp,
  Download,
  Filter,
  CreditCard,
  QrCode,
  Banknote,
  UtensilsCrossed,
  BarChart3,
  PieChart,
  Calendar,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function ReportsPage() {
  const { orders, tables, menu } = useCafe();

  const [dateRangeFilter, setDateRangeFilter] = useState('7d'); // 'today', '7d', '30d', 'all'

  // Filter orders by selected timeframe
  const getFilteredOrders = () => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    return orders.filter((o) => {
      if (o.status === 'Cancelled') return false;
      const orderDate = new Date(o.date);
      if (isNaN(orderDate.getTime())) return true;

      if (dateRangeFilter === 'today') {
        const todayStr = new Date().toISOString().split('T')[0];
        return o.date === todayStr;
      } else if (dateRangeFilter === '7d') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return orderDate >= sevenDaysAgo && orderDate <= today;
      } else if (dateRangeFilter === '30d') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return orderDate >= thirtyDaysAgo && orderDate <= today;
      }
      return true; // 'all'
    });
  };

  const scopedOrders = getFilteredOrders();

  // 1. Key Metrics Calculations
  const totalRevenue = scopedOrders.reduce((sum, o) => sum + o.total, 0);
  const completedOrdersCount = scopedOrders.filter((o) => o.status === 'Completed').length;
  const avgOrderValue = scopedOrders.length > 0 ? totalRevenue / scopedOrders.length : 0;

  // 2. Category-wise Revenue Breakdown
  const categoryRevenue = {};
  scopedOrders.forEach((o) => {
    o.items?.forEach((item) => {
      const menuItem = menu.find((m) => m.name === item.name);
      const cat = menuItem ? menuItem.category : 'General';
      categoryRevenue[cat] = (categoryRevenue[cat] || 0) + item.price * item.quantity;
    });
  });

  const categoryList = Object.entries(categoryRevenue)
    .map(([cat, amount]) => ({ category: cat, amount }))
    .sort((a, b) => b.amount - a.amount);

  const maxCategoryAmount = Math.max(...categoryList.map((c) => c.amount), 1);

  // 3. Payment Method Breakdown
  const paymentBreakdown = { UPI: 0, Card: 0, Cash: 0 };
  scopedOrders.forEach((o) => {
    const method = o.paymentMethod || 'Cash';
    if (paymentBreakdown[method] !== undefined) {
      paymentBreakdown[method] += o.total;
    } else {
      paymentBreakdown.Cash += o.total;
    }
  });

  const totalPaymentSum = totalRevenue || 1;

  // 4. Table Utilization (how many orders processed per table)
  const tableOrderCounts = {};
  scopedOrders.forEach((o) => {
    if (o.tableNumber && o.tableNumber !== 'Takeaway') {
      tableOrderCounts[o.tableNumber] = (tableOrderCounts[o.tableNumber] || 0) + 1;
    }
  });

  const topUtilizedTables = Object.entries(tableOrderCounts)
    .map(([tableNum, count]) => {
      const tbl = tables.find((t) => t.number === tableNum);
      return {
        tableNum,
        count,
        area: tbl ? tbl.area : 'Dining Room'
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // 5. Popular Dishes Ranking
  const dishMap = {};
  scopedOrders.forEach((o) => {
    o.items?.forEach((it) => {
      if (!dishMap[it.name]) dishMap[it.name] = { name: it.name, count: 0, revenue: 0 };
      dishMap[it.name].count += it.quantity;
      dishMap[it.name].revenue += it.price * it.quantity;
    });
  });

  const topDishes = Object.values(dishMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);

  return (
    <div className="page-container reports-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Revenue Reports & Dining Analytics</h1>
          <p className="page-subtitle">Real-time financial performance and kitchen dispatch metrics.</p>
        </div>

        <div className="header-actions-group">
          {/* Date range filter */}
          <div className="tab-pill-group">
            <button
              className={`tab-pill-btn ${dateRangeFilter === 'today' ? 'active' : ''}`}
              onClick={() => setDateRangeFilter('today')}
            >
              Today
            </button>
            <button
              className={`tab-pill-btn ${dateRangeFilter === '7d' ? 'active' : ''}`}
              onClick={() => setDateRangeFilter('7d')}
            >
              Last 7 Days
            </button>
            <button
              className={`tab-pill-btn ${dateRangeFilter === '30d' ? 'active' : ''}`}
              onClick={() => setDateRangeFilter('30d')}
            >
              Last 30 Days
            </button>
            <button
              className={`tab-pill-btn ${dateRangeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setDateRangeFilter('all')}
            >
              All Time
            </button>
          </div>

          <button
            className="btn btn-brass"
            onClick={() => exportOrdersToCSV(orders)}
            id="btn-export-csv"
            title="Download full order history in CSV format"
          >
            <Download size={14} /> Export CSV Records
          </button>
        </div>
      </div>

      {/* Top 4 Metrics Summary */}
      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div className="card metric-card">
          <div className="metric-header">
            <span className="metric-label">Total Revenue</span>
            <div className="metric-icon-box brass-glow">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="metric-value">{formatINR(totalRevenue)}</div>
          <div className="metric-foot">
            <span className="foot-note">{scopedOrders.length} orders recorded in timeframe</span>
          </div>
        </div>

        <div className="card metric-card">
          <div className="metric-header">
            <span className="metric-label">Completed Orders</span>
            <div className="metric-icon-box woodland-glow">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="metric-value">{completedOrdersCount}</div>
          <div className="metric-foot">
            <span className="foot-note">Billed & settled orders</span>
          </div>
        </div>

        <div className="card metric-card">
          <div className="metric-header">
            <span className="metric-label">Average Order Value (AOV)</span>
            <div className="metric-icon-box">
              <Sparkles size={16} />
            </div>
          </div>
          <div className="metric-value">{formatINR(avgOrderValue)}</div>
          <div className="metric-foot">
            <span className="foot-note">Per guest ticket average</span>
          </div>
        </div>

        <div className="card metric-card">
          <div className="metric-header">
            <span className="metric-label">Top Grossing Category</span>
            <div className="metric-icon-box">
              <UtensilsCrossed size={16} />
            </div>
          </div>
          <div className="metric-value" style={{ fontSize: '1.25rem' }}>
            {categoryList[0]?.category || 'Butterbrew'}
          </div>
          <div className="metric-foot">
            <span className="foot-note">{formatINR(categoryList[0]?.amount || 0)} gross sales</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="dashboard-sections-grid">
        {/* Category-wise Revenue Breakdown */}
        <div className="card chart-card">
          <div className="card-header-flex">
            <div>
              <h3 className="section-title">Category-Wise Revenue</h3>
              <p className="card-subtitle">Sales contribution by menu department</p>
            </div>
            <span className="header-meta-badge">Departmental Breakdown</span>
          </div>

          <div className="category-bars-list">
            {categoryList.length === 0 ? (
              <p className="empty-subtle">No sales data in this period.</p>
            ) : (
              categoryList.map((item, idx) => {
                const percent = Math.round((item.amount / maxCategoryAmount) * 100);
                const sharePercent = totalRevenue > 0 ? Math.round((item.amount / totalRevenue) * 100) : 0;

                return (
                  <div key={idx} className="category-bar-row">
                    <div className="category-bar-meta">
                      <strong className="cat-name">{item.category}</strong>
                      <div className="cat-amounts">
                        <span className="cat-share">{sharePercent}% share</span>
                        <strong className="cat-inr">{formatINR(item.amount)}</strong>
                      </div>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Payment Methods Breakdown */}
        <div className="card payment-breakdown-card">
          <div className="card-header-flex">
            <div>
              <h3 className="section-title">Payment Method Share</h3>
              <p className="card-subtitle">Settlement modes utilized by guests</p>
            </div>
            <span className="header-meta-badge">Settlement Share</span>
          </div>

          <div className="payment-distribution-grid">
            <div className="payment-method-tile card">
              <div className="pay-icon-row">
                <QrCode size={18} className="text-forest" />
                <span className="pay-tile-label">UPI Transfer</span>
              </div>
              <strong className="pay-tile-amount">{formatINR(paymentBreakdown.UPI)}</strong>
              <div className="pay-share-bar">
                <div
                  className="pay-share-fill bg-forest"
                  style={{ width: `${Math.round((paymentBreakdown.UPI / totalPaymentSum) * 100)}%` }}
                ></div>
              </div>
              <small>{Math.round((paymentBreakdown.UPI / totalPaymentSum) * 100)}% of total volume</small>
            </div>

            <div className="payment-method-tile card">
              <div className="pay-icon-row">
                <CreditCard size={18} className="text-brass" />
                <span className="pay-tile-label">Debit / Credit Card</span>
              </div>
              <strong className="pay-tile-amount">{formatINR(paymentBreakdown.Card)}</strong>
              <div className="pay-share-bar">
                <div
                  className="pay-share-fill bg-brass"
                  style={{ width: `${Math.round((paymentBreakdown.Card / totalPaymentSum) * 100)}%` }}
                ></div>
              </div>
              <small>{Math.round((paymentBreakdown.Card / totalPaymentSum) * 100)}% of total volume</small>
            </div>

            <div className="payment-method-tile card">
              <div className="pay-icon-row">
                <Banknote size={18} className="text-espresso" />
                <span className="pay-tile-label">Cash Tendered</span>
              </div>
              <strong className="pay-tile-amount">{formatINR(paymentBreakdown.Cash)}</strong>
              <div className="pay-share-bar">
                <div
                  className="pay-share-fill bg-espresso"
                  style={{ width: `${Math.round((paymentBreakdown.Cash / totalPaymentSum) * 100)}%` }}
                ></div>
              </div>
              <small>{Math.round((paymentBreakdown.Cash / totalPaymentSum) * 100)}% of total volume</small>
            </div>
          </div>

          {/* Table Utilization Snapshot */}
          <div className="top-tables-box">
            <h4 className="inspector-subhead" style={{ marginTop: '16px' }}>Highest Utilized Tables</h4>
            <div className="top-tables-pills-row">
              {topUtilizedTables.map((t, i) => (
                <div key={i} className="util-table-chip">
                  <strong className="util-tbl-num">{t.tableNum}</strong>
                  <span className="util-tbl-area">{t.area}</span>
                  <span className="util-count-tag">{t.count} orders</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Revenue Dishes Detailed Table */}
      <div className="card top-dishes-table-card">
        <div className="card-header-flex">
          <div>
            <h3 className="section-title">Highest Grossing Dishes</h3>
            <p className="card-subtitle">Culinary items driving revenue performance</p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="heritage-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Dish Name</th>
                <th>Units Ordered</th>
                <th>Unit Price</th>
                <th>Gross Revenue</th>
                <th>Revenue Contribution</th>
              </tr>
            </thead>
            <tbody>
              {topDishes.map((dish, idx) => {
                const dishPercent = totalRevenue > 0 ? ((dish.revenue / totalRevenue) * 100).toFixed(1) : 0;
                return (
                  <tr key={idx}>
                    <td>
                      <span className="dish-rank-badge">#{idx + 1}</span>
                    </td>
                    <td>
                      <strong>{dish.name}</strong>
                    </td>
                    <td>{dish.count} servings</td>
                    <td>{formatINR(dish.revenue / dish.count)}</td>
                    <td>
                      <strong>{formatINR(dish.revenue)}</strong>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="bar-track" style={{ width: '100px', height: '6px' }}>
                          <div className="bar-fill" style={{ width: `${dishPercent}%` }}></div>
                        </div>
                        <small>{dishPercent}%</small>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
