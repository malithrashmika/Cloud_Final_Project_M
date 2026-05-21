"use client";

import React from 'react';
import { UtensilsCrossed, ShoppingBag, History, User as UserIcon, LogOut } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  user,
  handleLogout
}) {
  return (
    <header className="navbar glass-panel">
      <a href="/" className="nav-brand" id="logo-main">
        <UtensilsCrossed size={28} />
        <span>BiteSpeed</span>
      </a>
      
      <div className="nav-links">
        <button 
          className={`nav-link ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
          id="tab-inventory"
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={18} /> Gourmet Menu
          </span>
        </button>
        <button 
          className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
          id="tab-history"
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <History size={18} /> Order History
          </span>
        </button>
      </div>

      <div className="nav-links">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <div className="user-badge" id="user-display">
            <UserIcon size={14} />
            <span>{user.username}</span>
            <span style={{ opacity: 0.5, fontSize: '0.75rem' }}>({user.role})</span>
          </div>
        </div>
        <button className="btn-logout" onClick={handleLogout} id="btn-logout">
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
}
