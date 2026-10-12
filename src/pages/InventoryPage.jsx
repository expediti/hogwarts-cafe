import React, { useState } from 'react';
import { useCafe } from '../context/CafeContext';
import { formatINR } from '../utils/formatters';
import {
  Boxes,
  PlusCircle,
  Search,
  AlertTriangle,
  CheckCircle,
  Truck,
  ArrowUpDown,
  Edit,
  Plus,
  Minus,
  X
} from 'lucide-react';

export default function InventoryPage() {
  const {
    inventory,
    addInventoryItem,
    updateInventoryStock,
    updateInventoryDetails,
    addToast
  } = useCafe();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // 'all' or 'low-stock'

  // Modal State for Add Ingredient
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('kg');
  const [currentStock, setCurrentStock] = useState(10);
  const [minStock, setMinStock] = useState(3);
  const [costPerUnit, setCostPerUnit] = useState(100);
  const [supplier, setSupplier] = useState('');

  // Quick Stock Adjustment Modal State
  const [adjustModalItem, setAdjustModalItem] = useState(null);
  const [adjustDelta, setAdjustDelta] = useState(5);
  const [adjustType, setAdjustType] = useState('add'); // 'add' (purchase) or 'deduct' (spoilage/loss)

  const filteredInventory = inventory.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = filterMode === 'all' || item.currentStock <= item.minStock;
    return matchSearch && matchFilter;
  });

  const lowStockCount = inventory.filter((i) => i.currentStock <= i.minStock).length;

  const handleOpenAdd = () => {
    setName('');
    setUnit('kg');
    setCurrentStock(10);
    setMinStock(3);
    setCostPerUnit(150);
    setSupplier('Hogwarts Estate Provisioners');
    setIsAddModalOpen(true);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Ingredient name is required.', 'warning');
      return;
    }
    addInventoryItem({
      name: name.trim(),
      unit,
      currentStock: Number(currentStock),
      minStock: Number(minStock),
      costPerUnit: Number(costPerUnit),
      supplier: supplier.trim()
    });
    setIsAddModalOpen(false);
  };

  const handleAdjustSubmit = (e) => {
    e.preventDefault();
    if (!adjustModalItem || adjustDelta <= 0) return;

    updateInventoryStock(
      adjustModalItem.id,
      Number(adjustDelta),
      adjustType === 'add'
    );
    setAdjustModalItem(null);
  };

  return (
    <div className="page-container inventory-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Pantry & Ingredient Inventory</h1>
          <p className="page-subtitle">Track raw stock levels, record purchases and replenish kitchen stores.</p>
        </div>

        <div className="header-actions-group">
          <button className="btn btn-primary" onClick={handleOpenAdd} id="btn-add-ingredient">
            <PlusCircle size={15} /> Add Ingredient
          </button>
        </div>
      </div>

      {/* Low-stock Warning Banner */}
      {lowStockCount > 0 && (
        <div className="low-stock-alert-banner">
          <div className="alert-content-left">
            <AlertTriangle size={20} className="alert-icon-gold" />
            <div>
              <strong>Low Inventory Alert: {lowStockCount} ingredient(s) are below safety threshold!</strong>
              <p>Reorder supplies promptly from respective estate purveyors to avoid kitchen delays.</p>
            </div>
          </div>
          <button
            className="btn btn-brass btn-sm"
            onClick={() => setFilterMode(filterMode === 'low-stock' ? 'all' : 'low-stock')}
          >
            {filterMode === 'low-stock' ? 'Show All Ingredients' : 'Filter Low-Stock Items'}
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="card filter-bar-card">
        <div className="search-input-wrapper" style={{ minWidth: '300px' }}>
          <Search size={15} className="search-icon" />
          <input
            type="text"
            placeholder="Search ingredients or supplier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="tab-pill-group">
          <button
            className={`tab-pill-btn ${filterMode === 'all' ? 'active' : ''}`}
            onClick={() => setFilterMode('all')}
          >
            All Stock ({inventory.length})
          </button>
          <button
            className={`tab-pill-btn ${filterMode === 'low-stock' ? 'active' : ''}`}
            onClick={() => setFilterMode('low-stock')}
          >
            Critical / Low ({lowStockCount})
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="card inventory-table-card">
        <div className="table-responsive">
          <table className="heritage-table">
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Unit</th>
                <th>Current In-Stock</th>
                <th>Min. Threshold</th>
                <th>Stock Health</th>
                <th>Cost / Unit</th>
                <th>Purveyor / Supplier</th>
                <th style={{ textAlign: 'right' }}>Stock Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '36px' }}>
                    No ingredients found.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const isLow = item.currentStock <= item.minStock;
                  const ratio = item.minStock > 0 ? (item.currentStock / (item.minStock * 2)) * 100 : 100;
                  const clampedPercent = Math.min(100, Math.max(8, ratio));

                  return (
                    <tr key={item.id} className={isLow ? 'row-low-stock' : ''}>
                      <td>
                        <strong>{item.name}</strong>
                      </td>
                      <td>
                        <span className="unit-tag">{item.unit}</span>
                      </td>
                      <td>
                        <strong className={`stock-level-num ${isLow ? 'text-burgundy' : ''}`}>
                          {item.currentStock} {item.unit}
                        </strong>
                      </td>
                      <td className="text-muted">
                        {item.minStock} {item.unit}
                      </td>
                      <td style={{ minWidth: '150px' }}>
                        <div className="stock-health-bar-track">
                          <div
                            className={`stock-health-bar-fill ${isLow ? 'fill-low' : 'fill-good'}`}
                            style={{ width: `${clampedPercent}%` }}
                          ></div>
                        </div>
                        <small className={isLow ? 'text-burgundy' : 'text-forest'}>
                          {isLow ? '⚠️ Below Threshold' : '✓ Sufficient'}
                        </small>
                      </td>
                      <td>{formatINR(item.costPerUnit)}</td>
                      <td>
                        <span className="supplier-text">{item.supplier}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setAdjustModalItem(item);
                            setAdjustDelta(5);
                            setAdjustType('add');
                          }}
                          title="Record Purchase / Adjust Stock"
                        >
                          <ArrowUpDown size={13} /> Adjust Stock
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Ingredient */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Pantry Ingredient</h3>
              <button className="modal-close-icon" onClick={() => setIsAddModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Ingredient Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Vanilla Beans"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group-row">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Unit of Measurement</label>
                    <select
                      className="form-control"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                    >
                      <option value="kg">kg (Kilograms)</option>
                      <option value="L">L (Litres)</option>
                      <option value="g">g (Grams)</option>
                      <option value="units">units (Pieces)</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Initial Stock *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      min="0"
                      className="form-control"
                      value={currentStock}
                      onChange={(e) => setCurrentStock(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Min. Safety Stock *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      min="0"
                      className="form-control"
                      value={minStock}
                      onChange={(e) => setMinStock(e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Cost per Unit (INR ₹)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      className="form-control"
                      value={costPerUnit}
                      onChange={(e) => setCostPerUnit(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Supplier / Estate Purveyor</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Highland Dairy Co."
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" id="btn-save-ingredient">
                  Save Ingredient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Quick Stock Adjustment */}
      {adjustModalItem && (
        <div className="modal-overlay" onClick={() => setAdjustModalItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Adjust Stock: {adjustModalItem.name}</h3>
              <button className="modal-close-icon" onClick={() => setAdjustModalItem(null)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit}>
              <div className="modal-body">
                <div className="current-stock-info-box">
                  <span>Current On-Hand Stock:</span>
                  <strong>{adjustModalItem.currentStock} {adjustModalItem.unit}</strong>
                </div>

                <div className="form-group">
                  <label className="form-label">Adjustment Type</label>
                  <div className="adjustment-radio-row">
                    <button
                      type="button"
                      className={`btn ${adjustType === 'add' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                      onClick={() => setAdjustType('add')}
                    >
                      <Plus size={14} /> Record Restock / Purchase
                    </button>
                    <button
                      type="button"
                      className={`btn ${adjustType === 'deduct' ? 'btn-danger' : 'btn-secondary'} btn-sm`}
                      onClick={() => setAdjustType('deduct')}
                    >
                      <Minus size={14} /> Deduct Spoilage / Wastage
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Quantity to {adjustType === 'add' ? 'Add' : 'Deduct'} ({adjustModalItem.unit}) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    className="form-control"
                    value={adjustDelta}
                    onChange={(e) => setAdjustDelta(Math.max(0.1, Number(e.target.value)))}
                  />
                </div>

                <div className="resulting-stock-preview">
                  New Expected Stock:{' '}
                  <strong>
                    {adjustType === 'add'
                      ? (adjustModalItem.currentStock + Number(adjustDelta)).toFixed(2)
                      : Math.max(0, adjustModalItem.currentStock - Number(adjustDelta)).toFixed(2)}{' '}
                    {adjustModalItem.unit}
                  </strong>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setAdjustModalItem(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
