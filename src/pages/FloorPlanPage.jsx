import React, { useState } from 'react';
import { useCafe } from '../context/CafeContext';
import { formatINR } from '../utils/formatters';
import {
  Users,
  CheckCircle,
  Clock,
  Sparkles,
  ShoppingBag,
  RotateCcw,
  CalendarCheck,
  X,
  AlertCircle,
  Utensils
} from 'lucide-react';

export default function FloorPlanPage() {
  const {
    tables,
    updateTableStatus,
    seatGuestsAtTable,
    reservations,
    orders,
    setCurrentView,
    addToast
  } = useCafe();

  const [selectedTableId, setSelectedTableId] = useState(tables[0]?.id || 'T01');
  const [filterArea, setFilterArea] = useState('All');
  
  // Seat guests modal/form state
  const [guestName, setGuestName] = useState('');
  const [guestPartySize, setGuestPartySize] = useState(2);
  const [selectedResIdToSeat, setSelectedResIdToSeat] = useState('');

  const selectedTable = tables.find((t) => t.id === selectedTableId) || tables[0];

  // The 5 defined Areas
  const areas = [
    { name: 'The Great Hall', desc: 'Floating candle chandeliers & grand longhouse tables' },
    { name: 'The Library Lounge', desc: 'Antique walnut armchairs surrounded by spellbooks' },
    { name: 'The Common Room', desc: 'Velvet settees and house tapestry alcoves' },
    { name: 'The Courtyard', desc: 'Open-air stone cloister beneath the Scottish Highlands' },
    { name: 'The Fireplace Section', desc: 'Roaring stone hearth with warm bronze glow' },
  ];

  // Current active order for selected table (if any)
  const currentOrder = orders.find(
    (o) => o.tableNumber === selectedTable?.number && ['Pending', 'Preparing', 'Ready', 'Served'].includes(o.status)
  );

  // Active reservations matching today and this table
  const todayStr = new Date().toISOString().split('T')[0];
  const tableReservations = reservations.filter(
    (r) => (r.tableId === selectedTable?.id || r.tableNumber === selectedTable?.number) &&
           r.date === todayStr &&
           r.status === 'Confirmed'
  );

  // Seating action
  const handleSeatGuests = (e) => {
    e.preventDefault();
    if (!guestName.trim()) {
      addToast('Please enter customer name to seat.', 'warning');
      return;
    }
    if (selectedTable.status === 'Occupied') {
      addToast('This table is already occupied! Settle or clear existing party first.', 'error');
      return;
    }
    if (guestPartySize > selectedTable.seats) {
      addToast(`Warning: party size (${guestPartySize}) exceeds table capacity (${selectedTable.seats}).`, 'warning');
    }

    seatGuestsAtTable(selectedTable.id, guestName.trim(), guestPartySize, selectedResIdToSeat || null);
    setGuestName('');
    setSelectedResIdToSeat('');
  };

  const handleStartOrder = () => {
    setCurrentView('orders');
  };

  // Helper to render chairs around a top-down table representation
  const renderChairs = (seats) => {
    const chairs = [];
    for (let i = 0; i < seats; i++) {
      chairs.push(
        <div key={i} className={`chair-node chair-pos-${i % 6}`} title="Dining Chair"></div>
      );
    }
    return chairs;
  };

  return (
    <div className="page-container floorplan-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Hogwarts Floor Plan & Seating</h1>
          <p className="page-subtitle">Interactive architectural layout across all five dining chambers.</p>
        </div>

        {/* Area Filter Buttons */}
        <div className="floorplan-area-filters">
          <button
            className={`filter-area-btn ${filterArea === 'All' ? 'active' : ''}`}
            onClick={() => setFilterArea('All')}
          >
            All Areas (20)
          </button>
          {areas.map((a) => (
            <button
              key={a.name}
              className={`filter-area-btn ${filterArea === a.name ? 'active' : ''}`}
              onClick={() => setFilterArea(a.name)}
            >
              {a.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Floor Plan Grid: Visual Layout (Left) + Table Detail Drawer (Right) */}
      <div className="floorplan-container-layout">
        {/* Left: Top-Down Visual Floor Plan */}
        <div className="floorplan-visual-canvas card">
          <div className="canvas-header">
            <span className="canvas-compass">N ↑ GREAT HALL CONCOURSE</span>
            <div className="canvas-status-legend">
              <span className="legend-item"><span className="legend-swatch swatch-avail"></span> Available</span>
              <span className="legend-item"><span className="legend-swatch swatch-occ"></span> Occupied</span>
              <span className="legend-item"><span className="legend-swatch swatch-res"></span> Reserved</span>
              <span className="legend-item"><span className="legend-swatch swatch-clean"></span> Cleaning</span>
            </div>
          </div>

          <div className="floorplan-sections-wrapper">
            {areas.map((area) => {
              if (filterArea !== 'All' && filterArea !== area.name) return null;

              const areaTables = tables.filter((t) => t.area === area.name);

              return (
                <div key={area.name} className="floorplan-chamber-card">
                  <div className="chamber-header">
                    <div>
                      <h4 className="chamber-name">{area.name}</h4>
                      <p className="chamber-desc">{area.desc}</p>
                    </div>
                    <span className="chamber-table-count">{areaTables.length} Tables</span>
                  </div>

                  <div className="chamber-tables-row">
                    {areaTables.map((tbl) => {
                      const isSelected = selectedTable?.id === tbl.id;
                      const statusClass = tbl.status.toLowerCase();

                      return (
                        <div
                          key={tbl.id}
                          className={`table-object ${statusClass} ${isSelected ? 'selected-table' : ''}`}
                          onClick={() => setSelectedTableId(tbl.id)}
                          id={`table-node-${tbl.number}`}
                        >
                          {/* Top-down visual chairs */}
                          <div className="chairs-wrapper">
                            {renderChairs(tbl.seats)}
                          </div>

                          {/* Table Center Surface */}
                          <div className="table-surface">
                            <span className="tbl-id">{tbl.number}</span>
                            <span className="tbl-capacity">{tbl.seats} Seats</span>
                            {tbl.occupants && (
                              <span className="tbl-occupant-name" title={tbl.occupants.name}>
                                {tbl.occupants.name.split(' ')[0]}
                              </span>
                            )}
                          </div>

                          <div className={`table-status-indicator status-dot-${statusClass}`}></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Table Detail & Action Drawer */}
        <div className="table-inspector-drawer card">
          {selectedTable ? (
            <div className="inspector-content">
              <div className="inspector-top-banner">
                <div className="inspector-title-row">
                  <div>
                    <h3 className="inspector-table-num">Table {selectedTable.number}</h3>
                    <span className="inspector-area-name">{selectedTable.area}</span>
                  </div>
                  <span className={`status-pill status-${selectedTable.status.toLowerCase()}`}>
                    {selectedTable.status}
                  </span>
                </div>
                <div className="inspector-specs-row">
                  <span>Capacity: <strong>{selectedTable.seats} Seats</strong></span>
                  <span>Section: <strong>{selectedTable.area}</strong></span>
                </div>
              </div>

              <div className="brass-divider"></div>

              {/* Current Occupant Details */}
              <div className="occupancy-info-box">
                <h4 className="inspector-subhead">Current Occupants</h4>
                {selectedTable.occupants ? (
                  <div className="occupant-card">
                    <div className="occupant-name-row">
                      <Users size={16} className="text-forest" />
                      <strong>{selectedTable.occupants.name}</strong>
                    </div>
                    <div className="occupant-meta">
                      <span>Party Size: {selectedTable.occupants.partySize} guests</span>
                      <span>Seated At: {selectedTable.occupants.seatedAt}</span>
                    </div>
                  </div>
                ) : (
                  <p className="subtle-empty-text">No active dining party seated at this table.</p>
                )}
              </div>

              {/* Active Order Details if any */}
              {currentOrder && (
                <div className="table-active-order-box">
                  <div className="active-order-header">
                    <span className="order-chip">{currentOrder.orderNumber}</span>
                    <strong className="order-amount">{formatINR(currentOrder.total)}</strong>
                  </div>
                  <p className="order-items-snippet">
                    {currentOrder.items?.map((it) => `${it.quantity}x ${it.name}`).join(', ')}
                  </p>
                  <span className={`order-status-badge status-${currentOrder.status.toLowerCase()}`}>
                    Kitchen: {currentOrder.status}
                  </span>
                </div>
              )}

              {/* Reservations for this table today */}
              {tableReservations.length > 0 && (
                <div className="table-reservations-alert">
                  <h4 className="inspector-subhead">Upcoming Reservations Today</h4>
                  {tableReservations.map((res) => (
                    <div key={res.id} className="res-mini-card">
                      <div className="res-mini-top">
                        <strong>{res.customerName}</strong>
                        <span>{res.time} ({res.guests} guests)</span>
                      </div>
                      <small className="text-muted">{res.phone} • {res.notes || 'No notes'}</small>
                    </div>
                  ))}
                </div>
              )}

              <div className="brass-divider"></div>

              {/* Seating & Status Controls */}
              <div className="table-actions-section">
                <h4 className="inspector-subhead">Seating & Table Controls</h4>

                {/* Seat Customers Form */}
                {selectedTable.status !== 'Occupied' && (
                  <form onSubmit={handleSeatGuests} className="seating-form">
                    <div className="form-group">
                      <label className="form-label">Customer / Party Name:</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Hermione Granger"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Party Size (Max {selectedTable.seats}):</label>
                      <input
                        type="number"
                        min="1"
                        max={selectedTable.seats + 2}
                        className="form-control"
                        value={guestPartySize}
                        onChange={(e) => setGuestPartySize(Math.max(1, Number(e.target.value)))}
                      />
                    </div>

                    {tableReservations.length > 0 && (
                      <div className="form-group">
                        <label className="form-label">Assign from Today's Reservation:</label>
                        <select
                          className="form-control"
                          value={selectedResIdToSeat}
                          onChange={(e) => {
                            setSelectedResIdToSeat(e.target.value);
                            const found = tableReservations.find((r) => r.id === e.target.value);
                            if (found) {
                              setGuestName(found.customerName);
                              setGuestPartySize(found.guests);
                            }
                          }}
                        >
                          <option value="">Walk-in or Custom party</option>
                          {tableReservations.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.customerName} at {r.time} ({r.guests} guests)
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '10px' }}>
                      <Users size={14} /> Seat Customers
                    </button>
                  </form>
                )}

                {/* Quick Status Buttons */}
                <div className="status-button-grid">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => updateTableStatus(selectedTable.id, 'Available')}
                    disabled={selectedTable.status === 'Available'}
                    id="btn-table-available"
                  >
                    Mark Available
                  </button>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => updateTableStatus(selectedTable.id, 'Occupied')}
                    disabled={selectedTable.status === 'Occupied'}
                    id="btn-table-occupied"
                  >
                    Mark Occupied
                  </button>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => updateTableStatus(selectedTable.id, 'Reserved')}
                    disabled={selectedTable.status === 'Reserved'}
                    id="btn-table-reserved"
                  >
                    Mark Reserved
                  </button>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => updateTableStatus(selectedTable.id, 'Cleaning')}
                    disabled={selectedTable.status === 'Cleaning'}
                    id="btn-table-cleaning"
                  >
                    Mark Cleaning
                  </button>
                </div>

                {/* Start Order Button */}
                <button
                  className="btn btn-brass"
                  style={{ width: '100%', marginTop: '14px' }}
                  onClick={handleStartOrder}
                  id="btn-start-order-at-table"
                >
                  <Utensils size={15} /> Start Order at Table {selectedTable.number}
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-subtle">Select a table on the floor plan to view details.</div>
          )}
        </div>
      </div>
    </div>
  );
}
