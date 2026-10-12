import React, { useState } from 'react';
import { useCafe } from '../context/CafeContext';
import { formatINR, formatTime, formatDate } from '../utils/formatters';
import {
  Plus,
  Minus,
  Trash2,
  Search,
  CheckCircle,
  Receipt,
  Printer,
  X,
  CreditCard,
  QrCode,
  Banknote,
  Clock,
  Filter,
  Eye,
  Utensils
} from 'lucide-react';

export default function OrdersPage() {
  const {
    menu,
    tables,
    customers,
    orders,
    createOrder,
    updateOrderStatus,
    cancelOrder,
    setActiveReceiptOrder,
    settings,
    addToast
  } = useCafe();

  // Active sub-tab: 'pos' (Create Order) or 'orders-list' (Order Tracker)
  const [activeTab, setActiveTab] = useState('pos');

  // POS State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTable, setSelectedTable] = useState('T02');
  const [customerMode, setCustomerMode] = useState('existing'); // 'existing' or 'custom'
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [customCustomerName, setCustomCustomerName] = useState('');
  const [customCustomerPhone, setCustomCustomerPhone] = useState('');
  const [orderItems, setOrderItems] = useState([]);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  // Orders List Filter
  const [statusFilter, setStatusFilter] = useState('All');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Categories
  const categories = [
    'All',
    'Enchanted Coffee',
    'Butterbrew & Beverages',
    'Breakfast at Hogwarts',
    'Great Hall Mains',
    'Magical Desserts',
    'Bakery & Pastries',
    'Seasonal Specials'
  ];

  // Filtered Menu Items
  const filteredMenuItems = menu.filter((item) => {
    const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Add Item to Order
  const handleAddItem = (dish) => {
    if (!dish.available) {
      addToast(`${dish.name} is currently out of stock.`, 'warning');
      return;
    }

    setOrderItems((prev) => {
      const existing = prev.find((i) => i.id === dish.id);
      if (existing) {
        return prev.map((i) =>
          i.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { id: dish.id, name: dish.name, price: dish.price, quantity: 1, isVeg: dish.isVeg }];
    });
  };

  // Change Quantity
  const handleUpdateQty = (itemId, delta) => {
    setOrderItems((prev) =>
      prev
        .map((i) => {
          if (i.id === itemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean)
    );
  };

  // Remove Item
  const handleRemoveItem = (itemId) => {
    setOrderItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  // Calculations
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = Math.min(Number(discountAmount) || 0, subtotal);
  const taxable = Math.max(0, subtotal - discount);
  const tax = Number(((taxable * (settings.gstPercent || 5)) / 100).toFixed(2));
  const grandTotal = Number((taxable + tax).toFixed(2));

  // Handle Checkout / Place Order
  const handleCheckout = (status = 'Completed') => {
    if (orderItems.length === 0) {
      addToast('Please add at least one dish to the order.', 'warning');
      return;
    }

    let customerName = 'Walk-in Guest';
    let customerPhone = '';

    if (customerMode === 'existing' && selectedCustomerId) {
      const cust = customers.find((c) => c.id === selectedCustomerId);
      if (cust) {
        customerName = cust.name;
        customerPhone = cust.phone;
      }
    } else if (customerMode === 'custom' && customCustomerName.trim()) {
      customerName = customCustomerName.trim();
      customerPhone = customCustomerPhone.trim();
    }

    const newOrder = createOrder({
      customerName,
      customerPhone,
      tableNumber: selectedTable,
      items: orderItems,
      subtotal,
      discount,
      tax,
      total: grandTotal,
      paymentMethod,
      paymentStatus: status === 'Completed' ? 'Paid' : 'Pending',
      status,
      instructions: specialInstructions
    });

    // Reset POS form
    setOrderItems([]);
    setDiscountAmount(0);
    setSpecialInstructions('');
    setCustomCustomerName('');
    setCustomCustomerPhone('');

    // Open receipt modal automatically
    setActiveReceiptOrder(newOrder);
  };

  // Filtered Orders List
  const filteredOrders = orders.filter((o) => {
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    const matchQuery =
      o.orderNumber.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.tableNumber.toLowerCase().includes(orderSearchQuery.toLowerCase());
    return matchStatus && matchQuery;
  });

  return (
    <div className="page-container orders-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Orders & POS Station</h1>
          <p className="page-subtitle">Live ordering, table billing and kitchen dispatch.</p>
        </div>

        {/* Tab switch */}
        <div className="tab-pill-group">
          <button
            className={`tab-pill-btn ${activeTab === 'pos' ? 'active' : ''}`}
            onClick={() => setActiveTab('pos')}
            id="tab-btn-pos"
          >
            <Utensils size={14} /> New Order POS
          </button>
          <button
            className={`tab-pill-btn ${activeTab === 'orders-list' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders-list')}
            id="tab-btn-orders-list"
          >
            <Receipt size={14} /> Order Tracker ({orders.length})
          </button>
        </div>
      </div>

      {activeTab === 'pos' ? (
        /* POS Layout: Left is Menu Items, Right is Live Bill Summary */
        <div className="pos-layout">
          <div className="pos-menu-column">
            {/* Search and Category Filter */}
            <div className="pos-filter-bar card">
              <div className="search-input-wrapper">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search dishes, coffees, butterbrew..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control pos-search-input"
                />
                {searchQuery && (
                  <button className="clear-search" onClick={() => setSearchQuery('')}>
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="category-scroll-strip">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items Grid */}
            <div className="pos-dishes-grid">
              {filteredMenuItems.map((dish) => {
                const inCart = orderItems.find((i) => i.id === dish.id);
                return (
                  <div
                    key={dish.id}
                    className={`pos-dish-card ${!dish.available ? 'dish-unavailable' : ''}`}
                    onClick={() => handleAddItem(dish)}
                    title={dish.available ? 'Click to add to order' : 'Out of stock'}
                  >
                    <div className="dish-img-box">
                      <img src={dish.image} alt={dish.name} loading="lazy" />
                      <span className={`veg-badge ${dish.isVeg ? 'veg-green' : 'non-veg-red'}`}>
                        {dish.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                      </span>
                      {inCart && (
                        <span className="cart-qty-badge">{inCart.quantity}</span>
                      )}
                    </div>

                    <div className="dish-details">
                      <h4 className="dish-title">{dish.name}</h4>
                      <p className="dish-desc">{dish.description}</p>
                      <div className="dish-bottom-bar">
                        <strong className="dish-price">{formatINR(dish.price)}</strong>
                        <span className="prep-time-tag">⏱ {dish.prepTime}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Live Order Summary & Checkout Drawer */}
          <div className="pos-summary-column card">
            <div className="summary-header">
              <h3 className="summary-title">Live Order Ticket</h3>
              <span className="order-auto-tag">Hogwarts Dining Room</span>
            </div>

            {/* Table & Customer Selectors */}
            <div className="pos-meta-inputs">
              <div className="form-group">
                <label className="form-label">Select Table:</label>
                <select
                  className="form-control"
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  id="pos-table-select"
                >
                  <option value="Takeaway">Takeaway / Bar Counter</option>
                  {tables.map((tbl) => (
                    <option key={tbl.id} value={tbl.number}>
                      {tbl.number} — {tbl.area} ({tbl.seats} Seats) [{tbl.status}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer Selector Mode */}
              <div className="form-group">
                <div className="label-toggle-row">
                  <label className="form-label">Patron / Guest:</label>
                  <button
                    type="button"
                    className="toggle-link"
                    onClick={() => setCustomerMode(customerMode === 'existing' ? 'custom' : 'existing')}
                  >
                    {customerMode === 'existing' ? '+ Enter Walk-in' : '← Select Existing'}
                  </button>
                </div>

                {customerMode === 'existing' ? (
                  <select
                    className="form-control"
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    id="pos-customer-select"
                  >
                    <option value="">Walk-in Guest (General)</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.phone}) — {c.tag || 'Regular'}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="custom-guest-inputs">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Guest Name (e.g. Harry Potter)"
                      value={customCustomerName}
                      onChange={(e) => setCustomCustomerName(e.target.value)}
                      style={{ marginBottom: '6px' }}
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Mobile No. (+91 98765 43210)"
                      value={customCustomerPhone}
                      onChange={(e) => setCustomCustomerPhone(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Items List */}
            <div className="order-items-scroll-list">
              {orderItems.length === 0 ? (
                <div className="empty-order-ticket">
                  <Utensils size={32} className="empty-ticket-icon" />
                  <p>Ticket is currently empty.</p>
                  <small>Click any dish on the left to add items.</small>
                </div>
              ) : (
                orderItems.map((item) => (
                  <div key={item.id} className="order-item-row">
                    <div className="item-row-left">
                      <span className={`item-veg-dot ${item.isVeg ? 'dot-veg' : 'dot-nonveg'}`}></span>
                      <div>
                        <div className="item-name-bold">{item.name}</div>
                        <div className="item-unit-rate">₹{item.price} each</div>
                      </div>
                    </div>

                    <div className="item-row-qty">
                      <button
                        className="qty-btn"
                        onClick={() => handleUpdateQty(item.id, -1)}
                        title="Reduce quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="qty-count">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => handleUpdateQty(item.id, 1)}
                        title="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div className="item-row-total">
                      <span>{formatINR(item.price * item.quantity)}</span>
                      <button
                        className="remove-item-btn"
                        onClick={() => handleRemoveItem(item.id)}
                        title="Remove item"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bill Calculation Box */}
            <div className="ticket-totals-section">
              <div className="calc-line">
                <span>Subtotal:</span>
                <span>{formatINR(subtotal)}</span>
              </div>

              <div className="calc-line discount-input-row">
                <span>Discount (₹):</span>
                <input
                  type="number"
                  min="0"
                  max={subtotal}
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Math.max(0, Number(e.target.value)))}
                  className="discount-mini-input"
                />
              </div>

              <div className="calc-line">
                <span>GST Tax ({settings.gstPercent}%):</span>
                <span>{formatINR(tax)}</span>
              </div>

              <div className="calc-divider"></div>

              <div className="calc-line grand-total-line">
                <strong>Payable Total:</strong>
                <strong className="grand-price-text">{formatINR(grandTotal)}</strong>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="form-group" style={{ marginTop: '10px' }}>
              <input
                type="text"
                placeholder="Kitchen notes / Special instructions..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="form-control"
              />
            </div>

            {/* Payment Method Selector */}
            <div className="payment-method-selector">
              <label className="form-label">Payment Method:</label>
              <div className="payment-options-row">
                <button
                  type="button"
                  className={`pay-mode-btn ${paymentMethod === 'UPI' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('UPI')}
                >
                  <QrCode size={14} /> UPI
                </button>
                <button
                  type="button"
                  className={`pay-mode-btn ${paymentMethod === 'Card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('Card')}
                >
                  <CreditCard size={14} /> Card
                </button>
                <button
                  type="button"
                  className={`pay-mode-btn ${paymentMethod === 'Cash' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('Cash')}
                >
                  <Banknote size={14} /> Cash
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pos-actions-row">
              <button
                className="btn btn-secondary"
                onClick={() => handleCheckout('Preparing')}
                disabled={orderItems.length === 0}
                id="pos-kitchen-ticket-btn"
                title="Send ticket to kitchen as Preparing"
              >
                Send to Kitchen
              </button>

              <button
                className="btn btn-primary"
                onClick={() => handleCheckout('Completed')}
                disabled={orderItems.length === 0}
                id="pos-complete-order-btn"
              >
                <CheckCircle size={15} /> Complete & Bill
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Orders List / Tracker View */
        <div className="card orders-tracker-card">
          <div className="orders-filter-row">
            <div className="search-input-wrapper" style={{ maxWidth: '340px' }}>
              <Search size={15} className="search-icon" />
              <input
                type="text"
                placeholder="Search by order #, patron, table..."
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="status-filter-pills">
              {['All', 'Pending', 'Preparing', 'Ready', 'Served', 'Completed', 'Cancelled'].map((st) => (
                <button
                  key={st}
                  className={`status-filter-chip ${statusFilter === st ? 'active' : ''}`}
                  onClick={() => setStatusFilter(st)}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="table-responsive">
            <table className="heritage-table">
              <thead>
                <tr>
                  <th>Order No.</th>
                  <th>Date & Time</th>
                  <th>Customer</th>
                  <th>Table</th>
                  <th>Items Ordered</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Change Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="10" style={{ textAlign: 'center', padding: '36px' }}>
                      No matching orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr key={ord.id}>
                      <td>
                        <strong className="order-num-text">{ord.orderNumber}</strong>
                      </td>
                      <td>
                        <div>{formatDate(ord.date)}</div>
                        <small className="text-muted">{formatTime(ord.time)}</small>
                      </td>
                      <td>
                        <strong>{ord.customerName}</strong>
                        {ord.customerPhone && <div className="text-muted" style={{ fontSize: '11px' }}>{ord.customerPhone}</div>}
                      </td>
                      <td>
                        <span className="table-tag">{ord.tableNumber}</span>
                      </td>
                      <td>
                        <div className="items-breakdown-list">
                          {ord.items?.map((it, idx) => (
                            <span key={idx} className="item-pill">
                              {it.quantity}x {it.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <strong>{formatINR(ord.total)}</strong>
                      </td>
                      <td>
                        <span className="payment-tag">
                          {ord.paymentMethod} • {ord.paymentStatus || 'Paid'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill status-${ord.status.toLowerCase()}`}>
                          {ord.status}
                        </span>
                      </td>
                      <td>
                        {/* Status Transition Select */}
                        <select
                          className="status-change-dropdown"
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Ready">Ready</option>
                          <option value="Served">Served</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            className="btn btn-brass btn-sm"
                            onClick={() => setActiveReceiptOrder(ord)}
                            title="View & Print Bill / Receipt"
                          >
                            <Printer size={13} /> Bill
                          </button>
                          {ord.status !== 'Cancelled' && ord.status !== 'Completed' && (
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => cancelOrder(ord.id)}
                              title="Cancel Order"
                            >
                              <X size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
