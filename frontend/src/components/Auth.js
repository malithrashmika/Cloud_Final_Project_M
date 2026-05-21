"use client";

import React from 'react';
import { UtensilsCrossed } from 'lucide-react';

export default function Auth({
  isLogin,
  setIsLogin,
  authForm,
  setAuthForm,
  handleAuth,
  alert
}) {
  return (
    <div className="auth-wrapper">
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>
            <UtensilsCrossed size={32} />
          </div>
          <h1>BiteSpeed</h1>
          <p>{isLogin ? 'Sign in to order gourmet meals' : 'Create your diner or manager profile'}</p>
        </div>

        {alert && (
          <div className={`alert-banner ${alert.type}`}>
            <span>{alert.message}</span>
          </div>
        )}

        <form onSubmit={handleAuth}>
          <div className="form-group">
            <label htmlFor="auth-username">Username</label>
            <input
              id="auth-username"
              type="text"
              className="form-input"
              placeholder="Enter username"
              value={authForm.username}
              onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="auth-email">Email Address</label>
              <input
                id="auth-email"
                type="email"
                className="form-input"
                placeholder="Enter email"
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              className="form-input"
              placeholder="Enter password"
              value={authForm.password}
              onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Select Profile Type</label>
              <div className="role-select-btn-group">
                <button
                  type="button"
                  className={`role-select-btn ${authForm.role === 'CUSTOMER' ? 'active' : ''}`}
                  onClick={() => setAuthForm({ ...authForm, role: 'CUSTOMER' })}
                >
                  Gourmet Diner
                </button>
                <button
                  type="button"
                  className={`role-select-btn ${authForm.role === 'ADMIN' ? 'active' : ''}`}
                  onClick={() => setAuthForm({ ...authForm, role: 'ADMIN' })}
                >
                  Kitchen Manager
                </button>
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary" id="btn-auth-submit" style={{ marginTop: '0.75rem' }}>
            {isLogin ? 'Sign In' : 'Register Account'}
          </button>
        </form>

        <div className="auth-toggle">
          {isLogin ? "New to BiteSpeed?" : 'Already registered?'}
          <button 
            type="button" 
            className="auth-toggle-link"
            onClick={() => {
              setIsLogin(!isLogin);
              if (isLogin) {
                setAuthForm({ ...authForm, role: 'CUSTOMER' });
              }
            }}
          >
            {isLogin ? 'Sign up here' : 'Sign in here'}
          </button>
        </div>
      </div>
    </div>
  );
}
