import Groq from 'groq-sdk';
import type { DashboardMetrics, AIInsight } from '@/types';

function getGroqClient(): Groq {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY environment variable is not set');
  }
  return new Groq({ apiKey });
}

export async function generateCEOInsights(
  metrics: DashboardMetrics,
  companyName: string
): Promise<AIInsight[]> {
  const client = getGroqClient();

  const prompt = `You are an elite business intelligence advisor for ${companyName}, a creator business on Whop.

Current Business Metrics:
- Total Revenue (30d): $${metrics.totalRevenue.toLocaleString()} (${metrics.revenueChange > 0 ? '+' : ''}${metrics.revenueChange}%)
- Active Members: ${metrics.activeMembers} (${metrics.membersChange > 0 ? '+' : ''}${metrics.membersChange}%)
- Monthly Churn Rate: ${metrics.churnRate}% (${metrics.churnChange > 0 ? '+' : ''}${metrics.churnChange}%)
- MRR: $${metrics.mrr.toLocaleString()}
- Recovered Revenue: $${metrics.recoveredRevenue.toLocaleString()}
- LTV: $${metrics.ltv}

Generate 4 highly specific, actionable CEO insights as a JSON array. Each insight must be a concrete, data-backed recommendation.

Return ONLY valid JSON in this exact format:
[
  {
    "id": "ai1",
    "type": "warning|opportunity|action|trend",
    "title": "Specific insight title",
    "description": "2-3 sentence analysis with specific numbers",
    "impact": "high|medium|low",
    "metric": "Specific metric or dollar amount",
    "suggestion": "Specific actionable recommendation",
    "generatedAt": "${new Date().toISOString()}"
  }
]`;

  try {
    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = completion.choices[0]?.message?.content || '[]';
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No JSON array found in response');
    return JSON.parse(jsonMatch[0]) as AIInsight[];
  } catch (error) {
    console.error('Groq AI error:', error);
    throw error;
  }
}
