/**
 * Gestion du quota dynamique de tokens Andrea BehaviorLab AI.
 * Règle :
 * - Basique (9 €) : Base 10 000 tokens/j + 2 500 tokens par jour de série (max 50 000/j)
 * - Pro (14.90 €) : Base 35 000 tokens/j + 5 000 tokens par jour de série (max 120 000/j)
 * - Ultra (18 €) : Tokens 100% ILLIMITÉS (aucun plafond)
 */

export interface TokenStatus {
  isUnlimited: boolean;
  baseTokens: number;
  bonusStreakTokens: number;
  totalDailyLimit: number;
  usedToday: number;
  remainingToday: number;
  percentUsed: number;
  streakDays: number;
  plan: string;
}

const STORAGE_KEY_PREFIX = 'andrea_token_usage_';

function getTodayKey(): string {
  const now = new Date();
  return `${STORAGE_KEY_PREFIX}${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

export function getDailyTokensUsed(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const val = localStorage.getItem(getTodayKey());
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
}

export function consumeTokens(amount: number): number {
  if (typeof window === 'undefined') return 0;
  try {
    const key = getTodayKey();
    const current = getDailyTokensUsed();
    const updated = current + amount;
    localStorage.setItem(key, updated.toString());
    return updated;
  } catch {
    return 0;
  }
}

export function calculateTokenStatus(plan = 'basique', streakDays = 1): TokenStatus {
  const normPlan = (plan || 'basique').toLowerCase();
  const streak = Math.max(1, streakDays || 1);
  const usedToday = getDailyTokensUsed();

  if (normPlan === 'ultra') {
    return {
      isUnlimited: true,
      baseTokens: Infinity,
      bonusStreakTokens: 0,
      totalDailyLimit: Infinity,
      usedToday,
      remainingToday: Infinity,
      percentUsed: 0,
      streakDays: streak,
      plan: 'ultra'
    };
  }

  let base = 10000;
  let bonusPerDay = 2500;
  let maxCap = 50000;

  if (normPlan === 'pro') {
    base = 35000;
    bonusPerDay = 5000;
    maxCap = 120000;
  }

  // Bonus for streak days beyond day 1
  const bonusStreakTokens = Math.min((streak - 1) * bonusPerDay, maxCap - base);
  const totalDailyLimit = Math.min(base + bonusStreakTokens, maxCap);
  const remainingToday = Math.max(0, totalDailyLimit - usedToday);
  const percentUsed = Math.min(100, Math.round((usedToday / totalDailyLimit) * 100));

  return {
    isUnlimited: false,
    baseTokens: base,
    bonusStreakTokens,
    totalDailyLimit,
    usedToday,
    remainingToday,
    percentUsed,
    streakDays: streak,
    plan: normPlan
  };
}
