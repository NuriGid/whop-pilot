export interface DashboardMetrics {
  totalRevenue: number;
  revenueChange: number;
  activeMembers: number;
  membersChange: number;
  churnRate: number;
  churnChange: number;
  recoveredRevenue: number;
  recoveredChange: number;
  mrr: number;
  mrrChange: number;
  ltv: number;
}

export interface RetentionAlert {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  riskLevel: 'critical' | 'high' | 'medium';
  riskScore: number;
  reason: string;
  daysInactive: number;
  memberSince: string;
  plan: string;
  planValue: number;
  lastActivity: string;
}

export interface ChurnEvent {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  cancelledAt: string;
  plan: string;
  planValue: number;
  reason?: string;
  recoverable: boolean;
  recoveryAction?: string;
}

export interface RevenueRecoveryItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  amount: number;
  failedAt: string;
  attempts: number;
  status: 'pending' | 'recovering' | 'recovered' | 'failed';
  nextRetry?: string;
  plan: string;
}

export interface AIInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'action' | 'trend';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  metric?: string;
  suggestion: string;
  generatedAt: string;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  recovered: number;
  lost: number;
}

export interface MemberActivity {
  date: string;
  newMembers: number;
  churned: number;
  active: number;
}

export interface CompanyInfo {
  id: string;
  name: string;
  imageUrl?: string;
  memberCount: number;
  createdAt: string;
}
