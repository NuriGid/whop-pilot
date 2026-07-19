'use client';

export const runtime = 'edge';
import { useState, useEffect, use } from 'react';
import {
  DollarSign, Users, TrendingDown, RefreshCw, BarChart3, Activity,
  Bell, Mail, Shield, CreditCard, ToggleLeft, ToggleRight,
} from 'lucide-react';

import Header from '@/components/dashboard/Header';
import Sidebar, { type TabId } from '@/components/dashboard/Sidebar';
import StatCard from '@/components/ui/StatCard';
import RetentionAlerts from '@/components/dashboard/RetentionAlerts';
import ChurnGuard from '@/components/dashboard/ChurnGuard';
import RevenueRecovery from '@/components/dashboard/RevenueRecovery';
import AIInsights from '@/components/dashboard/AIInsights';
import RevenueChart from '@/components/dashboard/RevenueChart';

import {
  mockMetrics,
  mockRetentionAlerts,
  mockChurnEvents,
  mockRevenueRecovery,
  mockAIInsights,
  mockRevenueData,
  mockMemberActivity,
} from '@/lib/mock-data';
import type { DashboardMetrics } from '@/types';

/* ─────────────────────────────────────────────────────────────
   SPA ROUTING: the URL never changes after load. Every view
   below renders conditionally from `activeTab` state, so the
   host can never be asked for a path it doesn't know → no 404s.
   ───────────────────────────────────────────────────────────── */

const TAB_META: Record<TabId, { title: string; subtitle: string }> = {
  overview:  { title: 'CEO Dashboard',     subtitle: 'Command center overview' },
  retention: { title: 'Retention Alerts',  subtitle: 'Members at risk of churning' },
  churn:     { title: 'Churn Guard',       subtitle: 'Recent cancellations & win-back actions' },
  recovery:  { title: 'Revenue Recovery',  subtitle: 'Failed payments being recovered' },
  insights:  { title: 'AI Insights',       subtitle: 'Groq-powered strategic analysis' },
  analytics: { title: 'Analytics',         subtitle: 'Revenue & member trends' },
  settings:  { title: 'Settings',          subtitle: 'Workspace preferences' },
};

interface CourseStats {
  totalStudents: number;
  avgCompletion: number;
  atRiskCount: number;
  atRiskPercent: number;
  chapterCount: number;
  lessonCount: number;
}

