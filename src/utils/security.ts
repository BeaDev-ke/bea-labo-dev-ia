/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Bea Security Shield - Système de Protection Anti-Piratage & Anti-Injection
 * BehaviorLab AI - Sécurité Défensive Multi-Couches
 */

export interface SecurityThreatLog {
  id: string;
  timestamp: string;
  type: 'xss' | 'prompt_injection' | 'rate_limit' | 'tampering' | 'honeypot';
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string;
  source: string;
  blocked: boolean;
}

// In-memory rate limiting tracker
interface RateLimitBucket {
  count: number;
  resetAt: number;
}

const rateLimitBuckets: Record<string, RateLimitBucket> = {};

// Secret salt for client state integrity (prevents localStorage tampering in DevTools)
const INTEGRITY_SALT = 'BEA_SECURE_VAULT_v3_2026_@89F45';

/**
 * 1. Sanitisation XSS & HTML
 * Élimine les balises exécutables, handlers d'événements et protocoles dangereux
 */
export function sanitizeXSS(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return input
    // Neutralise les balises script, iframe, object, embed
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '[BALISE_SCRIPT_BLOQUÉE]')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '[IFRAME_BLOQUÉE]')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '[OBJECT_BLOQUÉ]')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '[EMBED_BLOQUÉ]')
    // Neutralise les handlers d'événements DOM (onerror, onload, onclick, onmouseover...)
    .replace(/\bon\w+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/\bon\w+\s*=\s*[^>\s]+/gi, '')
    // Neutralise javascript: et data:text/html dans les liens
    .replace(/javascript\s*:/gi, 'blocked-protocol:')
    .replace(/data\s*:\s*text\/html/gi, 'blocked-data:');
}

/**
 * 2. Détection et neutralisation du Prompt Injection & Jailbreak LLM
 * Protège les prompts d'Andrea contre les tentatives de détournement de personnalité,
 * extraction de clés d'API, contournement des règles éthiques ("DAN mode", "ignore all instructions")
 */
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /oublie\s+(toutes\s+)?(les\s+)?instructions\s+pr[ée]c[ée]dentes/i,
  /reveal\s+(your|the)\s+(system\s+)?prompt/i,
  /donne-moi\s+(ton|le)\s+prompt\s+syst[eè]me/i,
  /system\s*:\s*you\s+are/i,
  /<\|im_start\|>/i,
  /<\|endoftext\|>/i,
  /\bDAN\s+mode\b/i,
  /act\s+as\s+an\s+unfiltered\s+ai/i,
  /agis\s+comme\s+une\s+ia\s+sans\s+filtre/i,
  /give\s+me\s+(the\s+)?api\s*key/i,
  /donne[- ]moi\s+la\s+cl[ée]\s+api/i,
  /sudo\s+mode\s+enabled/i,
  /jailbreak/i,
];

export function inspectPromptSecurity(prompt: string): { isSafe: boolean; threat?: string; sanitized: string } {
  if (!prompt || typeof prompt !== 'string') return { isSafe: true, sanitized: '' };

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(prompt)) {
      return {
        isSafe: false,
        threat: `Tentative de Prompt Injection / Jailbreak détectée : motif "${pattern.source}"`,
        sanitized: sanitizeXSS(prompt.replace(pattern, '[INJECTION_NEUTRALISÉE]')),
      };
    }
  }

  return {
    isSafe: true,
    sanitized: sanitizeXSS(prompt),
  };
}

/**
 * 3. Rate Limiter Anti-Brute-Force & Anti-DDoS côté client
 * Bloque le flooding automatisé de requêtes vers les endpoints IA
 */
export function checkRateLimit(key: string, maxRequests = 20, windowMs = 60000): { allowed: boolean; remaining: number; resetInSec: number } {
  const now = Date.now();
  const bucket = rateLimitBuckets[key] || { count: 0, resetAt: now + windowMs };

  if (now > bucket.resetAt) {
    bucket.count = 1;
    bucket.resetAt = now + windowMs;
  } else {
    bucket.count += 1;
  }

  rateLimitBuckets[key] = bucket;

  const allowed = bucket.count <= maxRequests;
  const remaining = Math.max(0, maxRequests - bucket.count);
  const resetInSec = Math.max(1, Math.round((bucket.resetAt - now) / 1000));

  return { allowed, remaining, resetInSec };
}

/**
 * 4. Scellement Cryptographique d'Intégrité (Anti-Tampering)
 * Empêche un attaquant de modifier manuellement son statut dans localStorage
 * (ex: passer son plan de "free" à "abo" sans payer)
 */
function computeChecksum(data: string): string {
  let hash = 0x811c9dc5;
  const combined = data + INTEGRITY_SALT;
  for (let i = 0; i < combined.length; i++) {
    hash ^= combined.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return (hash >>> 0).toString(16);
}

export function signData<T>(payload: T): { data: T; signature: string } {
  const serialized = JSON.stringify(payload);
  const signature = computeChecksum(serialized);
  return { data: payload, signature };
}

export function verifyData<T>(envelope: { data: T; signature: string } | null, fallback: T): T {
  if (!envelope || !envelope.data || !envelope.signature) return fallback;
  const serialized = JSON.stringify(envelope.data);
  const expectedSig = computeChecksum(serialized);
  if (expectedSig !== envelope.signature) {
    console.warn('[SECURITY] Altération non autorisée détectée dans le stockage local ! Réinitialisation sécurisée.');
    return fallback;
  }
  return envelope.data;
}

/**
 * 5. Honeypot Anti-Bot
 * Vérifie si le champ invisible piégé a été rempli par un robot
 */
export function isHoneypotTriggered(honeypotValue: string): boolean {
  return Boolean(honeypotValue && honeypotValue.trim().length > 0);
}
