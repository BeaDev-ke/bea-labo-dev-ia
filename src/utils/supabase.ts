import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile } from '../types/bea';

// Safe Supabase credentials with fallback
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://behaviorlab.supabase.co';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key_andrea';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  !import.meta.env.VITE_SUPABASE_ANON_KEY.includes('dummy')
);

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Modèle d'email de confirmation Supabase avec le nom Andrea AI
 */
export interface VerificationEmailInfo {
  toEmail: string;
  userName: string;
  subject: string;
  senderName: string;
  confirmationLink: string;
  htmlTemplate: string;
}

export function generateAndreaVerificationEmail(email: string, name: string): VerificationEmailInfo {
  const confirmationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const confirmationLink = `${window.location.origin}/?confirm_token=${confirmationToken}&email=${encodeURIComponent(email)}`;
  
  const htmlTemplate = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #100b24; color: #f5f3ff; padding: 32px; border-radius: 16px; max-width: 540px; margin: 0 auto; border: 1px solid #5A33FF44;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="font-size: 26px; font-weight: 800; color: #ffffff; margin: 0 0 6px 0; letter-spacing: -0.5px;">Andrea AI</h1>
        <p style="color: #a78bfa; font-size: 13px; margin: 0;">Intelligence Stratégique & Créative · BehaviorLab</p>
      </div>

      <div style="background-color: #181135; border: 1px solid #5A33FF33; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <p style="font-size: 15px; line-height: 1.5; color: #f5f3ff; margin-top: 0;">
          Bonjour <strong>${name}</strong>,
        </p>
        <p style="font-size: 14px; line-height: 1.6; color: #c4b5fd;">
          Merci d'avoir rejoint <strong>Andrea AI</strong> ! Pour finaliser la création de votre compte, activer votre espace personnel et sécuriser vos accès, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :
        </p>
        
        <div style="text-align: center; margin: 28px 0;">
          <a href="${confirmationLink}" style="background: linear-gradient(135deg, #1E1B8C 0%, #5A33FF 100%); color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 14px 28px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 14px rgba(90, 51, 255, 0.4);">
            Confirmer mon compte Andrea AI →
          </a>
        </div>

        <p style="font-size: 12px; line-height: 1.5; color: #a78bfa; margin-bottom: 0;">
          Ce lien de sécurité est valable pendant 24 heures. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.
        </p>
      </div>

      <div style="text-align: center; font-size: 11px; color: #8B70FF; border-top: 1px solid #5A33FF22; padding-top: 16px;">
        <span>© 2026 Andrea AI · Système officiel de gestion de compte</span>
      </div>
    </div>
  `;

  return {
    toEmail: email,
    userName: name,
    subject: "Confirmez votre adresse email — Andrea AI",
    senderName: "Andrea AI <auth@andrea.ai>",
    confirmationLink,
    htmlTemplate,
  };
}

/**
 * Synchronise ou enregistre le profil dans la table public.profiles de Supabase
 * Conforme au schéma de la base de données :
 * - user_id uuid primary key references auth.users(id)
 * - plan text check (plan in ('free', 'bea', 'pro', 'abo'))
 * - created_at timestamptz
 */
export async function syncProfileToSupabase(user: UserProfile): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isSupabaseConfigured) {
      // Stockage local simulé lorsque les clés live Supabase ne sont pas encore fournies dans l'environnement
      return { success: true };
    }

    // Convert internal plan to Supabase plan enum ('free', 'bea', 'pro', 'abo')
    let supabasePlan = 'free';
    if (user.plan === 'basique') supabasePlan = 'bea';
    else if (user.plan === 'pro') supabasePlan = 'pro';
    else if (user.plan === 'ultra') supabasePlan = 'abo';

    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: user.id.replace('usr-', ''), // normalisé
        plan: supabasePlan,
      });

    if (error) {
      console.warn('Supabase profiles sync notice:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.warn('Supabase sync catch:', err.message);
    return { success: false, error: err.message };
  }
}
