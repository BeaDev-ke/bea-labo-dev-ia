import React, { useState } from 'react';
import {
  Palette,
  User,
  CheckCircle2,
  Sparkles,
  Save,
  MessageSquare,
  Target,
  Compass
} from 'lucide-react';
import { UserPreferences } from '../types';

interface PersonalizationPageProps {
  preferences: UserPreferences;
  onSavePreferences: (prefs: UserPreferences) => void;
}

export const PersonalizationPage: React.FC<PersonalizationPageProps> = ({
  preferences,
  onSavePreferences,
}) => {
  const [profile, setProfile] = useState(preferences.profile);
  const [displayName, setDisplayName] = useState(preferences.displayName);
  const [tone, setTone] = useState(preferences.tone);
  const [objective, setObjective] = useState(preferences.objective);
  const [saved, setSaved] = useState(false);

  const profiles = [
    { id: 'createur', title: '🎬 Créateur de contenu', desc: 'Vidéos virales, formats 9:16, rétention & accroches' },
    { id: 'independant', title: '💼 Indépendant & Freelance', desc: 'Acquisition, offres, organisation & rentabilité' },
    { id: 'entreprise', title: '🏢 Dirigeant & Entreprise', desc: 'Délégation, stratégie d\'équipe, vision & décisions' },
    { id: 'etudiant', title: '🎓 Étudiant', desc: 'Méthodes d\'assimilation active, mémorisation & concours' },
    { id: 'salarie', title: '👔 Salarié & Manager', desc: 'Gestion du temps, évolution professionnelle & impact' },
    { id: 'recherche_emploi', title: '🔍 En recherche d\'emploi', desc: 'Clarté de trajectoire, candidatures ciblées & entretiens' },
    { id: 'parent', title: '👨‍👩‍👦 Parent actif', desc: 'Équilibre de vie, routines familiales & projets perso' },
    { id: 'enseignant', title: '📚 Enseignant & Formateur', desc: 'Pédagogie interactive, méthode Feynman & engagement' },
    { id: 'autre', title: '⚡ Projet général', desc: 'Productivité comportementale et passage à l\'action' },
  ];

  const handleSave = () => {
    onSavePreferences({
      profile,
      displayName,
      tone,
      objective,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#1A1930] border border-[#5A33FF44] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8B70FF] uppercase tracking-wider mb-1">
            <Palette className="w-4 h-4" />
            <span>Personnalisation du Modèle & Comportement</span>
          </div>
          <h2 className="text-2xl font-black text-white">Profil & Alignement Stratégique</h2>
          <p className="text-xs text-slate-300 mt-1">
            Adaptez les réponses d'Andrea à votre réalité professionnelle et à vos objectifs prioritaires.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:from-[#2521a8] hover:to-[#6a44ff] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{saved ? 'Préférences enregistrées !' : 'Enregistrer les réglages'}</span>
        </button>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name and Tone */}
        <div className="p-6 rounded-2xl bg-[#14132b] border border-[#5A33FF33] space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-sky-400" />
              <span>Comment Andrea doit vous appeler ?</span>
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Votre prénom ou surnom..."
              className="w-full px-3.5 py-2.5 bg-[#201844] border border-[#5A33FF44] rounded-xl text-xs text-white focus:outline-none focus:border-[#8B70FF]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-[#8B70FF]" />
              <span>Tonalité de communication</span>
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#201844] border border-[#5A33FF44] rounded-xl text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="Stratégique et direct (recommandé)">Stratégique et direct (recommandé)</option>
              <option value="Bienveillant et encourageant">Bienveillant et encourageant</option>
              <option value="Challengeur sans compromis">Challengeur sans compromis</option>
              <option value="Concis et orienté données">Concis et orienté données</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-amber-400" />
              <span>Objectif comportemental principal</span>
            </label>
            <textarea
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              rows={3}
              placeholder="Ex: Passer à l'action sans procrastiner et publier 3 vidéos 9:16 par semaine..."
              className="w-full p-3 bg-[#201844] border border-[#5A33FF44] rounded-xl text-xs text-white focus:outline-none focus:border-[#8B70FF] resize-none"
            />
          </div>
        </div>

        {/* Profile Role Selector */}
        <div className="p-6 rounded-2xl bg-[#14132b] border border-[#5A33FF33] space-y-4">
          <label className="text-xs font-bold text-slate-300 block">
            Sélectionnez votre profil d'activité :
          </label>

          <div className="space-y-2 max-h-[380px] overflow-y-auto no-scrollbar pr-1">
            {profiles.map((p) => {
              const isSelected = profile === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setProfile(p.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] border-[#8B70FF] shadow-md shadow-[#5A33FF33]'
                      : 'bg-[#201844] border-[#5A33FF33] hover:border-[#5A33FF66]'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-white">{p.title}</div>
                    <div className="text-[11px] text-slate-300 mt-0.5">{p.desc}</div>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
