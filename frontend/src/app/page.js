"use client";

import React, { useState, useEffect } from 'react';
import { X, Wifi, WifiOff } from 'lucide-react';
import Auth from '@/components/Auth';
import Navbar from '@/components/Navbar';
import Stats from '@/components/Stats';
import InventoryTab from '@/components/InventoryTab';
import HistoryTab from '@/components/HistoryTab';
import ItemModal from '@/components/ItemModal';
import BorrowModal from '@/components/BorrowModal';

const USER_SESSION_KEY = 'bitespeed_user';
const USER_STORAGE_KEY = 'bitespeed_users';
const INVENTORY_STORAGE_KEY = 'bitespeed_menu';
const HISTORY_STORAGE_KEY = 'bitespeed_orders';

const API_BASE = 'http://localhost:8080';

// Gourmet Seed Data
const SEED_DISHES = [
  {
    id: "dish-wagyu-burger",
    name: "Classic Wagyu Burger",
    price: 14.99,
    category: "Burgers",
    quantity: 25,
    status: "Available",
    description: "Succulent wagyu beef patty with house-made truffle aioli, melted Swiss cheese, and caramelized onions on a toasted brioche bun.",
    imageUrl: ""
  },
  {
    id: "dish-margherita-pizza",
    name: "Wood-Fired Margherita Pizza",
    price: 12.49,
    category: "Pizzas",
    quantity: 18,
    status: "Available",
    description: "Authentic wood-fired crust topped with San Marzano tomato sauce, fresh buffalo mozzarella, fresh basil leaves, and a drizzle of extra virgin olive oil.",
    imageUrl: ""
  },
  {
    id: "dish-lava-cake",
    name: "Decadent Chocolate Lava Cake",
    price: 7.99,
    category: "Desserts",
    quantity: 15,
    status: "Available",
    description: "Decadent warm chocolate cake with a molten chocolate center, served with fresh raspberries and cocoa dusting.",
    imageUrl: ""
  },
  {
    id: "dish-matcha-fusion",
    name: "Matcha Espresso Fusion",
    price: 5.99,
    category: "Beverages",
    quantity: 35,
    status: "Available",
    description: "Organically sourced Japanese matcha green tea layered over fresh cold milk and topped with a double-shot of organic espresso.",
    imageUrl: ""
  },
  {
    id: "dish-hot-honey-pepperoni",
    name: "Spicy Pepperoni & Hot Honey",
    price: 13.99,
    category: "Pizzas",
    quantity: 10,
    status: "Available",
    description: "Premium cured pepperoni, crushed red pepper flakes, fresh mozzarella, and a generous finishing drizzle of sweet hot honey.",
    imageUrl: ""
  }
];

const getStoredUsers = () => {
  const saved = localStorage.getItem(USER_STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
};

const saveStoredUsers = (users) => {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
};

const getStoredInventory = () => {
  const saved = localStorage.getItem(INVENTORY_STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    if (parsed.length > 0) return parsed;
  }
  return SEED_DISHES; // Default fallback to seed
};

const saveStoredInventory = (items) => {
  localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(items));
};

const getStoredHistory = () => {
  const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
};

const saveStoredHistory = (records) => {
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(records));
};

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

const getToday = () => new Date().toLocaleDateString();

