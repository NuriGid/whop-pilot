'use client';

import { useState } from 'react';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, BarChart2, RefreshCw, Sparkles } from 'lucide-react';
import type { AIInsight } from '@/types';

const typeConfig = {
  warning:     { icon: AlertTriangle, color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)', label: 'Warning' },
  opportunity: { icon: TrendingUp,    color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.2)',  label: 'Opportunity' },
  action:      { icon: Lightbulb,     color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', label: 'Action' },
  trend:       { icon: BarChart2,     color: '#6366f1', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.2)', label: 'Trend' },
};

const impactColors = { high: '#f43f5e', medium: '#f59e0b', low: '#10b981' };

export default function AIInsights({ insights, onRefresh, isLoading }: { insights: AIInsight[]; onRefresh?: () => void; isLoading?: boolean }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, transparent 60%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, rgba(99,102,241,0.3) 0%, rgba(139,92,246,0.2) 100%)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain size={15} color="#a5b4fc" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f0f6ff', fontFamily: 'Space Grotesk, sans-serif', display: 'flex', alignItems: 'center', gap: 8 }}>
                AI CEO Insights
                <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', fontWeight: 600, letterSpacing: '0.05em' }}>GROQ · LLAMA 3</span>
              </div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Daily strategic recommendations powered by AI</div>
            </div>
          </div>
          {onRefresh && (
            <button onClick={onRefresh} style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(99,102,241,0.3)', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: 'rgba(99,102,241,0.1)', color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: 6 }}>
              <RefreshCw size={13} style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
              {isLoading ? 'Generating...' : 'Regenerate'}
            </button>
          )}
        </div>
      </div>

      {/* Insights */}
      <div style={{ padding: '16px' }}>
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Sparkles size={24} color="#6366f1" />
            </div>
            <div style={{ fontSize: 14, color: '#6b7280' }}>AI is analyzing your business data...</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {insights.map((insight) => {
              const cfg = typeConfig[insight.type];
              const TypeIcon = cfg.icon;
              const isOpen = expanded === insight.id;

              return (
                <div key={insight.id}
                  onClick={() => setExpanded(isOpen ? null : insight.id)}
                  style={{ borderRadius: 12, border: `1px solid ${isOpen ? cfg.border : 'rgba(255,255,255,0.06)'}`, background: isOpen ? cfg.bg : 'rgba(255,255,255,0.02)', cursor: 'pointer', transition: 'all 0.25s', overflow: 'hidden' }}>
                  <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: cfg.bg, border: `1px solid ${cfg.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <TypeIcon size={14} color={cfg.color} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#f0f6ff' }}>{insight.title}</span>
                        <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 700, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, letterSpacing: '0.04em' }}>{cfg.label.toUpperCase()}</span>
                        <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 700, background: `${impactColors[insight.impact]}18`, color: impactColors[insight.impact], border: `1px solid ${impactColors[insight.impact]}30`, marginLeft: 'auto' }}>
                          {insight.impact.toUpperCase()} IMPACT
                        </span>
                      </div>
                      {insight.metric && (
                        <div style={{ fontSize: 13, fontWeight: 700, color: cfg.color, marginBottom: 4 }}>{insight.metric}</div>
                      )}
                      <div style={{ fontSize: 13, color: '#8b9ab1', lineHeight: 1.5 }}>{insight.description}</div>
                    </div>
                  </div>

                  {isOpen && (
                    <div style={{ padding: '0 16px 16px 60px' }}>
                      <div style={{ padding: '12px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#4b5563', letterSpacing: '0.08em', marginBottom: 6 }}>CEO ACTION ITEM</div>
                        <div style={{ fontSize: 13, color: '#c8d6e8', lineHeight: 1.6 }}>{insight.suggestion}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
