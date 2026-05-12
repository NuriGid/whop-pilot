'use client';

import { Bell, Search, RefreshCw, Calendar } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  companyName?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function Header({ title, subtitle, companyName = 'My Whop', onRefresh, isRefreshing }: HeaderProps) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <header style={{
      padding: '20px 32px',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'rgba(13,17,23,0.8)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      {/* Left */}
      <div>
        <h1 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 22,
          fontWeight: 700,
          color: '#f0f6ff',
          letterSpacing: '-0.03em',
          lineHeight: 1.2,
          margin: 0,
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0' }}>{subtitle}</p>
        )}
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Date */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', borderRadius: 8,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <Calendar size={13} color="#6b7280" />
          <span style={{ fontSize: 12, color: '#6b7280' }}>{dateStr}</span>
        </div>

        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '7px 14px', borderRadius: 8,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}>
          <Search size={14} color="#6b7280" />
          <span style={{ fontSize: 13, color: '#4b5563' }}>Search...</span>
          <span style={{
            fontSize: 10, color: '#374151',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 4, padding: '1px 5px',
          }}>⌘K</span>
        </div>

        {/* Refresh */}
        {onRefresh && (
          <button onClick={onRefresh} style={{
            width: 36, height: 36, borderRadius: 8, cursor: 'pointer',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}>
            <RefreshCw size={14} color="#6b7280"
              style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
          </button>
        )}

        {/* Notifications */}
        <button style={{
          width: 36, height: 36, borderRadius: 8, cursor: 'pointer',
          background: 'rgba(244,63,94,0.1)',
          border: '1px solid rgba(244,63,94,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          <Bell size={14} color="#f43f5e" />
          <span style={{
            position: 'absolute', top: -3, right: -3,
            width: 14, height: 14, borderRadius: '50%',
            background: '#f43f5e', color: 'white',
            fontSize: 9, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid #030712',
          }}>6</span>
        </button>

        {/* Avatar */}
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: 'white',
          cursor: 'pointer',
          boxShadow: '0 0 12px rgba(99,102,241,0.4)',
        }}>
          {companyName.slice(0, 2).toUpperCase()}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </header>
  );
}
