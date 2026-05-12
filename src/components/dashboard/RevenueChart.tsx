'use client';

import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useState } from 'react';
import type { RevenueDataPoint, MemberActivity } from '@/types';

interface TooltipPayloadItem {
  dataKey: string;
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#1a2332', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', fontSize: 12 }}>
      <div style={{ color: '#6b7280', marginBottom: 6, fontWeight: 600 }}>{label}</div>
      {payload.map((p: TooltipPayloadItem) => (
        <div key={p.dataKey} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
          <span style={{ color: '#8b9ab1' }}>{p.name}:</span>
          <span style={{ color: '#f0f6ff', fontWeight: 600 }}>${p.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export default function RevenueChart({ revenueData, memberData }: { revenueData: RevenueDataPoint[]; memberData: MemberActivity[] }) {
  const [tab, setTab] = useState<'revenue' | 'members'>('revenue');

  return (
    <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#f0f6ff', fontFamily: 'Space Grotesk, sans-serif' }}>Performance Analytics</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>30-day overview</div>
        </div>
        <div style={{ display: 'flex', gap: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: 3 }}>
          {(['revenue', 'members'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`tab-btn ${tab === t ? 'active' : ''}`}>
              {t === 'revenue' ? 'Revenue' : 'Members'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px 16px 16px' }}>
        {tab === 'revenue' ? (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="recGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#4b5563', fontSize: 11 }} axisLine={false} tickLine={false} interval={4} />
              <YAxis tick={{ fill: '#4b5563', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} width={45} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revGrad)" dot={false} />
              <Area type="monotone" dataKey="recovered" name="Recovered" stroke="#10b981" strokeWidth={2} fill="url(#recGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={memberData.slice(-14)} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#4b5563', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4b5563', fontSize: 11 }} axisLine={false} tickLine={false} width={35} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="newMembers" name="New" fill="#6366f1" radius={[3, 3, 0, 0]} />
              <Bar dataKey="churned" name="Churned" fill="#f43f5e" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
