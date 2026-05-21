"use client";

import React from 'react';
import { X } from 'lucide-react';

export default function ItemModal({
  showItemModal,
  setShowItemModal,
  modalMode,
  itemForm,
  setItemForm,
  handleSaveItem
}) {
  if (!showItemModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <div className="modal-header">
          <h2>{modalMode === 'add' ? 'Register New Gourmet Dish' : 'Edit Dish Configuration'}</h2>
          <button className="btn-modal-close" onClick={() => setShowItemModal(false)}><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSaveItem}>
          <div className="form-group">
            <label htmlFor="item-name">Dish Name</label>
            <input
              id="item-name"
              type="text"
              className="form-input"
              placeholder="e.g. Classic Wagyu Burger"
              value={itemForm.name || ''}
              onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="item-price">Price ($)</label>
              <input
                id="item-price"
                type="number"
                step="0.01"
                min="0"
                className="form-input"
                placeholder="e.g. 12.99"
                value={itemForm.price || ''}
                onChange={(e) => setItemForm({ ...itemForm, price: parseFloat(e.target.value) })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="item-category">Category</label>
              <select
                id="item-category"
                className="filter-select"
                style={{ width: '100%' }}
                value={itemForm.category || 'Burgers'}
                onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
              >
                <option value="Burgers">Burgers</option>
                <option value="Pizzas">Pizzas</option>
                <option value="Desserts">Desserts</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="item-quantity">Daily Stock (Servings)</label>
              <input
                id="item-quantity"
                type="number"
                min="0"
                className="form-input"
                value={itemForm.quantity !== undefined ? itemForm.quantity : 10}
                onChange={(e) => setItemForm({ ...itemForm, quantity: parseInt(e.target.value, 10) })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="item-status">Availability Status</label>
              <select
                id="item-status"
                className="filter-select"
                style={{ width: '100%' }}
                value={itemForm.status || 'Available'}
                onChange={(e) => setItemForm({ ...itemForm, status: e.target.value })}
              >
                <option value="Available">Available (Active in Menu)</option>
                <option value="Borrowed">Out of Stock</option>
                <option value="Damaged">Unavailable / Seasonal</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="item-description">Dish Description</label>
            <textarea
              id="item-description"
              className="form-input"
              rows="3"
              style={{ resize: 'none', height: 'auto' }}
              placeholder="Describe the mouth-watering ingredients..."
              value={itemForm.description || ''}
              onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="item-image">Image URL (Optional)</label>
            <input
              id="item-image"
              type="text"
              className="form-input"
              placeholder="e.g. https://images.unsplash.com/... or leave blank"
              value={itemForm.imageUrl || ''}
              onChange={(e) => setItemForm({ ...itemForm, imageUrl: e.target.value })}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={() => setShowItemModal(false)}>Cancel</button>
            <button type="submit" className="btn-primary" id="btn-save-item-submit">Save Dish</button>
          </div>
        </form>
      </div>
    </div>
  );
}
