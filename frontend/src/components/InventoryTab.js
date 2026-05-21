import React, { useState } from 'react';
import { Search, Plus, ShoppingBag, Edit3, Trash2, Soup, ShieldAlert, Award } from 'lucide-react';

const CATEGORY_ICONS = {
  Burgers: '🍔',
  Pizzas: '🍕',
  Desserts: '🍰',
  Beverages: '🥤'
};

export default function InventoryTab({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  filteredInventory,
  handleOpenBorrowModal,
  setModalMode,
  setItemForm,
  setShowItemModal,
  handleDeleteItem,
  currentUser // Passed from page.js to differentiate role experience
}) {
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('all');

  const isAdmin = currentUser?.role === 'ADMIN';

  // Categories list for Diner visual filters
  const categories = ['all', 'Burgers', 'Pizzas', 'Desserts', 'Beverages'];

  // Filter inventory by both search query, availability status, AND category tab
  const fullyFilteredInventory = filteredInventory.filter(item => {
    if (selectedCategoryTab === 'all') return true;
    return (item.category || 'Burgers').toLowerCase() === selectedCategoryTab.toLowerCase();
  });

  return (
    <section className="workspace-layout">
      {/* Header controls panel */}
      <div className="controls-panel glass-panel">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            className="search-input"
            placeholder={isAdmin ? "Search dishes by name or ID..." : "Search delicious eats..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="input-search"
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {isAdmin ? (
            <>
              <select
                className="filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                id="select-filter"
              >
                <option value="all">All Statuses</option>
                <option value="Available">Available</option>
                <option value="Borrowed">Out of Stock</option>
                <option value="Damaged">Unavailable / Seasonal</option>
              </select>

              <button 
                className="btn-action-add"
                onClick={() => {
                  setModalMode('add');
                  setItemForm({ id: '', name: '', price: 9.99, category: 'Burgers', quantity: 15, status: 'Available', description: '', imageUrl: '' });
                  setShowItemModal(true);
                }}
                id="btn-add-item"
              >
                <Plus size={18} />
                <span>Add Dish</span>
              </button>
            </>
          ) : (
            <div className="user-badge" style={{ borderColor: 'rgba(255, 160, 28, 0.4)', background: 'rgba(255, 159, 28, 0.1)', color: '#ffc87a' }}>
              <Award size={14} />
              <span>Gourmet Diner View</span>
            </div>
          )}
        </div>
      </div>

      {/* Diner Category Navigation Tabs */}
      {!isAdmin && (
        <div className="food-category-nav">
          {categories.map(cat => (
            <button
              key={cat}
              className={`food-category-btn ${selectedCategoryTab === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategoryTab(cat)}
            >
              <span>{CATEGORY_ICONS[cat] || '🍽️'}</span>
              <span style={{ textTransform: 'capitalize' }}>{cat === 'all' ? 'All Dishes' : cat}</span>
            </button>
          ))}
        </div>
      )}

      {/* Empty State */}
      {fullyFilteredInventory.length === 0 ? (
        <div className="empty-state glass-panel">
          <Soup size={48} />
          <h3>No Gourmet Dishes Found</h3>
          <p>We couldn't find any dishes matching your parameters. Please check back later!</p>
        </div>
      ) : isAdmin ? (
        /* ADMIN VIEW: Detailed Inventory Table List */
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Dish ID</th>
                <th>Dish Details</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock / Servings</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fullyFilteredInventory.map(item => (
                <tr key={item.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.85rem' }}>{item.id.substring(0, 8)}...</td>
                  <td style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{item.name}</div>
                    {item.description && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.description}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className="badge-status" style={{ background: 'rgba(255,107,53,0.1)', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 700 }}>
                      {item.category || 'Burgers'}
                    </span>
                  </td>
                  <td style={{ fontWeight: 800, color: '#ff9f1c' }}>
                    ${parseFloat(item.price || 0).toFixed(2)}
                  </td>
                  <td style={{ fontWeight: 600 }}>{item.quantity} servings</td>
                  <td>
                    <span className={`badge-status ${item.status === 'Available' ? 'available' : item.status === 'Borrowed' ? 'borrowed' : 'damaged'}`}>
                      {item.status === 'Available' ? 'Available' : item.status === 'Borrowed' ? 'Out of Stock' : 'Unavailable'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-table-action edit"
                        onClick={() => {
                          setModalMode('edit');
                          setItemForm(item);
                          setShowItemModal(true);
                        }}
                        title="Edit Dish Properties"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        className="btn-table-action delete"
                        onClick={() => handleDeleteItem(item.id)}
                        title="Remove Dish"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* CUSTOMER VIEW: Premium Gourmet Menu Card Grid */
        <div className="food-grid">
          {fullyFilteredInventory.map(item => {
            const isOutOfStock = item.quantity <= 0 || item.status === 'Borrowed' || item.status === 'Damaged';
            return (
              <div key={item.id} className="food-card glass-panel" style={{ border: isOutOfStock ? '1px solid rgba(255, 255, 255, 0.05)' : '' }}>
                {/* Visual Image Area */}
                <div className="food-card-image-wrapper">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isOutOfStock ? 0.4 : 0.85 }} 
                    />
                  ) : (
                    <div className="food-card-image-fallback" style={{ opacity: isOutOfStock ? 0.35 : 0.85 }}>
                      {CATEGORY_ICONS[item.category || 'Burgers'] || '🍛'}
                    </div>
                  )}

                  {/* Availability Badge */}
                  <div className="food-card-badge">
                    <span className={`badge-status ${isOutOfStock ? 'damaged' : 'available'}`} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.3)', borderRadius: 'var(--border-radius-sm)' }}>
                      {isOutOfStock ? 'Sold Out' : `${item.quantity} Left`}
                    </span>
                  </div>
                </div>

                {/* Card Content Details */}
                <div className="food-card-body">
                  <span className="food-card-category">{item.category || 'Burgers'}</span>
                  <h3 className="food-card-title">{item.name}</h3>
                  <p className="food-card-desc">
                    {item.description || 'Delicately prepared by our seasoned chefs using fresh, high-quality local ingredients.'}
                  </p>

                  <div className="food-card-footer">
                    <span className="food-card-price">${parseFloat(item.price || 0).toFixed(2)}</span>
                    <button
                      className="btn-food-order"
                      disabled={isOutOfStock}
                      onClick={() => handleOpenBorrowModal(item)}
                    >
                      <ShoppingBag size={15} />
                      <span>{isOutOfStock ? 'Sold Out' : 'Order Now'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