export default function Home() {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [authForm, setAuthForm] = useState({ username: '', password: '', email: '', role: 'CUSTOMER' });

  const [activeTab, setActiveTab] = useState('inventory');
  const [inventory, setInventory] = useState([]);
  const [history, setHistory] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [showItemModal, setShowItemModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [itemForm, setItemForm] = useState({ id: '', name: '', price: 9.99, category: 'Burgers', quantity: 15, status: 'Available', description: '', imageUrl: '' });

  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [borrowForm, setBorrowForm] = useState({ itemId: '', itemName: '', borrowerName: '', itemPrice: 0 });

  const [alert, setAlert] = useState(null);
  const [isOnline, setIsOnline] = useState(false);

  // Core API fetcher with automatic JSON parsing and failure triggers
  const apiFetch = async (path, options = {}) => {
    const url = `${API_BASE}${path}`;
    const defaults = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const res = await fetch(url, { ...defaults, ...options });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || `API error: ${res.status}`);
    }
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await res.json();
    }
    return await res.text();
  };

  // Check backend server status and synchronise states
  const syncWithBackend = async () => {
    try {
      // Fast health check on config server or API gateway
      const items = await apiFetch('/api/inventory');
      setIsOnline(true);
      
      let finalItems = items;
      if (items.length === 0) {
        // Seeding database menu items if it's completely empty!
        for (const seed of SEED_DISHES) {
          await apiFetch('/api/inventory', {
            method: 'POST',
            body: JSON.stringify(seed),
          });
        }
        finalItems = await apiFetch('/api/inventory');
      }

      setInventory(finalItems);
      saveStoredInventory(finalItems);

      const logs = await apiFetch('/api/borrowing/history');
      setHistory(logs);
      saveStoredHistory(logs);
    } catch (e) {
      console.log("Backend offline, working in standalone LocalStorage fallback mode.", e);
      setIsOnline(false);
      
      // Standalone load
      const storedInv = getStoredInventory();
      setInventory(storedInv);
      const storedHist = getStoredHistory();
      setHistory(storedHist);
    }
  };

  // Initial mount load
  useEffect(() => {
    const saved = localStorage.getItem(USER_SESSION_KEY);
    if (saved) {
      const sessionUser = JSON.parse(saved);
      setUser(sessionUser);
    }
    syncWithBackend();
    // Re-check sync periodically
    const timer = setInterval(syncWithBackend, 15000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  // Handle Authentication and registration sync
  const handleAuth = async (e) => {
    e.preventDefault();
    if (!authForm.username || !authForm.password) {
      showAlert('error', 'Username and password are required.');
      return;
    }

    const localUsers = getStoredUsers();

    if (isLogin) {
      // 1. Try backend login
      try {
        const loggedUser = await apiFetch('/api/users/login', {
          method: 'POST',
          body: JSON.stringify({
            username: authForm.username,
            password: authForm.password
          })
        });

        // Backend login success!
        const sessionUser = { 
          id: loggedUser.id, 
          username: loggedUser.username, 
          email: loggedUser.email, 
          role: loggedUser.role 
        };
        setUser(sessionUser);
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(sessionUser));
        showAlert('success', `Welcome back, ${sessionUser.username}!`);
        syncWithBackend();
        return;
      } catch (err) {
        console.log("Backend auth failed or unreachable, checking LocalStorage fallback...", err);
      }

      // 2. Local fallback
      const matchedUser = localUsers.find(
        (u) => u.username.toLowerCase() === authForm.username.toLowerCase() && u.password === authForm.password
      );

      if (!matchedUser) {
        showAlert('error', 'Invalid credentials (either server offline or details incorrect).');
        return;
      }

      const sessionUser = { username: matchedUser.username, email: matchedUser.email, role: matchedUser.role };
      setUser(sessionUser);
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(sessionUser));
      
      const storedInv = getStoredInventory();
      setInventory(storedInv);
      const storedHist = getStoredHistory();
      setHistory(storedHist);

      showAlert('success', `Welcome back, ${sessionUser.username}! (Offline Standalone Mode)`);
      return;
    }

    // REGISTRATION FLOW
    // 1. Try backend register
    try {
      const registered = await apiFetch('/api/users/register', {
        method: 'POST',
        body: JSON.stringify({
          username: authForm.username,
          password: authForm.password,
          email: authForm.email || '',
          role: authForm.role || 'CUSTOMER'
        })
      });

      // Save to local too for caching
      const newUser = {
        id: registered.id || generateId(),
        username: authForm.username,
        email: authForm.email || '',
        password: authForm.password,
        role: authForm.role || 'CUSTOMER'
      };
      saveStoredUsers([...localUsers, newUser]);

      showAlert('success', 'Registration successful! You can now sign in.');
      setIsLogin(true);
      setAuthForm({ username: authForm.username, password: '', email: '', role: authForm.role });
      return;
    } catch (err) {
      console.log("Backend registration failed, saving to local cache...", err);
    }

    // 2. Local Fallback register
    const exists = localUsers.some((u) => u.username.toLowerCase() === authForm.username.toLowerCase());
    if (exists) {
      showAlert('error', 'Username already exists. Please choose another.');
      return;
    }

    const newUser = {
      id: generateId(),
      username: authForm.username,
      email: authForm.email || '',
      password: authForm.password,
      role: authForm.role || 'CUSTOMER'
    };
    saveStoredUsers([...localUsers, newUser]);
    showAlert('success', 'Registration successful locally! Sign in to enter standalone mode.');
    setIsLogin(true);
    setAuthForm({ username: authForm.username, password: '', email: '', role: authForm.role });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(USER_SESSION_KEY);
    setInventory([]);
    setHistory([]);
    showAlert('success', 'Signed out successfully.');
  };

  // Helper state persistence
  const saveInventoryState = (items) => {
    setInventory(items);
    saveStoredInventory(items);
  };

  const saveHistoryState = (records) => {
    setHistory(records);
    saveStoredHistory(records);
  };

  // Create or modify gourmet food items
  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!itemForm.name.trim() || itemForm.quantity < 0) {
      showAlert('error', 'Please enter a valid item name and stock quantity.');
      return;
    }

    let quantity = parseInt(itemForm.quantity, 10);
    if (Number.isNaN(quantity) || quantity < 0) {
      showAlert('error', 'Quantity must be a valid number.');
      return;
    }

    let finalStatus = itemForm.status;
    if (quantity === 0 && finalStatus === 'Available') {
      finalStatus = 'Borrowed'; // Out of Stock
    } else if (quantity > 0 && finalStatus === 'Borrowed') {
      finalStatus = 'Available';
    }

    const payload = {
      name: itemForm.name.trim(),
      price: parseFloat(itemForm.price || 9.99),
      category: itemForm.category || 'Burgers',
      quantity,
      status: finalStatus,
      description: itemForm.description ? itemForm.description.trim() : '',
      imageUrl: itemForm.imageUrl ? itemForm.imageUrl.trim() : ''
    };

    if (modalMode === 'add') {
      // Try backend Add
      try {
        await apiFetch('/api/inventory', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        showAlert('success', 'Gourmet dish added to live backend menu!');
        syncWithBackend();
      } catch (err) {
        console.log("Backend offline, saving dish locally...", err);
        const localPayload = { ...payload, id: generateId() };
        saveInventoryState([...inventory, localPayload]);
        showAlert('success', 'Gourmet dish registered locally (Standalone Mode).');
      }
    } else {
      // Try backend Edit
      const itemId = itemForm.id;
      try {
        await apiFetch(`/api/inventory/${itemId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        showAlert('success', 'Dish details updated live on backend!');
        syncWithBackend();
      } catch (err) {
        console.log("Backend offline, updating dish details locally...", err);
        const localPayload = { ...payload, id: itemId };
        saveInventoryState(inventory.map((item) => (item.id === itemId ? localPayload : item)));
        showAlert('success', 'Dish details updated locally.');
      }
    }

    setShowItemModal(false);
  };

  // Remove food items
  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to remove this dish from the menu?')) return;
    
    try {
      await apiFetch(`/api/inventory/${id}`, {
        method: 'DELETE'
      });
      showAlert('success', 'Dish removed from live backend menu.');
      syncWithBackend();
    } catch (err) {
      console.log("Backend offline, removing dish locally...", err);
      saveInventoryState(inventory.filter((item) => item.id !== id));
      showAlert('success', 'Dish removed from local menu.');
    }
  };

  // Trigger order confirmation modal
  const handleOpenBorrowModal = (item) => {
    setBorrowForm({
      itemId: item.id,
      itemName: item.name,
      itemPrice: item.price || 0,
      borrowerName: user ? user.username : 'Customer'
    });
    setShowBorrowModal(true);
  };

  // Confirm order and save transactions
  const handleBorrowItem = async (e) => {
    e.preventDefault();
    const selectedItem = inventory.find((item) => item.id === borrowForm.itemId);
    if (!selectedItem) {
      showAlert('error', 'Selected dish was not found.');
      return;
    }

    if (selectedItem.quantity <= 0) {
      showAlert('error', 'This dish is currently sold out!');
      return;
    }

    // 1. Try Backend Order
    try {
      await apiFetch('/api/borrowing/borrow', {
        method: 'POST',
        body: JSON.stringify({
          itemId: selectedItem.id,
          borrowerName: borrowForm.borrowerName.trim()
        })
      });

      showAlert('success', 'Gourmet order confirmed! The kitchen is preparing your dish.');
      setShowBorrowModal(false);
      syncWithBackend();
      return;
    } catch (err) {
      console.log("Backend offline, ordering locally...", err);
    }

    // 2. Local Fallback Order
    const updatedInventory = inventory.map((item) => {
      if (item.id !== selectedItem.id) return item;
      const newQuantity = Math.max(0, item.quantity - 1);
      return {
        ...item,
        quantity: newQuantity,
        status: newQuantity === 0 ? 'Borrowed' : item.status
      };
    });

    const newOrderEntry = {
      id: generateId(),
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      borrowerName: borrowForm.borrowerName.trim(),
      borrowDate: getToday(),
      returnDate: '',
      status: 'Active'
    };

    saveInventoryState(updatedInventory);
    saveHistoryState([newOrderEntry, ...history]);
    setShowBorrowModal(false);
    showAlert('success', 'Order confirmed locally! (Offline Mode)');
  };

  // Cancel order (refund stock)
  const handleReturnItem = async (order) => {
    // 1. Try Backend Return (cancellation)
    try {
      await apiFetch(`/api/borrowing/return/${order.id}`, {
        method: 'POST'
      });
      showAlert('success', 'Order successfully cancelled. Refund processed.');
      syncWithBackend();
      return;
    } catch (err) {
      console.log("Backend offline, cancelling order locally...", err);
    }

    // 2. Local Fallback Cancel
    const updatedHistory = history.map((record) =>
      record.id === order.id
        ? { ...record, status: 'Returned', returnDate: getToday() }
        : record
    );

    const updatedInventory = inventory.map((item) => {
      if (item.id !== order.itemId) return item;
      const newQuantity = item.quantity + 1;
      return {
        ...item,
        quantity: newQuantity,
        status: newQuantity > 0 ? 'Available' : item.status
      };
    });

    saveHistoryState(updatedHistory);
    saveInventoryState(updatedInventory);
    showAlert('success', 'Order cancelled locally. Servings returned to kitchen stock.');
  };

  // Summary Metrics calculations
  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const availableItems = inventory
    .filter((item) => item.status === 'Available')
    .reduce((sum, item) => sum + item.quantity, 0);
  const activeBorrowingsCount = history.filter((h) => h.status === 'Active').length;
  const damagedItems = inventory.filter(
    (item) => item.status === 'Borrowed' || item.status === 'Damaged' || item.quantity <= 0
  ).length;

  const filteredInventory = inventory.filter((item) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = item.name.toLowerCase().includes(query) || 
                          (item.category || '').toLowerCase().includes(query) ||
                          String(item.id).toLowerCase().includes(query);
    const matchesStatus = filterStatus === 'all' || item.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  if (!user) {
    return (
      <Auth
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        authForm={authForm}
        setAuthForm={setAuthForm}
        handleAuth={handleAuth}
        alert={alert}
      />
    );
  }

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} user={user} handleLogout={handleLogout} />

      <main className="dashboard-main">
        {/* Live System Online Status Banner */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem', width: '100%' }}>
          <div className="user-badge" style={{ 
            borderColor: isOnline ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)', 
            background: isOnline ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
            color: isOnline ? '#34d399' : '#f87171',
            gap: '0.4rem',
            boxShadow: 'var(--glass-shadow)'
          }}>
            {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
            <span>{isOnline ? 'Live Backend Connected' : 'Offline Standalone Mode'}</span>
          </div>
        </div>

        {alert && (
          <div className={`alert-banner ${alert.type}`} id="status-alert">
            <span>{alert.message}</span>
            <button className="alert-close" onClick={() => setAlert(null)}>
              <X size={18} />
            </button>
          </div>
        )}

        <Stats
          totalItems={totalItems}
          availableItems={availableItems}
          activeBorrowingsCount={activeBorrowingsCount}
          damagedItems={damagedItems}
        />

        {activeTab === 'inventory' ? (
          <InventoryTab
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filteredInventory={filteredInventory}
            handleOpenBorrowModal={handleOpenBorrowModal}
            setModalMode={setModalMode}
            setItemForm={setItemForm}
            setShowItemModal={setShowItemModal}
            handleDeleteItem={handleDeleteItem}
            currentUser={user}
          />
        ) : (
          <HistoryTab history={history} handleReturnItem={handleReturnItem} currentUser={user} />
        )}
      </main>

      <ItemModal
        showItemModal={showItemModal}
        setShowItemModal={setShowItemModal}
        modalMode={modalMode}
        itemForm={itemForm}
        setItemForm={setItemForm}
        handleSaveItem={handleSaveItem}
      />

      <BorrowModal
        showBorrowModal={showBorrowModal}
        setShowBorrowModal={setShowBorrowModal}
        borrowForm={borrowForm}
        setBorrowForm={setBorrowForm}
        handleBorrowItem={handleBorrowItem}
      />
    </div>
  );
}
