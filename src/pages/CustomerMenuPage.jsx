import React, { useState } from 'react';
import { useCafe } from '../context/CafeContext';
import { formatINR } from '../utils/formatters';
import {
  Sparkles,
  Search,
  ShoppingBag,
  Plus,
  Minus,
  Utensils,
  CalendarDays,
  ShieldCheck,
  Clock,
  MapPin,
  CheckCircle,
  X,
  CreditCard,
  QrCode,
  Banknote,
  Flame,
  ArrowRight
} from 'lucide-react';

export default function CustomerMenuPage({ onOpenAdmin }) {
  const {
    menu,
    tables,
    createOrder,
    createReservation,
    setActiveReceiptOrder,
    settings,
    addToast
  } = useCafe();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dietaryFilter, setDietaryFilter] = useState('all'); // 'all', 'veg', 'non-veg'
  const [searchQuery, setSearchQuery] = useState('');

  // Guest Cart / Tray State
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [diningType, setDiningType] = useState('dine-in'); // 'dine-in' or 'takeaway'
  const [selectedTable, setSelectedTable] = useState('T02');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestPaymentMethod, setGuestPaymentMethod] = useState('UPI');
  const [specialNote, setSpecialNote] = useState('');

  // Reservation Modal State for Guests
  const [isResModalOpen, setIsResModalOpen] = useState(false);
  const [resName, setResName] = useState('');
  const [resPhone, setResPhone] = useState('+91 ');
  const [resGuests, setResGuests] = useState(2);
  const [resDate, setResDate] = useState(new Date().toISOString().split('T')[0]);
  const [resTime, setResTime] = useState('19:30');
  const [resSection, setResSection] = useState('The Great Hall');
  const [resTableId, setResTableId] = useState('T02');
  const [resNotes, setResNotes] = useState('');

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

  // Filtered Dishes
  const filteredDishes = menu.filter((item) => {
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchDiet =
      dietaryFilter === 'all' ||
      (dietaryFilter === 'veg' && item.isVeg) ||
      (dietaryFilter === 'non-veg' && !item.isVeg);
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchDiet && matchSearch;
  });

  // Cart Operations
  const handleAddToCart = (dish) => {
    if (!dish.available) {
      addToast(`${dish.name} is currently sold out in the Great Hall.`, 'warning');
      return;
    }
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === dish.id);
      if (existing) {
        return prev.map((i) =>
          i.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { id: dish.id, name: dish.name, price: dish.price, quantity: 1, isVeg: dish.isVeg }];
    });
    addToast(`Added ${dish.name} to your tray!`, 'success');
  };

  const handleUpdateQty = (dishId, delta) => {
    setCartItems((prev) =>
      prev
        .map((i) => {
          if (i.id === dishId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean)
    );
  };

  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const tax = Number(((subtotal * (settings.gstPercent || 5)) / 100).toFixed(2));
  const grandTotal = Number((subtotal + tax).toFixed(2));

  // Place Guest Order
  const handleCheckout = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      addToast('Your tray is empty.', 'warning');
      return;
    }

    const newOrder = createOrder({
      customerName: guestName.trim() || 'Hogwarts Patron',
      customerPhone: guestPhone.trim(),
      tableNumber: diningType === 'dine-in' ? selectedTable : 'Takeaway',
      items: cartItems,
      subtotal,
      discount: 0,
      tax,
      total: grandTotal,
      paymentMethod: guestPaymentMethod,
      paymentStatus: 'Paid',
      status: 'Preparing',
      instructions: specialNote.trim()
    });

    setCartItems([]);
    setIsCartOpen(false);
    setSpecialNote('');
    addToast('Your order has been dispatched to the Great Hall kitchen!', 'success');
    setActiveReceiptOrder(newOrder);
  };

  // Submit Guest Reservation
  const handleReserveSubmit = (e) => {
    e.preventDefault();
    if (!resName.trim()) {
      addToast('Please enter your name.', 'warning');
      return;
    }
    const res = createReservation({
      customerName: resName.trim(),
      phone: resPhone.trim(),
      guests: Number(resGuests),
      date: resDate,
      time: resTime,
      duration: 90,
      section: resSection,
      tableId: resTableId,
      notes: resNotes.trim()
    });

    if (res.success) {
      setIsResModalOpen(false);
      setResNotes('');
    }
  };

  return (
    <div className="guest-portal-container">
      {/* Top Patron Header */}
      <header className="guest-nav-header">
        <div className="guest-nav-inner">
          <div className="guest-brand-block">
            <div className="brand-crest guest-crest">
              <span className="crest-monogram">HC</span>
            </div>
            <div>
              <h1 className="guest-brand-name">HOGWARTS CAFE</h1>
              <p className="guest-brand-tagline">THE WIZARDING WORLD'S DINING ROOM</p>
            </div>
          </div>

          <div className="guest-nav-actions">
            <button
              className="guest-nav-btn btn-table-res"
              onClick={() => setIsResModalOpen(true)}
            >
              <CalendarDays size={15} />
              <span>Book a Table</span>
            </button>

            <button
              className="guest-nav-btn btn-cart-trigger"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag size={15} />
              <span>My Tray</span>
              {cartCount > 0 && <span className="cart-badge-count">{cartCount}</span>}
            </button>

            <button
              className="guest-nav-btn btn-admin-portal"
              onClick={onOpenAdmin}
              title="Access Café Operations & Staff Panel"
            >
              <ShieldCheck size={15} />
              <span>Staff Portal</span>
            </button>
          </div>
        </div>
      </header>

      {/* Atmospheric Wizarding Hero Banner */}
      <section className="wizarding-hero-banner">
        <div className="hero-floating-candle candle-1">🕯️</div>
        <div className="hero-floating-candle candle-2">🕯️</div>
        <div className="hero-floating-candle candle-3">🕯️</div>

        <div className="hero-content-box">
          <span className="hero-crest-badge">
            <Sparkles size={13} /> ESTABLISHED IN HOGWARTS CASTLE
          </span>
          <h2 className="hero-main-title">A Little Magic in Every Serving</h2>
          <p className="hero-description">
            Step through the ancient archways into Hogwarts Cafe. Savor freshly brewed Highland
            coffee, golden drafts of authentic Butterbrew, comforting Great Hall roasts, and
            spellbinding desserts prepared fresh daily.
          </p>

          <div className="hero-meta-strip">
            <span><Clock size={13} /> Service: 08:00 AM – 11:00 PM Daily</span>
            <span><MapPin size={13} /> North Cloister, Hogwarts Castle</span>
            <span><Flame size={13} /> Fresh Hearthside Kitchen</span>
          </div>
        </div>
      </section>

      {/* Main Dining Menu Section */}
      <main className="guest-menu-section">
        {/* Filter and Category Bar */}
        <div className="guest-filter-wrapper card">
          <div className="guest-search-bar">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search dishes, hot chocolates, butterbrew, pies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control guest-search-input"
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery('')}>
                <X size={14} />
              </button>
            )}
          </div>

          <div className="guest-filter-controls">
            {/* Category Scroll Strip */}
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

            {/* Dietary Filter */}
            <div className="dietary-filter-pills">
              <button
                className={`dietary-pill ${dietaryFilter === 'all' ? 'active' : ''}`}
                onClick={() => setDietaryFilter('all')}
              >
                All Dishes
              </button>
              <button
                className={`dietary-pill veg-pill-btn ${dietaryFilter === 'veg' ? 'active' : ''}`}
                onClick={() => setDietaryFilter('veg')}
              >
                🟢 Pure Veg
              </button>
              <button
                className={`dietary-pill nonveg-pill-btn ${dietaryFilter === 'non-veg' ? 'active' : ''}`}
                onClick={() => setDietaryFilter('non-veg')}
              >
                🔴 Non-Veg
              </button>
            </div>
          </div>
        </div>

        {/* Section Heading */}
        <div className="menu-list-header">
          <div>
            <h3 className="menu-section-heading">
              {selectedCategory === 'All' ? 'Our Complete Wizarding Menu' : selectedCategory}
            </h3>
            <p className="menu-section-subtitle">
              Showing {filteredDishes.length} freshly prepared dining selections
            </p>
          </div>
        </div>

        {/* 2 CARDS PER ROW MENU GRID */}
        <div className="guest-2col-menu-grid">
          {filteredDishes.length === 0 ? (
            <div className="empty-menu-box card" style={{ gridColumn: 'span 2' }}>
              <p>No dishes found matching your selection.</p>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => { setSelectedCategory('All'); setDietaryFilter('all'); setSearchQuery(''); }}
                style={{ marginTop: '10px' }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredDishes.map((dish) => {
              const inCart = cartItems.find((i) => i.id === dish.id);

              return (
                <div
                  key={dish.id}
                  className={`guest-dish-card card ${!dish.available ? 'dish-sold-out' : ''}`}
                >
                  <div className="dish-img-container">
                    <img src={dish.image} alt={dish.name} loading="lazy" />
                    <span className={`dish-veg-badge ${dish.isVeg ? 'veg' : 'non-veg'}`}>
                      {dish.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                    </span>
                    {!dish.available && <span className="sold-out-overlay">Sold Out</span>}
                  </div>

                  <div className="dish-info-container">
                    <div className="dish-top-row">
                      <span className="dish-category-tag">{dish.category}</span>
                      <span className="dish-prep-time">⏱ {dish.prepTime}</span>
                    </div>

                    <h4 className="dish-item-name">{dish.name}</h4>
                    <p className="dish-item-description">{dish.description}</p>

                    <div className="dish-bottom-action-row">
                      <strong className="dish-item-price">{formatINR(dish.price)}</strong>

                      {dish.available ? (
                        inCart ? (
                          <div className="cart-item-qty-selector">
                            <button
                              className="qty-btn"
                              onClick={() => handleUpdateQty(dish.id, -1)}
                              title="Decrease quantity"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="qty-number">{inCart.quantity}</span>
                            <button
                              className="qty-btn"
                              onClick={() => handleUpdateQty(dish.id, 1)}
                              title="Increase quantity"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        ) : (
                          <button
                            className="btn btn-primary btn-sm add-to-tray-btn"
                            onClick={() => handleAddToCart(dish)}
                          >
                            <Plus size={14} /> Add to Tray
                          </button>
                        )
                      ) : (
                        <span className="sold-out-text">Currently Unavailable</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Floating Tray Sticky Bar on Mobile if items exist */}
      {cartCount > 0 && !isCartOpen && (
        <div className="floating-cart-bar">
          <div className="cart-bar-info">
            <span className="cart-bar-count">{cartCount} items</span>
            <strong className="cart-bar-total">{formatINR(grandTotal)}</strong>
          </div>
          <button className="btn btn-brass btn-sm" onClick={() => setIsCartOpen(true)}>
            View Tray <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Guest Cart / Tray Checkout Drawer */}
      {isCartOpen && (
        <div className="modal-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="guest-cart-drawer card" onClick={(e) => e.stopPropagation()}>
            <div className="cart-drawer-header">
              <div>
                <h3>Your Dining Tray</h3>
                <small className="text-muted">{cartCount} items selected</small>
              </div>
              <button className="modal-close-icon" onClick={() => setIsCartOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="cart-drawer-body">
              {cartItems.length === 0 ? (
                <div className="empty-cart-message">
                  <ShoppingBag size={36} className="empty-cart-icon" />
                  <p>Your dining tray is empty.</p>
                  <small>Add delicious Butterbrew, pastries, or roasts from the menu!</small>
                </div>
              ) : (
                <div className="cart-items-list">
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-line-item">
                      <div className="line-item-left">
                        <span className={`item-veg-dot ${item.isVeg ? 'dot-veg' : 'dot-nonveg'}`}></span>
                        <div>
                          <strong>{item.name}</strong>
                          <div className="line-rate">₹{item.price} each</div>
                        </div>
                      </div>

                      <div className="line-item-controls">
                        <div className="cart-item-qty-selector">
                          <button className="qty-btn" onClick={() => handleUpdateQty(item.id, -1)}>
                            <Minus size={12} />
                          </button>
                          <span className="qty-number">{item.quantity}</span>
                          <button className="qty-btn" onClick={() => handleUpdateQty(item.id, 1)}>
                            <Plus size={12} />
                          </button>
                        </div>
                        <strong className="line-total">{formatINR(item.price * item.quantity)}</strong>
                      </div>
                    </div>
                  ))}

                  <div className="brass-divider"></div>

                  {/* Checkout Options Form */}
                  <form onSubmit={handleCheckout} className="checkout-guest-form">
                    <div className="form-group">
                      <label className="form-label">Dining Option</label>
                      <div className="dining-choice-row">
                        <button
                          type="button"
                          className={`btn ${diningType === 'dine-in' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                          onClick={() => setDiningType('dine-in')}
                        >
                          Dine-In (Table)
                        </button>
                        <button
                          type="button"
                          className={`btn ${diningType === 'takeaway' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                          onClick={() => setDiningType('takeaway')}
                        >
                          Takeaway Counter
                        </button>
                      </div>
                    </div>

                    {diningType === 'dine-in' && (
                      <div className="form-group">
                        <label className="form-label">Select Your Table</label>
                        <select
                          className="form-control"
                          value={selectedTable}
                          onChange={(e) => setSelectedTable(e.target.value)}
                        >
                          {tables.map((tbl) => (
                            <option key={tbl.id} value={tbl.number}>
                              Table {tbl.number} — {tbl.area} ({tbl.seats} Seats) [{tbl.status}]
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="form-group-row">
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Your Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Harry Potter"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Phone (Optional)</label>
                        <input
                          type="text"
                          placeholder="+91 98765 43210"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          className="form-control"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Payment Method</label>
                      <div className="payment-options-row">
                        <button
                          type="button"
                          className={`pay-mode-btn ${guestPaymentMethod === 'UPI' ? 'active' : ''}`}
                          onClick={() => setGuestPaymentMethod('UPI')}
                        >
                          <QrCode size={13} /> UPI
                        </button>
                        <button
                          type="button"
                          className={`pay-mode-btn ${guestPaymentMethod === 'Card' ? 'active' : ''}`}
                          onClick={() => setGuestPaymentMethod('Card')}
                        >
                          <CreditCard size={13} /> Card
                        </button>
                        <button
                          type="button"
                          className={`pay-mode-btn ${guestPaymentMethod === 'Cash' ? 'active' : ''}`}
                          onClick={() => setGuestPaymentMethod('Cash')}
                        >
                          <Banknote size={13} /> Cash
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Dietary preference / Kitchen instruction..."
                        value={specialNote}
                        onChange={(e) => setSpecialNote(e.target.value)}
                        className="form-control"
                      />
                    </div>

                    {/* Calculation Summary */}
                    <div className="cart-total-box">
                      <div className="calc-line">
                        <span>Subtotal:</span>
                        <span>{formatINR(subtotal)}</span>
                      </div>
                      <div className="calc-line">
                        <span>GST ({settings.gstPercent}%):</span>
                        <span>{formatINR(tax)}</span>
                      </div>
                      <div className="calc-divider"></div>
                      <div className="calc-line grand-total-line">
                        <strong>Grand Total:</strong>
                        <strong className="grand-price-text">{formatINR(grandTotal)}</strong>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      style={{ width: '100%', marginTop: '14px' }}
                    >
                      <CheckCircle size={17} /> Place Order & View Bill
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Guest Table Reservation Modal */}
      {isResModalOpen && (
        <div className="modal-overlay" onClick={() => setIsResModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reserve a Table at Hogwarts Cafe</h3>
              <button className="modal-close-icon" onClick={() => setIsResModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleReserveSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hermione Granger"
                    value={resName}
                    onChange={(e) => setResName(e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="form-group-row">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Contact Phone *</label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98765 43210"
                      value={resPhone}
                      onChange={(e) => setResPhone(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group" style={{ width: '130px' }}>
                    <label className="form-label">Guests *</label>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      required
                      value={resGuests}
                      onChange={(e) => setResGuests(Math.max(1, Number(e.target.value)))}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Date *</label>
                    <input
                      type="date"
                      required
                      value={resDate}
                      onChange={(e) => setResDate(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Time *</label>
                    <input
                      type="time"
                      required
                      value={resTime}
                      onChange={(e) => setResTime(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Preferred Section</label>
                    <select
                      className="form-control"
                      value={resSection}
                      onChange={(e) => setResSection(e.target.value)}
                    >
                      <option value="The Great Hall">The Great Hall</option>
                      <option value="The Library Lounge">The Library Lounge</option>
                      <option value="The Common Room">The Common Room</option>
                      <option value="The Courtyard">The Courtyard</option>
                      <option value="The Fireplace Section">The Fireplace Section</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Assign Table</label>
                    <select
                      className="form-control"
                      value={resTableId}
                      onChange={(e) => setResTableId(e.target.value)}
                    >
                      {tables.filter((t) => t.area === resSection).map((t) => (
                        <option key={t.id} value={t.id}>
                          Table {t.number} ({t.seats} seats)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Special Occasion / Dietary Notes</label>
                  <textarea
                    className="form-control"
                    placeholder="e.g. Birthday celebration, window seat preference..."
                    value={resNotes}
                    onChange={(e) => setResNotes(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsResModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Table Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
