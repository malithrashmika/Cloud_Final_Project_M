"use client";

import React from 'react';
import { BookOpen, ChefHat, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function Stats({
  totalItems,
  availableItems,
  activeBorrowingsCount,
  damagedItems
}) {
  return (
    <section className="stats-grid">
      <div className="stat-card glass-panel">
        <div className="stat-icon" style={{ color: 'var(--accent-primary)', background: 'rgba(255,107,53,0.1)' }}><BookOpen size={24} /></div>
        <div className="stat-details">
          <h3>Total Servings</h3>
          <p>{totalItems}</p>
        </div>
      </div>
      <div className="stat-card glass-panel">
        <div className="stat-icon" style={{ color: 'var(--color-available)', background: 'rgba(16,185,129,0.1)' }}><CheckCircle2 size={24} /></div>
        <div className="stat-details">
          <h3>Fresh Stock</h3>
          <p>{availableItems}</p>
        </div>
      </div>
      <div className="stat-card glass-panel">
        <div className="stat-icon" style={{ color: '#ff9f1c', background: 'rgba(255,159,28,0.1)' }}><ChefHat size={24} /></div>
        <div className="stat-details">
          <h3>Prep Orders</h3>
          <p>{activeBorrowingsCount}</p>
        </div>
      </div>
      <div className="stat-card glass-panel">
        <div className="stat-icon" style={{ color: 'var(--color-damaged)', background: 'rgba(239,68,68,0.1)' }}><AlertTriangle size={24} /></div>
        <div className="stat-details">
          <h3>Out of Stock</h3>
          <p>{damagedItems}</p>
        </div>
      </div>
    </section>
  );
}
