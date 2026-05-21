"use client";

import React from 'react';
import { X, ShoppingBag } from 'lucide-react';

export default function BorrowModal({
  showBorrowModal,
  setShowBorrowModal,
  borrowForm,
  setBorrowForm,
  handleBorrowItem
}) {
  if (!showBorrowModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <div className="modal-header">
          <h2>Confirm Your Order</h2>
          <button className="btn-modal-close" onClick={() => setShowBorrowModal(false)}><X size={20} /></button>
        </div>
        
        <form onSubmit={handleBorrowItem}>
          <div style={{ padding: '1rem', background: 'rgba(255, 107, 53, 0.06)', borderRadius: 'var(--border-radius-sm)', border: '1px dashed rgba(255, 107, 53, 0.25)', marginBottom: '1.25rem', textAlign: 'left' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Selected Culinary Offering</span>
            <p style={{ fontWeight: 700, fontSize: '1.25rem', marginTop: '0.25rem', color: 'var(--text-primary)' }}>{borrowForm.itemName}</p>
            {borrowForm.itemPrice && (
              <p style={{ fontWeight: 800, fontSize: '1.4rem', marginTop: '0.5rem', color: '#ff9f1c' }}>
                ${parseFloat(borrowForm.itemPrice).toFixed(2)}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="borrower-name">Customer Username</label>
            <input
              id="borrower-name"
              type="text"
              className="form-input"
              style={{ background: 'rgba(255, 255, 255, 0.03)', color: 'var(--text-muted)' }}
              value={borrowForm.borrowerName}
              readOnly
              disabled
            />
          </div>

          <div className="modal-footer" style={{ marginTop: '1.5rem' }}>
            <button type="button" className="btn-secondary" onClick={() => setShowBorrowModal(false)}>Go Back</button>
            <button type="submit" className="btn-primary" id="btn-borrow-submit">
              <ShoppingBag size={18} /> Confirm Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
