import React, { useState } from 'react';
import { useCafe } from '../context/CafeContext';
import { formatINR, resizeImage } from '../utils/formatters';
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Upload,
  Image as ImageIcon,
  Clock,
  Sparkles,
  X
} from 'lucide-react';

export default function MenuPage() {
  const { menu, addMenuItem, updateMenuItem, deleteMenuItem, addToast } = useCafe();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal State for Add/Edit Dish
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Enchanted Coffee');
  const [formPrice, setFormPrice] = useState(200);
  const [formIsVeg, setFormIsVeg] = useState(true);
  const [formPrepTime, setFormPrepTime] = useState('5 mins');
  const [formAvailable, setFormAvailable] = useState(true);
  const [formDesc, setFormDesc] = useState('');
  const [formImage, setFormImage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

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

  const filteredItems = menu.filter((item) => {
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleOpenAdd = () => {
    setEditingItemId(null);
    setFormName('');
    setFormCategory('Enchanted Coffee');
    setFormPrice(180);
    setFormIsVeg(true);
    setFormPrepTime('5 mins');
    setFormAvailable(true);
    setFormDesc('');
    setFormImage('https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItemId(item.id);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormPrice(item.price);
    setFormIsVeg(item.isVeg);
    setFormPrepTime(item.prepTime);
    setFormAvailable(item.available);
    setFormDesc(item.description);
    setFormImage(item.image);
    setIsModalOpen(true);
  };

  const handleDelete = (item) => {
    if (window.confirm(`Are you sure you wish to remove "${item.name}" from the Hogwarts menu?`)) {
      deleteMenuItem(item.id);
    }
  };

  // Local Image Upload Handler with Canvas Resizing
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const resizedBase64 = await resizeImage(file, 480, 480, 0.75);
      setFormImage(resizedBase64);
      addToast('Image uploaded and optimized for local storage.', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to process image file.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      addToast('Dish name is required.', 'warning');
      return;
    }

    const payload = {
      name: formName.trim(),
      category: formCategory,
      price: Number(formPrice),
      isVeg: Boolean(formIsVeg),
      prepTime: formPrepTime.trim(),
      available: Boolean(formAvailable),
      description: formDesc.trim(),
      image: formImage.trim() || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80'
    };

    if (editingItemId) {
      updateMenuItem(editingItemId, payload);
    } else {
      addMenuItem(payload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="page-container menu-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Wizarding Menu Catalog</h1>
          <p className="page-subtitle">Categorized dishes, magical concoctions and kitchen pricing.</p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd} id="btn-add-dish">
          <PlusCircle size={15} /> Add New Dish
        </button>
      </div>

      {/* Filter and Category Strip */}
      <div className="card filter-bar-card">
        <div className="search-input-wrapper" style={{ minWidth: '320px' }}>
          <Search size={15} className="search-icon" />
          <input
            type="text"
            placeholder="Search menu by name or ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control"
          />
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

      {/* Dishes Grid */}
      <div className="menu-cards-grid">
        {filteredItems.length === 0 ? (
          <div className="card empty-full-card">
            <p>No dishes found matching your selection.</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className={`menu-dish-card card ${!item.available ? 'item-out-of-stock' : ''}`}>
              <div className="dish-media-box">
                <img src={item.image} alt={item.name} loading="lazy" />
                <span className={`veg-pill ${item.isVeg ? 'veg' : 'non-veg'}`}>
                  {item.isVeg ? 'Veg' : 'Non-Veg'}
                </span>
                <span className="category-tag-over">{item.category}</span>
              </div>

              <div className="dish-card-body">
                <div className="dish-card-header">
                  <h3 className="dish-name-heading">{item.name}</h3>
                  <span className="dish-price-text">{formatINR(item.price)}</span>
                </div>

                <p className="dish-desc-text">{item.description}</p>

                <div className="dish-meta-info-row">
                  <span className="meta-time">⏱ {item.prepTime}</span>
                  <button
                    className={`availability-toggle-btn ${item.available ? 'avail' : 'unavail'}`}
                    onClick={() => updateMenuItem(item.id, { available: !item.available })}
                    title="Click to toggle availability"
                  >
                    {item.available ? '● In Stock' : '○ Sold Out'}
                  </button>
                </div>

                <div className="dish-card-actions">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleOpenEdit(item)}
                    title="Edit dish"
                  >
                    <Edit size={13} /> Edit
                  </button>
                  <button
                    className="btn btn-outline btn-sm btn-delete-item"
                    onClick={() => handleDelete(item)}
                    title="Delete dish"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Add / Edit Dish */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingItemId ? 'Edit Menu Item' : 'Add New Dish to Menu'}</h3>
              <button className="modal-close-icon" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Dish / Drink Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Cauldron Hot Chocolate"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                </div>

                <div className="form-group-row">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Category *</label>
                    <select
                      className="form-control"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                    >
                      {categories.filter((c) => c !== 'All').map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ width: '140px' }}>
                    <label className="form-label">Price (INR ₹) *</label>
                    <input
                      type="number"
                      required
                      min="10"
                      className="form-control"
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Preparation Time</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 8 mins"
                      value={formPrepTime}
                      onChange={(e) => setFormPrepTime(e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Dietary Type</label>
                    <select
                      className="form-control"
                      value={formIsVeg ? 'veg' : 'non-veg'}
                      onChange={(e) => setFormIsVeg(e.target.value === 'veg')}
                    >
                      <option value="veg">Vegetarian (Veg)</option>
                      <option value="non-veg">Non-Vegetarian</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Availability</label>
                    <select
                      className="form-control"
                      value={formAvailable ? 'true' : 'false'}
                      onChange={(e) => setFormAvailable(e.target.value === 'true')}
                    >
                      <option value="true">Available (In Stock)</option>
                      <option value="false">Unavailable (Sold Out)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description & Magical Notes</label>
                  <textarea
                    className="form-control"
                    placeholder="Rich description of ingredients, aroma, and presentation..."
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                  ></textarea>
                </div>

                {/* Photograph URL or Local File Upload */}
                <div className="form-group">
                  <label className="form-label">Dish Photograph</label>
                  <div className="image-input-choice">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Image URL (e.g. https://...)"
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      style={{ marginBottom: '8px' }}
                    />
                    <div className="file-upload-row">
                      <label className="file-upload-btn btn btn-outline btn-sm">
                        <Upload size={13} /> {isUploading ? 'Compressing...' : 'Upload Local Image'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          style={{ display: 'none' }}
                        />
                      </label>
                      <small className="text-muted">Resized locally to safely fit browser storage.</small>
                    </div>
                  </div>

                  {formImage && (
                    <div className="preview-img-box">
                      <img src={formImage} alt="Dish Preview" />
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" id="btn-save-dish">
                  {editingItemId ? 'Update Dish' : 'Add to Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
