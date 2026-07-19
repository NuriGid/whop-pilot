'use client';

import {
  LayoutDashboard, ShieldAlert, TrendingUp, DollarSign,
  Brain, Settings, Zap, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

// State-based tab identifiers — navigation NEVER touches the URL.
export type TabId = 'overview' | 'retention' | 'churn' | 'recovery' | 'insights' | 'analytics' | 'settings';

const navItems: { icon: typeof LayoutDashboard; label: string; tab: TabId; badge?: number }[] = [
  { icon: LayoutDashboard, label: 'Overview', tab: 'overview' },
  { icon: ShieldAlert,     label: 'Retention Alerts', tab: 'retention', badge: 6 },
  { icon: Zap,             label: 'Churn Guard', tab: 'churn' },
  { icon: DollarSign,      label: 'Revenue Recovery', tab: 'recovery', badge: 5 },
  { icon: Brain,           label: 'AI Insights', tab: 'insights', badge: 4 },
  { icon: TrendingUp,      label: 'Analytics', tab: 'analytics' },
];

interface SidebarProps {
  courseName?: string;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function Sidebar({ courseName = 'My Course', activeTab, onTabChange }: SidebarProps) {
  return (
    <aside style={{
      width: 240,
      minWidth: 240,
      height: '100vh',
      position: 'sticky',
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      background: 'rgba(13,17,23,0.95)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      backdropFilter: 'blur(20px)',
      zIndex: 50,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(99,102,241,0.4)',
          }}>
            <Zap size={16} color="white" fill="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15, color: '#f0f6ff', letterSpacing: '-0.02em' }}>
              Whop Pilot
            </div>
            <div style={{ fontSize: 10, color: '#6366f1', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              CEO Dashboard
            </div>
          </div>
        </div>

        {/* Company badge */}
        <div style={{
          padding: '8px 12px', borderRadius: 8,
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 1 }}>Active Course</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f6ff' }}>{courseName}</div>
          </div>
          <ChevronRight size={14} color="#6b7280" />
        </div>
      </div>

      {/* Nav — buttons, not links. The URL never changes. */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: '#374151', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 8px', marginBottom: 8 }}>
          Navigation
        </div>
        {navItems.map(({ icon: Icon, label, tab, badge }) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={cn('sidebar-item', isActive && 'active')}
              aria-current={isActive ? 'page' : undefined}
              style={{
                marginBottom: 2, position: 'relative', width: '100%',
                background: 'transparent', border: 'none', cursor: 'pointer',
                textAlign: 'left', font: 'inherit',
              }}
            >
              <Icon size={16} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{label}</span>
              {badge && (
                <span style={{
                  fontSize: 10, fontWeight: 700, minWidth: 18, height: 18,
                  borderRadius: 9, background: isActive ? '#6366f1' : 'rgba(244,63,94,0.8)',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 4px',
                }}>
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          type="button"
          onClick={() => onTabChange('settings')}
          className={cn('sidebar-item', activeTab === 'settings' && 'active')}
          aria-current={activeTab === 'settings' ? 'page' : undefined}
          style={{
            width: '100%', background: 'transparent', border: 'none',
            cursor: 'pointer', textAlign: 'left', font: 'inherit',
          }}
        >
          <Settings size={16} />
          <span>Settings</span>
        </button>
        <div style={{
          marginTop: 12, padding: '12px', borderRadius: 10,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.08) 100%)',
          border: '1px solid rgba(99,102,241,0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} className="animate-pulse-glow" />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#10b981' }}>System Live</span>
          </div>
          <div style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.4 }}>
            All monitors active · Last sync 30s ago
          </div>
        </div>
      </div>
    </aside>
  );
}
