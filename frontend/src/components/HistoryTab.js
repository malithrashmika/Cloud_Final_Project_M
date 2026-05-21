"use client";

import React from 'react';
import { History, Soup } from 'lucide-react';

export default function HistoryTab({
  history,
  handleReturnItem,
  currentUser // we will pass this from page.js so we can filter or customize views!
}) {
  // Let's filter history if the user is a CUSTOMER to only show their own orders!
  // If they are an ADMIN, show all orders! This is a fantastic UX touch!
  const filteredHistory = history.filter(record => {
    if (!currentUser) return true;
    if (currentUser.role === 'ADMIN') return true;
    return record.borrowerName.toLowerCase() === currentUser.username.toLowerCase();
  });

  return (
    <section className="workspace-layout">
      {filteredHistory.length === 0 ? (
        <div className="empty-state glass-panel">
          <Soup size={48} />
          <h3>No Orders Recorded</h3>
          <p>Go to the Gourmet Menu to place a delicious order!</p>
        </div>
      ) : (
        <div className="history-timeline">
          {filteredHistory.map(record => (
            <div key={record.id} className="history-card glass-panel">
              <div className="history-info">
                <span className="history-title" style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                  {record.itemName}
                </span>
                <div className="history-meta" style={{ marginTop: '0.5rem' }}>
                  <span><strong>Customer:</strong> {record.borrowerName}</span>
                  <span><strong>Ordered on:</strong> {record.borrowDate}</span>
                  {record.returnDate && (
                    <span><strong>Delivered/Cancelled:</strong> {record.returnDate}</span>
                  )}
                </div>
              </div>
              <div className="history-status">
                <span className={`badge-status ${record.status === 'Active' ? 'borrowed' : 'available'}`} style={{ padding: '0.35rem 0.8rem', borderRadius: 'var(--border-radius-sm)' }}>
                  {record.status === 'Active' ? '🍳 Preparing' : '✅ Delivered'}
                </span>
                {record.status === 'Active' && (
                  <button 
                    className="btn-return"
                    style={{ marginTop: '0.5rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5' }}
                    onClick={() => handleReturnItem(record)}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
