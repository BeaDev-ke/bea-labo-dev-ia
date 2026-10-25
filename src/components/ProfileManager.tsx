import React, { useState, useEffect } from 'react';
import { 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  GraduationCap, 
  ShieldCheck, 
  Flame, 
  Save, 
  RotateCcw,
  BookOpen,
  Compass,
  ArrowRight
} from 'lucide-react';
import { UserProfile, ProfileType, UseCaseType } from '../types/bea';
import { PROFILE_METAS, STUDY_COUNTRIES, STUDY_LEVELS } from '../data/profilesData';
import { sanitizeXSS, signData, verifyData } from '../utils/security';

interface ProfileManagerProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onGoToChat: () => void;
}

export const ProfileManager: React.FC<ProfileManagerProps> = ({
  userProfile,
  onUpdateProfile,
  onGoToChat,
}) => {
  const [formData, setFormData] = useState<UserProfile>({ ...userProfile });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Synchroniser avec les props entrantes
  useEffect(() => {
    setFormData({ ...userProfile });
  }, [userProfile]);

  const activeMeta = PROFILE_METAS[formData.profileType] || PROFILE_METAS.createur;

  const handleProfileTypeChange = (newType: ProfileType) => {
    const meta = PROFILE_METAS[newType];
    setFormData(prev => ({
      ...prev,
      profileType: newType,
      useCase: meta.defaultUseCase,
      // Si étudiant, initialiser les pays et niveaux par défaut
      schoolCountry: newType === 'etudiant' ? (prev.schoolCountry || 'France') : prev.schoolCountry,
      studyLevel: newType === 'etudiant' ? (prev.studyLevel || 'Lycée - Première (Bac)') : prev.studyLevel,
    }));
  };

  const handleSave = () => {
    setSaveStatus('saving');
    setErrorMessage('');

    try {
      // 1. Désinfection de sécurité anti-XSS
      const cleanName = sanitizeXSS(formData.displayName.trim());
      const cleanGoal = sanitizeXSS(formData.goal.trim());

      if (!cleanName) {
        setErrorMessage('Le prénom ou pseudonyme est requis.');
        setSaveStatus('error');
        return;
      }

      const updated: UserProfile = {
        ...formData,
        displayName: cleanName.slice(0, 40),
        goal: cleanGoal.slice(0, 300),
        lastActive: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };

      // 2. Scellement cryptographique d'intégrité anti-falsification
      const envelope = signData(updated);
      localStorage.setItem('bea_user_profile_secure', JSON.stringify(envelope));

      // 3. Application au parent
      onUpdateProfile(updated);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err: any) {
      setErrorMessage(`Erreur d'enregistrement : ${err.message || 'Problème de stockage local'}`);
      setSaveStatus('error');
    }
  };

  const handleReset = () => {
    setFormData({ ...userProfile });
    setSaveStatus('idle');
    setErrorMessage('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* HEADER CARD */}
      <div className="bg-gradient-to-r from-[#1c133a] via-[#15112a] to-[#251745] border-2 border-[#7c3aed] p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#7c3aed] to-[#db2777] flex items-center justify-center text-3xl shadow-lg shadow-purple-900/50">
            {activeMeta.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white">{formData.displayName || 'Utilisateur'}</h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                {activeMeta.badge}
              </span>
            </div>
            <p className="text-xs text-[#c4b5fd] mt-1">{activeMeta.tagline}</p>
          </div>
        </div>

        <button
          onClick={onGoToChat}
          className="px-4 py-2 rounded-xl bg-[#231a4a] hover:bg-[#322369] border border-[#7c3aed] text-xs font-bold text-white transition flex items-center gap-2 shadow"
        >
          <span>Aller au Chat avec ce profil</span>
          <ArrowRight className="w-4 h-4 text-purple-400" />
        </button>
      </div>

      {/* FEEDBACK STATUS */}
      {saveStatus === 'saved' && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Profil enregistré et synchronisé avec succès ! Vos interactions avec Andrea sont désormais personnalisées.</span>
        </div>
      )}

      {saveStatus === 'error' && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border-2 border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1 : CHOIX DU TYPE DE PROFIL (10 OPTIONS) */}
      <div className="bg-[#15112a] border border-[#7c3aed]/50 rounded-3xl p-6 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-purple-400" />
              1. Qui êtes-vous ? (Sélectionnez votre profil d'activité)
            </h3>
            <p className="text-xs text-[#a78bfa]">Andrea adaptera ses réponses, son vocabulaire et ses propositions à votre contexte réel.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {(Object.keys(PROFILE_METAS) as ProfileType[]).map((typeKey) => {
            const meta = PROFILE_METAS[typeKey];
            const isSelected = formData.profileType === typeKey;

            return (
              <button
                key={typeKey}
                type="button"
                onClick={() => handleProfileTypeChange(typeKey)}
                className={`p-3.5 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#231a4a] border-[#a855f7] shadow-lg shadow-purple-900/30 ring-2 ring-purple-500/30'
                    : 'bg-[#100b24] border-[#7c3aed]/30 hover:border-[#7c3aed]/70 hover:bg-[#1a1435]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-2xl">{meta.icon}</span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs">
                      ✓
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <div className="font-bold text-xs text-white">{meta.label}</div>
                  <div className="text-[10px] text-[#c4b5fd] mt-0.5 line-clamp-2">{meta.description}</div>
                </div>
                {meta.hasDailyChallenge && (
                  <div className="mt-2 pt-2 border-t border-[#7c3aed]/20 text-[10px] font-bold text-amber-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Micro-Défis inclus
                  </div>
                )}
                {meta.hasStreak && !meta.hasDailyChallenge && (
                  <div className="mt-2 pt-2 border-t border-[#7c3aed]/20 text-[10px] font-bold text-purple-300 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-purple-400" />
                    Compteur de série actif
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 2 : INFORMATIONS COMPLÉMENTAIRES SELON LE PROFIL */}
      <div className="bg-[#15112a] border border-[#7c3aed]/50 rounded-3xl p-6 space-y-4 shadow-lg">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <User className="w-4 h-4 text-purple-400" />
          2. Personnalisation & Paramètres
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#c4b5fd] mb-1.5">
              Prénom ou Identifiant affiché
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={e => setFormData({ ...formData, displayName: e.target.value })}
              placeholder="Ex: Sarah, Alex, Professeur Thomas..."
              className="w-full bg-[#100b24] border border-[#7c3aed]/50 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#c4b5fd] mb-1.5">
              Ton d'Andrea souhaité
            </label>
            <select
              value={formData.preferredStyle}
              onChange={e => setFormData({ ...formData, preferredStyle: e.target.value as any })}
              className="w-full bg-[#100b24] border border-[#7c3aed]/50 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400"
            >
              <option value="expert">Expert direct (orienté résultats sans détours)</option>
              <option value="bienveillant">Pédagogue bienveillant (encourageant et doux)</option>
              <option value="synthetique">Synthétique percutant (bullet points et actions)</option>
              <option value="socratique">Méthode socratique (questions pour vous faire réfléchir)</option>
            </select>
          </div>
        </div>

        {/* CHAMPS SPÉCIFIQUES POUR ÉTUDIANT */}
        {formData.profileType === 'etudiant' && (
          <div className="p-4 rounded-2xl bg-[#1e153d] border-2 border-purple-500/50 space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-200">
              <GraduationCap className="w-4 h-4 text-amber-300" />
              <span>Paramètres Scolaires Spécifiques (Programme officiel & niveau)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#c4b5fd] mb-1">
                  Pays de scolarité
                </label>
                <select
                  value={formData.schoolCountry || 'France'}
                  onChange={e => setFormData({ ...formData, schoolCountry: e.target.value })}
                  className="w-full bg-[#100b24] border border-[#7c3aed]/60 rounded-xl p-2.5 text-white"
                >
                  {STUDY_COUNTRIES.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#c4b5fd] mb-1">
                  Niveau d'études actuel
                </label>
                <select
                  value={formData.studyLevel || 'Lycée - Première (Bac)'}
                  onChange={e => setFormData({ ...formData, studyLevel: e.target.value })}
                  className="w-full bg-[#100b24] border border-[#7c3aed]/60 rounded-xl p-2.5 text-white"
                >
                  {STUDY_LEVELS.map(lvl => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-[#c4b5fd] mb-1.5">
            Votre objectif prioritaire du moment
          </label>
          <textarea
            value={formData.goal}
            onChange={e => setFormData({ ...formData, goal: e.target.value })}
            rows={2}
            placeholder="Ex: Avoir mon Bac avec mention, publier 1 vidéo par jour sans blocage, signer 3 nouveaux clients ce mois-ci..."
            className="w-full bg-[#100b24] border border-[#7c3aed]/50 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-400"
          />
        </div>
      </div>

      {/* BOUTONS D'ACTION */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2.5 rounded-xl bg-[#15112a] hover:bg-[#20183e] border border-[#7c3aed]/40 text-xs font-semibold text-[#c4b5fd] transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Réinitialiser
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#c026d3] hover:from-[#6d28d9] hover:to-[#a21caf] text-white font-bold text-xs shadow-lg shadow-purple-900/40 transition flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Enregistrer les modifications de mon profil
        </button>
      </div>
    </div>
  );
};
