import React, { useState } from 'react';
import { useCafe } from '../context/CafeContext';
import { exportFullDataJSON } from '../utils/formatters';
import {
  Settings,
  Save,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Building,
  Clock,
  MapPin,
  Percent,
  Receipt,
  FileJson
} from 'lucide-react';

export default function SettingsPage() {
  const {
    settings,
    updateSettings,
    tables,
    menu,
    inventory,
    customers,
    orders,
    reservations,
    resetDemonstrationData,
    clearAllData,
    importDataFromJSON,
    addToast
  } = useCafe();

  // Local state for editable settings
  const [cafeName, setCafeName] = useState(settings.cafeName || 'Hogwarts Cafe');
  const [brandSubtitle, setBrandSubtitle] = useState(settings.brandSubtitle || "The Wizarding World's Dining Room");
  const [tagline, setTagline] = useState(settings.tagline || 'A LITTLE MAGIC IN EVERY SERVING.');
  const [gstPercent, setGstPercent] = useState(settings.gstPercent || 5);
  const [defaultDuration, setDefaultDuration] = useState(settings.defaultReservationDuration || 90);
  const [openingHours, setOpeningHours] = useState(settings.openingHours || '08:00 AM – 11:00 PM');
  const [address, setAddress] = useState(settings.address || "North Cloister, Hogwarts Castle & Platform 9¾ Concourse");
  const [phone, setPhone] = useState(settings.phone || '+91 800 464 9278');
  const [receiptFooter, setReceiptFooter] = useState(settings.receiptFooter || 'Mischief Managed. Thank you for dining with us at Hogwarts Cafe!');

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateSettings({
      cafeName: cafeName.trim(),
      brandSubtitle: brandSubtitle.trim(),
      tagline: tagline.trim(),
      gstPercent: Number(gstPercent),
      defaultReservationDuration: Number(defaultDuration),
      openingHours: openingHours.trim(),
      address: address.trim(),
      phone: phone.trim(),
      receiptFooter: receiptFooter.trim()
    });
  };

  // Full JSON Export
  const handleExportJSON = () => {
    const fullBackup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings,
      tables,
      menu,
      inventory,
      customers,
      orders,
      reservations
    };
    exportFullDataJSON(fullBackup);
    addToast('Complete Hogwarts Cafe database backup downloaded.', 'success');
  };

  // Full JSON Import
  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (window.confirm('Restore database from this backup? Existing records will be replaced.')) {
          importDataFromJSON(parsed);
        }
      } catch (err) {
        addToast('Invalid JSON file. Import aborted.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset file input
  };

  const handleResetDemoData = () => {
    if (window.confirm('Reset all demonstration data to default Hogwarts Cafe values? Any unsaved orders will be reverted.')) {
      resetDemonstrationData();
    }
  };

  const handleClearAllData = () => {
    if (window.confirm('WARNING: Are you sure you wish to wipe all orders, customers, and operational data? This cannot be undone.')) {
      clearAllData();
    }
  };

  return (
    <div className="page-container settings-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Café Operations & Settings</h1>
          <p className="page-subtitle">Configure hospitality parameters, tax rates and local data backups.</p>
        </div>
      </div>

      <div className="settings-layout-grid">
        {/* Settings Form */}
        <div className="card settings-form-card">
          <form onSubmit={handleSaveSettings}>
            <div className="settings-section-title">
              <Building size={17} className="text-forest" />
              <h3>Establishment Branding</h3>
            </div>

            <div className="form-group-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Café Brand Name</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={cafeName}
                  onChange={(e) => setCafeName(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Brand Subtitle</label>
                <input
                  type="text"
                  className="form-control"
                  value={brandSubtitle}
                  onChange={(e) => setBrandSubtitle(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Official Tagline</label>
              <input
                type="text"
                className="form-control"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
              />
            </div>

            <div className="brass-divider"></div>

            <div className="settings-section-title">
              <Percent size={17} className="text-forest" />
              <h3>Operational & POS Rules</h3>
            </div>

            <div className="form-group-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Currency Symbol / Standard</label>
                <input
                  type="text"
                  disabled
                  className="form-control"
                  value="Indian Rupee (INR — ₹)"
                  style={{ backgroundColor: 'var(--color-aged-paper)', cursor: 'not-allowed' }}
                />
              </div>

              <div className="form-group" style={{ width: '150px' }}>
                <label className="form-label">GST Tax (%)</label>
                <input
                  type="number"
                  min="0"
                  max="28"
                  step="0.5"
                  required
                  className="form-control"
                  value={gstPercent}
                  onChange={(e) => setGstPercent(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ width: '180px' }}>
                <label className="form-label">Default Booking Duration</label>
                <input
                  type="number"
                  min="30"
                  step="15"
                  required
                  className="form-control"
                  value={defaultDuration}
                  onChange={(e) => setDefaultDuration(e.target.value)}
                />
                <small className="text-muted">In minutes (Default 90m)</small>
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Service Opening Hours</label>
                <input
                  type="text"
                  className="form-control"
                  value={openingHours}
                  onChange={(e) => setOpeningHours(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Direct Concierge Phone</label>
                <input
                  type="text"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Café Heritage Address</label>
              <input
                type="text"
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Receipt / Bill Footer Blessing</label>
              <textarea
                className="form-control"
                value={receiptFooter}
                onChange={(e) => setReceiptFooter(e.target.value)}
              ></textarea>
            </div>

            <div style={{ marginTop: '22px' }}>
              <button type="submit" className="btn btn-primary" id="btn-save-settings">
                <Save size={15} /> Save Operational Changes
              </button>
            </div>
          </form>
        </div>

        {/* Data Persistence & Backup Card */}
        <div className="card settings-backup-card">
          <div className="settings-section-title">
            <FileJson size={17} className="text-brass" />
            <h3>Data Management & Persistence</h3>
          </div>
          <p className="card-subtitle" style={{ marginBottom: '18px' }}>
            All operations are persisted locally via browser <code>localStorage</code>. No external database or server is required.
          </p>

          <div className="backup-actions-stack">
            <div className="action-box">
              <div className="action-text">
                <strong>Export Database Backup</strong>
                <p>Download complete JSON archive containing all orders, reservations, tables, inventory, and menu records.</p>
              </div>
              <button className="btn btn-brass btn-sm" onClick={handleExportJSON} id="btn-export-backup">
                <Download size={14} /> Export JSON
              </button>
            </div>

            <div className="action-box">
              <div className="action-text">
                <strong>Restore Database Backup</strong>
                <p>Import a previously saved Hogwarts Cafe JSON backup file.</p>
              </div>
              <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                <Upload size={14} /> Import JSON
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportJSON}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            <div className="brass-divider"></div>

            <div className="action-box danger-zone">
              <div className="action-text">
                <strong>Reset Demonstration Data</strong>
                <p>Reload original Hogwarts seed data (dishes, tables, sample orders & reservations).</p>
              </div>
              <button className="btn btn-outline btn-sm" onClick={handleResetDemoData} id="btn-reset-demo">
                <RotateCcw size={14} /> Reset Demo Data
              </button>
            </div>

            <div className="action-box danger-zone">
              <div className="action-text">
                <strong>Clear All Data</strong>
                <p>Wipe all stored orders, reservations, and customer records from this browser.</p>
              </div>
              <button className="btn btn-danger btn-sm" onClick={handleClearAllData} id="btn-clear-all">
                <Trash2 size={14} /> Clear All Records
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
