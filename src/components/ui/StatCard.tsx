'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn, formatCurrency, formatNumber, formatPercent } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  prefix?: string;
  suffix?: string;
  icon: React.ReactNode;
  iconBg?: string;
  isCurrency?: boolean;
  description?: string;
  delay?: number;
}

export default function StatCard({
  title, value, change, prefix, suffix,
  icon, iconBg = 'rgba(99,102,241,0.15)',
  isCurrency, description, delay = 0,
}: StatCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change === 0;

  const displayValue = isCurrency
    ? formatCurrency(Number(value))
    : typeof value === 'number'
      ? formatNumber(value)
      : value;

  return (
    <div className="stat-card animate-slide-up" style={{ animationDelay: `${delay}ms` }}>
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{title}</div>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {icon}
        </div>
      </div>

      {/* Value */}
      <div style={{
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: 28, fontWeight: 700,
        color: '#f0f6ff', letterSpacing: '-0.04em',
        lineHeight: 1, marginBottom: 10,
      }}>
        {prefix}{displayValue}{suffix}
      </div>

      {/* Change */}
      {change !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 3,
            padding: '3px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600,
            background: isPositive ? 'rgba(16,185,129,0.1)' : isNegative ? 'rgba(244,63,94,0.1)' : 'rgba(255,255,255,0.05)',
            color: isPositive ? '#10b981' : isNegative ? '#f43f5e' : '#6b7280',
          }}>
            {isPositive ? <TrendingUp size={11} /> : isNegative ? <TrendingDown size={11} /> : <Minus size={11} />}
            {formatPercent(Math.abs(change))}
          </div>
          <span style={{ fontSize: 12, color: '#4b5563' }}>vs last month</span>
        </div>
      )}

      {description && !change && (
        <div style={{ fontSize: 12, color: '#4b5563' }}>{description}</div>
      )}
    </div>
  );
}
