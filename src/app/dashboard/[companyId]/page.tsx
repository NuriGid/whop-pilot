'use client';

export const runtime = 'edge';
import { useState, useEffect, use } from 'react';
import { DollarSign, Users, TrendingDown, RefreshCw, Zap, Brain, BarChart3, Activity } from 'lucide-react';

import Header from '@/components/dashboard/Header';
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

export default function DashboardPage({ params }: { params: Promise<{ companyId: string }> }) {
  // Next 15: client component'te params Promise'ını React.use() ile aç
  const { companyId } = use(params);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [insights, setInsights] = useState(mockAIInsights);
  const [metrics, setMetrics] = useState(mockMetrics);
  const [storeName, setStoreName] = useState("My Course");
  const [courseStats, setCourseStats] = useState<{
    totalStudents: number;
    avgCompletion: number;
    atRiskCount: number;
    atRiskPercent: number;
    chapterCount: number;
    lessonCount: number;
  } | null>(null);

  // Mount olduğunda gerçek Whop Course verisini çek
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        // URL'den gelen companyId ile Whop Course verisini çek
        const res = await fetch(`/api/metrics?companyId=${companyId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.courseName) {
            setStoreName(data.courseName);
            setCourseStats(data);
            // Gerçek verileri mock üzerine yaz
            setMetrics(prev => ({
              ...prev,
              activeMembers: data.activeMembers || prev.activeMembers,
              totalRevenue: data.totalRevenueStr || prev.totalRevenue,
              churnRate: data.atRiskPercent || prev.churnRate,
            }));
          }
        }
      } catch (e) {
        console.error("Failed to load real course data", e);
      }
    };
    fetchRealData();
  }, [companyId]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/metrics?companyId=${companyId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.courseName) {
          setStoreName(data.courseName);
          setCourseStats(data);
          setMetrics(prev => ({
            ...prev,
            activeMembers: data.activeMembers || prev.activeMembers,
            totalRevenue: data.totalRevenueStr || prev.totalRevenue,
            churnRate: data.atRiskPercent || prev.churnRate,
          }));
        }
      }
    } catch {}
    setIsRefreshing(false);
  };

  const handleAIRefresh = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics: mockMetrics, companyName: 'My Whop Store' }),
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

  return (
    <div style={{ minHeight: '100vh', background: 'transparent' }}>
      <Header
        title="CEO Dashboard"
        subtitle={`Welcome back · ${new Date().toLocaleDateString('en-US', { weekday: 'long' })} overview`}
        companyName={storeName}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      <div style={{ padding: '28px 32px', maxWidth: 1400 }}>

        {/* ── Course Stats Banner (gerçek veri) ── */}
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

        {/* ── KPI Stats ── */}
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

        {/* ── Chart + AI ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 20, marginBottom: 20 }}>
          <RevenueChart revenueData={mockRevenueData} memberData={mockMemberActivity} />
          <AIInsights insights={insights} onRefresh={handleAIRefresh} isLoading={aiLoading} />
        </div>

        {/* ── Retention Alerts ── */}
        <div style={{ marginBottom: 20 }}>
          <RetentionAlerts alerts={mockRetentionAlerts} compact />
        </div>

        {/* ── Churn Guard + Revenue Recovery ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          <ChurnGuard events={mockChurnEvents} />
          <RevenueRecovery items={mockRevenueRecovery} />
        </div>

        {/* ── Footer ── */}
        <div style={{ textAlign: 'center', padding: '24px 0 8px', fontSize: 12, color: '#374151' }}>
          Whop Pilot · Elite CEO Dashboard · Powered by Groq AI · {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