export default function DashboardPage({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = use(params);

  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [insights, setInsights] = useState(mockAIInsights);
  const [metrics, setMetrics] = useState<DashboardMetrics>(mockMetrics);
  const [storeName, setStoreName] = useState('My Course');
  const [courseStats, setCourseStats] = useState<CourseStats | null>(null);

  const loadMetrics = async () => {
    try {
      const res = await fetch(`/api/metrics?companyId=${companyId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.courseName) {
          setStoreName(data.courseName);
          setCourseStats(data);
          setMetrics(prev => ({
            ...prev,
            totalRevenue: data.totalRevenue ?? prev.totalRevenue,
            activeMembers: data.activeMembers ?? prev.activeMembers,
            mrr: data.mrr ?? prev.mrr,
            churnRate: data.churnRate ?? prev.churnRate,
            recoveredRevenue: data.recoveredRevenue ?? prev.recoveredRevenue,
            ltv: data.ltv ?? prev.ltv,
          }));
        }
      }
    } catch (e) {
      console.error('Failed to load real course data', e);
    }
  };

  useEffect(() => { loadMetrics(); }, [companyId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadMetrics();
    setIsRefreshing(false);
  };

  const handleAIRefresh = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics, companyName: storeName }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.insights) setInsights(data.insights);
      }
    } catch {
      // fallback to mock
    } finally {
      setAiLoading(false);
    }
  };

  const meta = TAB_META[activeTab];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar courseName={storeName} activeTab={activeTab} onTabChange={setActiveTab} />

      <main style={{ flex: 1, minWidth: 0, overflowX: 'hidden' }}>
        <div style={{ minHeight: '100vh', background: 'transparent' }}>
          <Header
            title={meta.title}
            subtitle={`${meta.subtitle} · ${new Date().toLocaleDateString('en-US', { weekday: 'long' })}`}
            companyName={storeName}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />

          <div style={{ padding: '28px 32px', maxWidth: 1400 }}>
            {activeTab === 'overview' && (
              <OverviewView
                metrics={metrics}
                courseStats={courseStats}
                insights={insights}
                aiLoading={aiLoading}
                onAIRefresh={handleAIRefresh}
              />
            )}

            {activeTab === 'retention' && (
              <RetentionAlerts alerts={mockRetentionAlerts} />
            )}

            {activeTab === 'churn' && (
              <ChurnGuard events={mockChurnEvents} />
            )}

            {activeTab === 'recovery' && (
              <RevenueRecovery items={mockRevenueRecovery} />
            )}

            {activeTab === 'insights' && (
              <AIInsights insights={insights} onRefresh={handleAIRefresh} isLoading={aiLoading} />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsView metrics={metrics} />
            )}

            {activeTab === 'settings' && (
              <SettingsView storeName={storeName} companyId={companyId} />
            )}

            {/* ── Footer ── */}
            <div style={{ textAlign: 'center', padding: '24px 0 8px', fontSize: 12, color: '#374151' }}>
              Whop Pilot · Elite CEO Dashboard · Powered by Groq AI · {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ── Overview ─────────────────────────────────────────────── */

function OverviewView({ metrics, courseStats, insights, aiLoading, onAIRefresh }: {
  metrics: DashboardMetrics;
  courseStats: CourseStats | null;
  insights: typeof mockAIInsights;
  aiLoading: boolean;
  onAIRefresh: () => void;
}) {
  return (
    <>
      {/* Course Stats Banner (live data) */}
      {courseStats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
          marginBottom: 20,
          padding: '16px 20px',
          background: 'rgba(6,182,212,0.06)',
          border: '1px solid rgba(6,182,212,0.2)',
          borderRadius: 12,
        }}>
          {[
            { label: '📚 Chapters', value: courseStats.chapterCount },
            { label: '🎬 Lessons', value: courseStats.lessonCount },
            { label: '✅ Avg Completion', value: `${courseStats.avgCompletion}%` },
            { label: '⚠️ At Risk', value: `${courseStats.atRiskCount} students` },
          ].map((item) => (
            <div key={item.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#06b6d4' }}>{item.value}</div>
            </div>
          ))}
        </div>
      )}

      <KpiGrid metrics={metrics} />

      {/* Chart + AI */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 20, marginBottom: 20 }}>
        <RevenueChart revenueData={mockRevenueData} memberData={mockMemberActivity} />
        <AIInsights insights={insights} onRefresh={onAIRefresh} isLoading={aiLoading} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <RetentionAlerts alerts={mockRetentionAlerts} compact />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <ChurnGuard events={mockChurnEvents} />
        <RevenueRecovery items={mockRevenueRecovery} />
      </div>
    </>
  );
}

/* ── KPI grid (shared: overview + analytics) ──────────────── */

function KpiGrid({ metrics }: { metrics: DashboardMetrics }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
      <StatCard
        title="Total Revenue (30d)"
        value={metrics.totalRevenue}
        change={metrics.revenueChange}
        isCurrency
        icon={<DollarSign size={16} color="#6366f1" />}
        iconBg="rgba(99,102,241,0.12)"
        delay={0}
      />
      <StatCard
        title="Active Members"
        value={metrics.activeMembers}
        change={metrics.membersChange}
        icon={<Users size={16} color="#06b6d4" />}
        iconBg="rgba(6,182,212,0.12)"
        delay={60}
      />
      <StatCard
        title="Monthly MRR"
        value={metrics.mrr}
        change={metrics.mrrChange}
        isCurrency
        icon={<BarChart3 size={16} color="#10b981" />}
        iconBg="rgba(16,185,129,0.12)"
        delay={120}
      />
      <StatCard
        title="Churn Rate"
        value={`${metrics.churnRate}%`}
        change={metrics.churnChange}
        icon={<TrendingDown size={16} color="#f43f5e" />}
        iconBg="rgba(244,63,94,0.12)"
        delay={180}
      />
      <StatCard
        title="Recovered Revenue"
        value={metrics.recoveredRevenue}
        change={metrics.recoveredChange}
        isCurrency
        icon={<RefreshCw size={16} color="#f59e0b" />}
        iconBg="rgba(245,158,11,0.12)"
        delay={240}
      />
      <StatCard
        title="Avg. LTV"
        value={metrics.ltv}
        isCurrency
        description="Per active member"
        icon={<Activity size={16} color="#8b5cf6" />}
        iconBg="rgba(139,92,246,0.12)"
        delay={300}
      />
    </div>
  );
}

/* ── Analytics ────────────────────────────────────────────── */

function AnalyticsView({ metrics }: { metrics: DashboardMetrics }) {
  return (
    <>
      <KpiGrid metrics={metrics} />
      <div style={{ marginBottom: 20 }}>
        <RevenueChart revenueData={mockRevenueData} memberData={mockMemberActivity} />
      </div>
    </>
  );
}

/* ── Settings ─────────────────────────────────────────────── */

const SETTING_ROWS = [
  { icon: Bell,       label: 'Retention alert notifications', desc: 'Get notified when a member crosses the risk threshold', on: true },
  { icon: Mail,       label: 'Weekly CEO digest email',       desc: 'Monday-morning summary of revenue, churn and recovery', on: true },
  { icon: Shield,     label: 'Churn Guard auto-actions',      desc: 'Automatically send win-back offers on cancellation', on: false },
  { icon: CreditCard, label: 'Smart payment retries',         desc: 'Retry failed payments on an optimized schedule', on: true },
];

function SettingsView({ storeName, companyId }: { storeName: string; companyId: string }) {
  return (
    <div style={{ maxWidth: 720 }}>
      {/* Workspace card */}
      <div style={{
        padding: '20px 24px', borderRadius: 14, marginBottom: 20,
        background: 'rgba(99,102,241,0.06)',
        border: '1px solid rgba(99,102,241,0.18)',
      }}>
        <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
          Workspace
        </div>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 700, color: '#f0f6ff', marginBottom: 2 }}>
          {storeName}
        </div>
        <div style={{ fontSize: 12, color: '#6b7280' }}>Company ID · {companyId}</div>
      </div>

      {/* Preference toggles (display-only for now) */}
      <div style={{
        borderRadius: 14, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(13,17,23,0.6)',
      }}>
        {SETTING_ROWS.map(({ icon: Icon, label, desc, on }, i) => (
          <div key={label} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '16px 20px',
            borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.05)',
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8, flexShrink: 0,
              background: 'rgba(99,102,241,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={15} color="#6366f1" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f6ff' }}>{label}</div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 1 }}>{desc}</div>
            </div>
            {on
              ? <ToggleRight size={26} color="#10b981" style={{ flexShrink: 0 }} />
              : <ToggleLeft size={26} color="#374151" style={{ flexShrink: 0 }} />}
          </div>
        ))}
      </div>

      <div style={{ fontSize: 12, color: '#4b5563', marginTop: 14, lineHeight: 1.5 }}>
        Preferences are managed by your Whop workspace admin. Changes sync automatically.
      </div>
    </div>
  );
}
