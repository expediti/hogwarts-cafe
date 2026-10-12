import React, { useState } from 'react';
import { useCafe } from '../context/CafeContext';
import { formatDate, formatTime } from '../utils/formatters';
import {
  CalendarDays,
  PlusCircle,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  UserCheck,
  Clock,
  MapPin,
  Calendar,
  AlertTriangle,
  Edit,
  X
} from 'lucide-react';

export default function ReservationsPage() {
  const {
    reservations,
    createReservation,
    updateReservation,
    cancelReservation,
    tables,
    settings,
    addToast
  } = useCafe();

  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  // Modal State for New/Edit Reservation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResId, setEditingResId] = useState(null);

  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formGuests, setFormGuests] = useState(2);
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formTime, setFormTime] = useState('19:30');
  const [formDuration, setFormDuration] = useState(settings.defaultReservationDuration || 90);
  const [formSection, setFormSection] = useState('The Great Hall');
  const [formTableId, setFormTableId] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Filtered Reservations
  const filteredReservations = reservations.filter((r) => {
    const matchSearch =
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery) ||
      (r.tableNumber && r.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchDate = !dateFilter || r.date === dateFilter;
    return matchSearch && matchStatus && matchDate;
  });

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingResId(null);
    setFormName('');
    setFormPhone('+91 ');
    setFormGuests(2);
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormTime('19:30');
    setFormDuration(settings.defaultReservationDuration || 90);
    setFormSection('The Great Hall');
    setFormTableId('T02');
    setFormNotes('');
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (res) => {
    setEditingResId(res.id);
    setFormName(res.customerName);
    setFormPhone(res.phone);
    setFormGuests(res.guests);
    setFormDate(res.date);
    setFormTime(res.time);
    setFormDuration(res.duration || 90);
    setFormSection(res.section);
    setFormTableId(res.tableId || res.tableNumber);
    setFormNotes(res.notes || '');
    setIsModalOpen(true);
  };

  // Save Reservation (Create or Update with Conflict Check)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      addToast('Customer name is required.', 'warning');
      return;
    }
    if (!formDate || !formTime) {
      addToast('Date and arrival time are required.', 'warning');
      return;
    }

    if (editingResId) {
      const result = updateReservation(editingResId, {
        customerName: formName.trim(),
        phone: formPhone.trim(),
        guests: Number(formGuests),
        date: formDate,
        time: formTime,
        duration: Number(formDuration),
        section: formSection,
        tableId: formTableId,
        notes: formNotes.trim()
      });
      if (result.success) {
        setIsModalOpen(false);
      }
    } else {
      const result = createReservation({
        customerName: formName.trim(),
        phone: formPhone.trim(),
        guests: Number(formGuests),
        date: formDate,
        time: formTime,
        duration: Number(formDuration),
        section: formSection,
        tableId: formTableId,
        notes: formNotes.trim()
      });
      if (result.success) {
        setIsModalOpen(false);
      }
    }
  };

  // Suitable Tables for the selected Section & Guests
  const availableSectionTables = tables.filter((t) => {
    const matchSection = !formSection || t.area === formSection;
    return matchSection;
  });

  return (
    <div className="page-container reservations-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Table Reservation Book</h1>
          <p className="page-subtitle">Manage guest bookings, seating sections and avoid scheduling conflicts.</p>
        </div>

        <div className="header-actions-group">
          <div className="tab-pill-group">
            <button
              className={`tab-pill-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              List View
            </button>
            <button
              className={`tab-pill-btn ${viewMode === 'calendar' ? 'active' : ''}`}
              onClick={() => setViewMode('calendar')}
            >
              Daily Timeline
            </button>
          </div>

          <button className="btn btn-primary" onClick={handleOpenCreate} id="btn-create-reservation">
            <PlusCircle size={15} /> Book Reservation
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="card filter-bar-card">
        <div className="filters-left">
          <div className="search-input-wrapper" style={{ minWidth: '260px' }}>
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="Search patron, phone, table..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="date-picker-box">
            <Calendar size={14} className="cal-icon" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="form-control date-input"
            />
            {dateFilter && (
              <button className="clear-date-btn" onClick={() => setDateFilter('')} title="Clear date filter">
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        <div className="status-filter-pills">
          {['All', 'Confirmed', 'Seated', 'Completed', 'Cancelled', 'No-show'].map((status) => (
            <button
              key={status}
              className={`status-filter-chip ${statusFilter === status ? 'active' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {viewMode === 'list' ? (
        /* List View */
        <div className="card reservations-list-card">
          <div className="table-responsive">
            <table className="heritage-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Guest Name</th>
                  <th>Contact</th>
                  <th>Guests</th>
                  <th>Date & Time</th>
                  <th>Duration</th>
                  <th>Area & Table</th>
                  <th>Special Notes</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.length === 0 ? (
                  <tr>
                    <td colSpan="10" style={{ textAlign: 'center', padding: '36px' }}>
                      No reservations matching current filters.
                    </td>
                  </tr>
                ) : (
                  filteredReservations.map((res) => (
                    <tr key={res.id}>
                      <td>
                        <strong className="order-num-text">{res.id}</strong>
                      </td>
                      <td>
                        <strong>{res.customerName}</strong>
                      </td>
                      <td>{res.phone}</td>
                      <td>
                        <span className="guest-count-pill">{res.guests} Guests</span>
                      </td>
                      <td>
                        <div>{formatDate(res.date)}</div>
                        <small className="text-muted">{formatTime(res.time)}</small>
                      </td>
                      <td>{res.duration || 90} mins</td>
                      <td>
                        <div className="area-cell">
                          <span className="table-tag">{res.tableNumber}</span>
                          <span className="sub-area">{res.section}</span>
                        </div>
                      </td>
                      <td>
                        <span className="notes-snippet" title={res.notes}>
                          {res.notes || '—'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill status-${res.status.toLowerCase()}`}>
                          {res.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            className="btn btn-outline btn-sm action-icon-btn"
                            onClick={() => handleOpenEdit(res)}
                            title="Edit reservation"
                          >
                            <Edit size={13} />
                          </button>
                          {res.status !== 'Cancelled' && (
                            <button
                              className="btn btn-danger btn-sm action-icon-btn"
                              onClick={() => cancelReservation(res.id)}
                              title="Cancel reservation"
                            >
                              <XCircle size={13} />
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
      ) : (
        /* Calendar / Daily Schedule View */
        <div className="card timeline-view-card">
          <div className="timeline-header">
            <h3>Schedule for {dateFilter ? formatDate(dateFilter) : "Today's Service"}</h3>
            <span className="total-badge">{filteredReservations.length} Bookings</span>
          </div>

          <div className="timeline-grid">
            {['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'].map((hourSlot) => {
              const slotBookings = filteredReservations.filter((r) => r.time.startsWith(hourSlot.slice(0, 2)));

              return (
                <div key={hourSlot} className="timeline-hour-row">
                  <div className="hour-label">
                    <Clock size={13} />
                    <span>{hourSlot}</span>
                  </div>

                  <div className="hour-slots-track">
                    {slotBookings.length === 0 ? (
                      <span className="slot-empty">—</span>
                    ) : (
                      slotBookings.map((b) => (
                        <div
                          key={b.id}
                          className={`res-slot-card slot-status-${b.status.toLowerCase()}`}
                          onClick={() => handleOpenEdit(b)}
                        >
                          <div className="slot-top">
                            <strong>{b.customerName}</strong>
                            <span className="slot-table">{b.tableNumber}</span>
                          </div>
                          <div className="slot-meta">
                            <span>{b.time} ({b.duration}m)</span>
                            <span>• {b.guests} guests</span>
                            <span>• {b.status}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: New / Edit Reservation */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingResId ? 'Edit Reservation' : 'New Table Reservation'}</h3>
              <button className="modal-close-icon" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Patron / Guest Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Minerva McGonagall"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                </div>

                <div className="form-group-row">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="+91 98765 43210"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ width: '130px' }}>
                    <label className="form-label">Guests *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="12"
                      className="form-control"
                      value={formGuests}
                      onChange={(e) => setFormGuests(Math.max(1, Number(e.target.value)))}
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Date *</label>
                    <input
                      type="date"
                      required
                      className="form-control"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Arrival Time *</label>
                    <input
                      type="time"
                      required
                      className="form-control"
                      value={formTime}
                      onChange={(e) => setFormTime(e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ width: '130px' }}>
                    <label className="form-label">Duration (m)</label>
                    <input
                      type="number"
                      min="30"
                      step="15"
                      className="form-control"
                      value={formDuration}
                      onChange={(e) => setFormDuration(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Preferred Section</label>
                    <select
                      className="form-control"
                      value={formSection}
                      onChange={(e) => setFormSection(e.target.value)}
                    >
                      <option value="The Great Hall">The Great Hall</option>
                      <option value="The Library Lounge">The Library Lounge</option>
                      <option value="The Common Room">The Common Room</option>
                      <option value="The Courtyard">The Courtyard</option>
                      <option value="The Fireplace Section">The Fireplace Section</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Assign Table *</label>
                    <select
                      className="form-control"
                      value={formTableId}
                      onChange={(e) => setFormTableId(e.target.value)}
                    >
                      {availableSectionTables.map((t) => (
                        <option key={t.id} value={t.id}>
                          Table {t.number} ({t.seats} seats) - {t.area}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Special Requests / Dietary Notes</label>
                  <textarea
                    className="form-control"
                    placeholder="e.g. Quiet corner table, anniversary celebration..."
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" id="btn-save-reservation">
                  {editingResId ? 'Update Reservation' : 'Confirm Reservation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
