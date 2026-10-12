import React, { useState } from 'react';
import { useCafe } from '../context/CafeContext';
import { formatINR, formatDate, formatTime } from '../utils/formatters';
import {
  Users,
  PlusCircle,
  Search,
  Receipt,
  Phone,
  Calendar,
  Sparkles,
  Edit,
  Eye,
  X
} from 'lucide-react';

export default function CustomersPage() {
  const {
    customers,
    addCustomer,
    updateCustomer,
    orders,
    setActiveReceiptOrder,
    addToast
  } = useCafe();

  const [searchQuery, setSearchQuery] = useState('');

  // Modal State for Add / Edit Customer
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustId, setEditingCustId] = useState(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [tag, setTag] = useState('Regular');
  const [notes, setNotes] = useState('');

  // Selected Customer for Order History Modal
  const [viewHistoryCust, setViewHistoryCust] = useState(null);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.tag && c.tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenAdd = () => {
    setEditingCustId(null);
    setName('');
    setPhone('+91 ');
    setTag('Regular');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cust) => {
    setEditingCustId(cust.id);
    setName(cust.name);
    setPhone(cust.phone);
    setTag(cust.tag || 'Regular');
    setNotes(cust.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Customer name is required.', 'warning');
      return;
    }

    if (editingCustId) {
      updateCustomer(editingCustId, {
        name: name.trim(),
        phone: phone.trim(),
        tag,
        notes: notes.trim()
      });
    } else {
      addCustomer({
        name: name.trim(),
        phone: phone.trim(),
        visitCount: 1,
        totalSpending: 0,
        lastVisit: new Date().toISOString().split('T')[0],
        tag,
        notes: notes.trim()
      });
    }
    setIsModalOpen(false);
  };

  // Orders placed by selected customer
  const customerOrders = viewHistoryCust
    ? orders.filter(
        (o) =>
          (o.customerPhone && o.customerPhone === viewHistoryCust.phone) ||
          o.customerName.toLowerCase() === viewHistoryCust.name.toLowerCase()
      )
    : [];

  return (
    <div className="page-container customers-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Patron & Guest Directory</h1>
          <p className="page-subtitle">Track loyal patrons, dining frequency, and historic spending habits.</p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd} id="btn-add-customer">
          <PlusCircle size={15} /> Add Guest Record
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card filter-bar-card">
        <div className="search-input-wrapper" style={{ maxWidth: '380px' }}>
          <Search size={15} className="search-icon" />
          <input
            type="text"
            placeholder="Search patron by name, phone or VIP tier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control"
          />
        </div>
        <span className="text-muted" style={{ fontSize: '13px' }}>
          Showing {filteredCustomers.length} registered patrons
        </span>
      </div>

      {/* Customers Table */}
      <div className="card customers-table-card">
        <div className="table-responsive">
          <table className="heritage-table">
            <thead>
              <tr>
                <th>Patron Name</th>
                <th>Phone Number</th>
                <th>Tier / Status</th>
                <th>Visits</th>
                <th>Lifetime Spend</th>
                <th>Last Visit</th>
                <th>Prefers & Dietary Notes</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '36px' }}>
                    No patron records found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id}>
                    <td>
                      <strong className="customer-name-text">{cust.name}</strong>
                    </td>
                    <td>
                      <span className="phone-tag">{cust.phone}</span>
                    </td>
                    <td>
                      <span className={`status-pill ${cust.tag?.includes('VIP') ? 'status-occupied' : 'status-available'}`}>
                        {cust.tag || 'Regular'}
                      </span>
                    </td>
                    <td>
                      <span className="visit-badge">{cust.visitCount || 1} visits</span>
                    </td>
                    <td>
                      <strong>{formatINR(cust.totalSpending || 0)}</strong>
                    </td>
                    <td>{formatDate(cust.lastVisit)}</td>
                    <td>
                      <span className="notes-snippet" title={cust.notes}>
                        {cust.notes || '—'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          className="btn btn-secondary btn-sm action-icon-btn"
                          onClick={() => setViewHistoryCust(cust)}
                          title="View Order History"
                        >
                          <Receipt size={13} /> History
                        </button>
                        <button
                          className="btn btn-outline btn-sm action-icon-btn"
                          onClick={() => handleOpenEdit(cust)}
                          title="Edit Patron Details"
                        >
                          <Edit size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add / Edit Customer */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingCustId ? 'Edit Patron Profile' : 'New Guest Record'}</h3>
              <button className="modal-close-icon" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Patron Full Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Harry Potter"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Tier / Tag</label>
                    <select
                      className="form-control"
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                    >
                      <option value="VIP Regular">VIP Regular</option>
                      <option value="Regular">Regular</option>
                      <option value="Returning">Returning</option>
                      <option value="New Customer">New Customer</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Dining Preferences & Staff Notes</label>
                  <textarea
                    className="form-control"
                    placeholder="Favorite seating chambers, favorite brews, allergy cautions..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" id="btn-save-customer">
                  Save Patron
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Customer Order History */}
      {viewHistoryCust && (
        <div className="modal-overlay" onClick={() => setViewHistoryCust(null)}>
          <div className="modal-content" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Order History: {viewHistoryCust.name}</h3>
                <small style={{ color: 'var(--color-aged-paper)' }}>
                  Total Spend: {formatINR(viewHistoryCust.totalSpending)} • {viewHistoryCust.visitCount} visits
                </small>
              </div>
              <button className="modal-close-icon" onClick={() => setViewHistoryCust(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {customerOrders.length === 0 ? (
                <div className="empty-subtle" style={{ padding: '24px' }}>
                  No historical orders found on record for this patron.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="heritage-table">
                    <thead>
                      <tr>
                        <th>Order #</th>
                        <th>Date & Time</th>
                        <th>Table</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Bill</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerOrders.map((ord) => (
                        <tr key={ord.id}>
                          <td><strong>{ord.orderNumber}</strong></td>
                          <td>{formatDate(ord.date)} <small>{formatTime(ord.time)}</small></td>
                          <td><span className="table-tag">{ord.tableNumber}</span></td>
                          <td>
                            <small>{ord.items?.map((i) => `${i.quantity}x ${i.name}`).join(', ')}</small>
                          </td>
                          <td><strong>{formatINR(ord.total)}</strong></td>
                          <td><span className="status-pill status-available">{ord.status}</span></td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              className="btn btn-brass btn-sm"
                              onClick={() => {
                                setViewHistoryCust(null);
                                setActiveReceiptOrder(ord);
                              }}
                            >
                              <Eye size={12} /> View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setViewHistoryCust(null)}>
                Close History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
