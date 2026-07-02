'use client';

/**
 * Küçük "DEMO" rozeti — mock veri kullanan bölümlerde gösterilir.
 * Gerçek müşteriler geldiğinde bu rozet kaldırılacak.
 */
export default function DemoBadge() {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '3px 8px',
        borderRadius: 6,
        background: 'rgba(251,191,36,0.12)',
        border: '1px solid rgba(251,191,36,0.25)',
        fontSize: 10,
        fontWeight: 700,
        color: '#fbbf24',
        letterSpacing: '0.06em',
        textTransform: 'uppercase' as const,
        lineHeight: 1,
        flexShrink: 0,
      }}
    >
      📋 Demo
    </span>
  );
}
