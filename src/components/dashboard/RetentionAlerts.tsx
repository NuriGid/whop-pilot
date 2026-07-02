'use client';

import { ShieldAlert, Clock, Send, ChevronRight } from 'lucide-react';
import { formatCurrency, getInitials } from '@/lib/utils';
import type { RetentionAlert } from '@/types';
import DemoBadge from '@/components/ui/DemoBadge';

const riskConfig = {
  critical: { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.25)', label: 'CRITICAL' },
  high:     { color: '#fb923c', bg: 'rgba(251,146,60,0.1)',  border: 'rgba(251,146,60,0.25)',  label: 'HIGH RISK' },
  medium:   { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)',  label: 'MEDIUM' },
};

export default function RetentionAlerts({ alerts, compact = false }: { alerts: RetentionAlert[]; compact?: boolean }) {
  const criticalCount = alerts.filter(a => a.riskLevel === 'critical').length;
  const totalAtRisk = alerts.reduce((s, a) => s + a.planValue, 0);

  return (
    <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(135deg, rgba(248,113,113,0.06) 0%, transparent 60%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldAlert size={15} color="#f87171" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f0f6ff', fontFamily: 'Space Grotesk, sans-serif', display: 'flex', alignItems: 'center', gap: 8 }}>Retention Alerts <DemoBadge /></div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Real-time churn risk detection</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {criticalCount > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 8, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f87171' }} className="animate-pulse-glow" />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#f87171' }}>{criticalCount} Critical</span>
              </div>
            )}
            <div style={{ padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#f43f5e', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.15)' }}>
              {formatCurrency(totalAtRisk)}/mo at risk
            </div>
          </div>
        </div>
      </div>

      <div>
        {alerts.slice(0, compact ? 4 : 999).map((alert, i) => {
          const cfg = riskConfig[alert.riskLevel];
          return (
            <div key={alert.id} style={{ padding: '16px 24px', borderBottom: i < alerts.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, background: `${cfg.color}22`, border: `1px solid ${cfg.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: cfg.color }}>
                {getInitials(alert.userName)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#f0f6ff' }}>{alert.userName}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, letterSpacing: '0.05em', background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>{cfg.label}</span>
                </div>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>{alert.reason}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#4b5563' }}>
                  <Clock size={10} /> {alert.daysInactive}d inactive · {alert.plan}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0, marginRight: 8 }}>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 700, color: cfg.color, lineHeight: 1 }}>{alert.riskScore}</div>
                <div style={{ fontSize: 10, color: '#4b5563', marginBottom: 4 }}>risk score</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f6ff' }}>{formatCurrency(alert.planValue)}/mo</div>
              </div>
              <button style={{ padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: 'white', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                <Send size={11} /> Rescue
              </button>
            </div>
          );
        })}
      </div>

      {compact && alerts.length > 4 && (
        <div style={{ padding: '14px 24px', borderTop: '1px solid rgba(255,255,255,0.04)', textAlign: 'center' }}>
          <button style={{ fontSize: 13, fontWeight: 600, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            View all {alerts.length} alerts <ChevronRight size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
