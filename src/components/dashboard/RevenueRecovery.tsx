'use client';

import { DollarSign, RefreshCw, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { formatCurrency, getInitials, timeAgo } from '@/lib/utils';
import type { RevenueRecoveryItem } from '@/types';
import DemoBadge from '@/components/ui/DemoBadge';

const statusConfig = {
  pending:    { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.2)',  label: 'Pending',    icon: Clock },
  recovering: { color: '#6366f1', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.2)',  label: 'Recovering', icon: RefreshCw },
  recovered:  { color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)',  label: 'Recovered',  icon: CheckCircle },
  failed:     { color: '#f43f5e', bg: 'rgba(244,63,94,0.1)',  border: 'rgba(244,63,94,0.2)',   label: 'Failed',     icon: XCircle },
};

export default function RevenueRecovery({ items }: { items: RevenueRecoveryItem[] }) {
  const totalPending = items.filter(i => i.status !== 'failed' && i.status !== 'recovered').reduce((s, i) => s + i.amount, 0);
  const totalRecovered = items.filter(i => i.status === 'recovered').reduce((s, i) => s + i.amount, 0);

  return (
    <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, transparent 60%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={15} color="#10b981" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f0f6ff', fontFamily: 'Space Grotesk, sans-serif', display: 'flex', alignItems: 'center', gap: 8 }}>Revenue Recovery <DemoBadge /></div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Failed payment recovery system</div>
            </div>
          </div>
        </div>

        {/* Summary stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ padding: '12px', borderRadius: 10, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Recoverable</div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 20, fontWeight: 700, color: '#a5b4fc' }}>{formatCurrency(totalPending)}</div>
          </div>
          <div style={{ padding: '12px', borderRadius: 10, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Recovered (30d)</div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 20, fontWeight: 700, color: '#10b981' }}>{formatCurrency(totalRecovered)}</div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div>
        {items.map((item, i) => {
          const cfg = statusConfig[item.status];
          const StatusIcon = cfg.icon;
          return (
            <div key={item.id} style={{ padding: '14px 24px', borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', display: 'flex', alignItems: 'center', gap: 12, transition: 'background 0.2s', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#a5b4fc' }}>
                {getInitials(item.userName)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#f0f6ff' }}>{item.userName}</span>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 5, fontWeight: 600, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <StatusIcon size={10} /> {cfg.label}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#4b5563' }}>
                  {item.plan} · Attempt {item.attempts} · Failed {timeAgo(item.failedAt)}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 700, color: item.status === 'recovered' ? '#10b981' : item.status === 'failed' ? '#f43f5e' : '#f0f6ff' }}>
                  {formatCurrency(item.amount)}
                </div>
                {item.nextRetry && item.status !== 'recovered' && item.status !== 'failed' && (
                  <div style={{ fontSize: 11, color: '#4b5563' }}>Retry: {new Date(item.nextRetry).toLocaleDateString()}</div>
                )}
              </div>
              {(item.status === 'pending' || item.status === 'recovering') && (
                <button style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid rgba(99,102,241,0.3)', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: 'rgba(99,102,241,0.1)', color: '#a5b4fc', flexShrink: 0 }}>
                  Retry Now
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
