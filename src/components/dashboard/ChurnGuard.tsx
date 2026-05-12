'use client';

import { Zap, X, UserMinus } from 'lucide-react';
import { formatCurrency, getInitials, timeAgo } from '@/lib/utils';
import type { ChurnEvent } from '@/types';

export default function ChurnGuard({ events }: { events: ChurnEvent[] }) {
  const recoverableValue = events.filter(e => e.recoverable).reduce((s, e) => s + e.planValue, 0);

  return (
    <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(135deg, rgba(245,158,11,0.06) 0%, transparent 60%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={15} color="#f59e0b" fill="#f59e0b" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f0f6ff', fontFamily: 'Space Grotesk, sans-serif' }}>Churn Guard</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Recent cancellations · Auto-intervention</div>
            </div>
          </div>
          <div style={{ padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#f59e0b', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)' }}>
            {formatCurrency(recoverableValue)}/mo recoverable
          </div>
        </div>
      </div>

      <div>
        {events.map((event, i) => (
          <div key={event.id} style={{ padding: '16px 24px', borderBottom: i < events.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, background: event.recoverable ? 'rgba(245,158,11,0.1)' : 'rgba(244,63,94,0.08)', border: `1px solid ${event.recoverable ? 'rgba(245,158,11,0.2)' : 'rgba(244,63,94,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: event.recoverable ? '#f59e0b' : '#f43f5e' }}>
              {getInitials(event.userName)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#f0f6ff' }}>{event.userName}</span>
                <span style={{ fontSize: 11, color: '#4b5563' }}>cancelled {timeAgo(event.cancelledAt)}</span>
              </div>
              {event.reason && <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>Reason: &quot;{event.reason}&quot;</div>}
              {event.recoverable && event.recoveryAction && (
                <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', fontSize: 12, color: '#a5b4fc', marginBottom: 8 }}>
                  💡 {event.recoveryAction}
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                {event.recoverable ? (
                  <>
                    <button style={{ padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: 'white', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Zap size={11} /> Win Back
                    </button>
                    <button style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: 'transparent', color: '#8b9ab1' }}>
                      Dismiss
                    </button>
                  </>
                ) : (
                  <span style={{ fontSize: 12, color: '#4b5563', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <UserMinus size={12} /> Non-recoverable
                  </span>
                )}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 700, color: '#f0f6ff' }}>{formatCurrency(event.planValue)}</div>
              <div style={{ fontSize: 11, color: '#4b5563' }}>{event.plan}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
