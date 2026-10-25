import React, { useState } from 'react';
import { 
  Sparkles, 
  Clock, 
  Scissors, 
  Layers, 
  Film, 
  Wand2, 
  Image as ImageIcon, 
  Video, 
  Plus, 
  Grid, 
  Mic, 
  Bell, 
  User, 
  ChevronRight, 
  Play, 
  CheckCircle2, 
  Zap, 
  Share2, 
  Download,
  Flame,
  ArrowRight
} from 'lucide-react';
import { PageView } from '../types/bea';

interface CreativeHubProps {
  onSelectAction: (action: string, promptText?: string) => void;
  onNavigate: (page: PageView) => void;
  onOpenVoice: () => void;
}

interface ViralTemplate {
  id: string;
  title: string;
  badge?: string;
  duration?: string;
  tag: string;
  views: string;
  prompt: string;
  imageBg: string;
  aspect: string;
}

export const CreativeHub: React.FC<CreativeHubProps> = ({ 
  onSelectAction, 
  onNavigate,
  onOpenVoice 
}) => {
  const [activeBottomTab, setActiveBottomTab] = useState<'editer' | 'modeles' | 'labo' | 'inbox' | 'moi'>('labo');
  const [selectedTemplate, setSelectedTemplate] = useState<ViralTemplate | null>(null);
  const [credits, setCredits] = useState(0);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [activeActionModal, setActiveActionModal] = useState<string | null>(null);
  const [quickInput, setQuickInput] = useState('');

  const VIRAL_TEMPLATES: ViralTemplate[] = [
    {
      id: 'duck',
      title: 'B.Duck 3D',
      badge: 'B.Duck',
      tag: 'Animation 3D',
      views: '2.4M',
      prompt: 'Génère un personnage 3D jaune mignon style B.Duck dans un décor de prairie avec un effet d\'éclairage studio cinématique.',
      imageBg: 'from-amber-400 via-orange-500 to-yellow-600',
      aspect: '9:16'
    },
    {
      id: 'orange_dad',
      title: "ORANGE DAD'S SECRET",
      badge: "01:24",
      duration: "01:24",
      tag: 'Storytelling Viral',
      views: '5.8M',
      prompt: "Scénario et découpage d'une vidéo virale humoristique de 1m24 'Orange Dad\\'s Secret' avec hook puissant de 3 secondes et twist final.",
      imageBg: 'from-orange-600 via-red-600 to-amber-700',
      aspect: '9:16'
    },
    {
      id: 'football_clip',
      title: 'Clip Match & Célébration',
      badge: '00:16',
      duration: '00:16',
      tag: 'Sport & Reels',
      views: '1.9M',
      prompt: 'Montage dynamique de 16 secondes d\'un joueur en maillot de football avec ralenti sur la frappe et transition rythmée.',
      imageBg: 'from-blue-600 via-indigo-700 to-sky-800',
      aspect: '9:16'
    },
    {
      id: 'fashion_shoot',
      title: 'Shooting Mode & Piscine',
      badge: '00:11',
      duration: '00:11',
      tag: 'Lifestyle & Luxe',
      views: '3.1M',
      prompt: 'Shooting photo et vidéo esthétique de 11 secondes en bord de piscine avec reflet aquatique, lumière dorée et transitions fluides.',
      imageBg: 'from-pink-500 via-rose-600 to-purple-800',
      aspect: '9:16'
    },
    {
      id: 'witch_cosplay',
      title: 'Cosplay & Magie Urbaine',
      badge: '00:11',
      duration: '00:11',
      tag: 'Fantaisie & Effets',
      views: '4.5M',
      prompt: 'Scène de cosplay urbaine de 11 secondes avec costume de sorcière moderne, balai magique et effets de particules lumineuses.',
      imageBg: 'from-purple-800 via-violet-900 to-indigo-950',
      aspect: '9:16'
    }
  ];

  const handleRemixClick = (tpl: ViralTemplate) => {
    setSelectedTemplate(tpl);
  };

  const handleConfirmRemix = (tpl: ViralTemplate) => {
    onSelectAction('remix', tpl.prompt);
    setSelectedTemplate(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#140e2d] text-[#f5f3ff] overflow-y-auto">
      {/* Top Status & Balance Bar */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between border-b border-[#5A33FF22] bg-[#100b24]">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
            <span className="text-purple-400">✨</span>
            <span>Labo de Création Andrea</span>
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#201844] text-[#c4b5fd] border border-[#5A33FF44]">
            v2.5
          </span>
        </div>

        {/* Right tools matching Image 2: Sparks counter + History */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCredits(c => c + 10)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#201844] hover:bg-[#2a2057] border border-[#5A33FF44] text-xs font-bold text-white transition shadow-sm"
            title="Solde de crédits créatifs (cliquez pour recharger)"
          >
            <span className="text-amber-400">✦</span>
            <span>{credits}</span>
          </button>

          <button
            onClick={() => setShowHistoryModal(true)}
            className="w-8 h-8 rounded-full bg-[#201844] hover:bg-[#2a2057] border border-[#5A33FF44] flex items-center justify-center text-[#c4b5fd] hover:text-white transition shadow-sm"
            title="Historique de créations"
          >
            <Clock className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto w-full p-4 md:p-6 space-y-6">
        {/* Big Question Header matching Image 2 */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Que créons-nous aujourd'hui ?
          </h1>
          <p className="text-xs text-[#c4b5fd] mt-1">
            Générez des vidéos virales, retouchez vos visuels et montez vos séquences avec Andrea.
          </p>
        </div>

        {/* Viral Remix Section matching Image 2 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate('modeles')}
              className="text-xs font-bold text-white hover:text-purple-300 flex items-center gap-1 transition group"
            >
              <span>Remix pour du contenu viral</span>
              <ChevronRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <span className="text-[11px] text-[#c4b5fd]/70">5 formats populaires</span>
          </div>

          {/* Horizontal scroll of template cards */}
          <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-[#5A33FF44]">
            {VIRAL_TEMPLATES.map(tpl => (
              <div
                key={tpl.id}
                onClick={() => handleRemixClick(tpl)}
                className="group relative shrink-0 w-36 sm:w-44 h-56 sm:h-64 rounded-2xl overflow-hidden cursor-pointer border border-[#5A33FF44] hover:border-purple-400 transition-all duration-200 hover:scale-[1.02] shadow-xl flex flex-col justify-between p-3"
              >
                {/* Background decorative gradient */}
                <div className={`absolute inset-0 bg-gradient-to-b ${tpl.imageBg} opacity-85 group-hover:opacity-100 transition-opacity`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                {/* Top badge / tag */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20">
                    {tpl.tag}
                  </span>
                  <span className="text-[10px] font-semibold text-white/90 bg-black/40 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <Flame className="w-2.5 h-2.5 text-amber-400" />
                    {tpl.views}
                  </span>
                </div>

                {/* Bottom title & duration badge */}
                <div className="relative z-10 space-y-1">
                  <div className="font-extrabold text-white text-xs sm:text-sm line-clamp-2 drop-shadow-md">
                    {tpl.title}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    {tpl.duration && (
                      <span className="font-mono text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">
                        {tpl.duration}
                      </span>
                    )}
                    <span className="text-[10px] font-bold text-purple-200 group-hover:text-white flex items-center gap-0.5 ml-auto">
                      Remixer <Play className="w-2.5 h-2.5 fill-current" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Action Pills matching Image 2 */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-[#c4b5fd] uppercase tracking-wider">
            Outils de création rapide
          </div>
          <div className="flex flex-wrap gap-2.5">
            {/* Pill 1: Édition photo rapide */}
            <button
              onClick={() => {
                setActiveActionModal('photo');
                onSelectAction('photo', "Édition photo rapide : recadre, sublime et applique la charte Andrea.");
              }}
              className="px-4 py-2.5 rounded-full bg-[#201844] hover:bg-[#2a2057] border border-[#5A33FF55] hover:border-[#8B70FF] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md transition-all hover:scale-[1.02]"
            >
              <span className="p-1 rounded-full bg-purple-500/20 text-purple-300">
                <ImageIcon className="w-4 h-4" />
              </span>
              <span>Édition photo rapide</span>
            </button>

            {/* Pill 2: Découpage automatique */}
            <button
              onClick={() => {
                setActiveActionModal('decoupage');
                onSelectAction('decoupage', "Découpage automatique : découpe mon script vidéo en 5 scènes dynamiques avec sous-titres.");
              }}
              className="px-4 py-2.5 rounded-full bg-[#201844] hover:bg-[#2a2057] border border-[#5A33FF55] hover:border-[#8B70FF] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md transition-all hover:scale-[1.02]"
            >
              <span className="p-1 rounded-full bg-blue-500/20 text-blue-300">
                <Scissors className="w-4 h-4" />
              </span>
              <span>Découpage automatique</span>
            </button>

            {/* Pill 3: Crée une vidéo IA */}
            <button
              onClick={() => {
                setActiveActionModal('video');
                onSelectAction('video', "Crée une vidéo IA : génère le prompt complet et les visuels pour une vidéo TikTok / Reel virale.");
              }}
              className="px-4 py-2.5 rounded-full bg-[#201844] hover:bg-[#2a2057] border border-[#5A33FF55] hover:border-[#8B70FF] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md transition-all hover:scale-[1.02]"
            >
              <span className="p-1 rounded-full bg-rose-500/20 text-rose-300">
                <Video className="w-4 h-4" />
              </span>
              <span>Crée une vidéo IA</span>
            </button>

            {/* Pill 4: Essaie Seedance 2.5 */}
            <button
              onClick={() => {
                setActiveActionModal('seedance');
                onSelectAction('seedance', "Essaie Seedance 2.5 : teste le dernier moteur d'animation et de synthèse comportementale d'Andrea.");
              }}
              className="px-4 py-2.5 rounded-full bg-gradient-to-r from-[#201844] to-[#2d1b69] hover:from-[#2a2057] hover:to-[#3b2288] border border-[#8B70FF]/60 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md transition-all hover:scale-[1.02]"
            >
              <span className="p-1 rounded-full bg-amber-500/20 text-amber-300">
                <Zap className="w-4 h-4" />
              </span>
              <span>Essaie Seedance 2.5</span>
            </button>
          </div>
        </div>

        {/* Montage Section Card matching Image 2 */}
        <div className="bg-[#1b143c] border border-[#5A33FF44] rounded-3xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Montage</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Prêt
                </span>
              </h3>
              <p className="text-xs text-[#c4b5fd]">
                Lancez un nouveau projet, parcourez la grille de modèles ou dictez au micro.
              </p>
            </div>
          </div>

          {/* Quick bar with +, Layout Grid, and Microphone on the right */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2.5">
              {/* + New Project Button */}
              <button
                onClick={() => {
                  onSelectAction('nouveau_projet', "Nouveau projet de montage : guide-moi pas à pas.");
                }}
                className="w-11 h-11 rounded-2xl bg-[#231a4a] hover:bg-[#2e2260] border border-[#5A33FF66] flex items-center justify-center text-white transition hover:scale-105 shadow-md"
                title="Nouveau projet de création"
              >
                <Plus className="w-5 h-5 text-purple-300" />
              </button>

              {/* Grid / Layout Models Button */}
              <button
                onClick={() => onNavigate('modeles')}
                className="w-11 h-11 rounded-2xl bg-[#231a4a] hover:bg-[#2e2260] border border-[#5A33FF66] flex items-center justify-center text-white transition hover:scale-105 shadow-md"
                title="Grille de modèles"
              >
                <Grid className="w-5 h-5 text-purple-300" />
              </button>

              <span className="text-xs text-[#c4b5fd] hidden sm:inline-block ml-2">
                Appuyez sur <strong className="text-white">+</strong> pour démarrer ou sur le <strong className="text-white">micro</strong> pour dicter.
              </span>
            </div>

            {/* Microphone Button on the right matching Image 2 */}
            <button
              onClick={onOpenVoice}
              className="w-11 h-11 rounded-full bg-[#100b24] hover:bg-[#201844] border-2 border-[#5A33FF] flex items-center justify-center text-white transition hover:scale-110 shadow-xl"
              title="Dicter une consigne vocale pour le montage"
            >
              <Mic className="w-5 h-5 text-purple-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Dock matching Image 2 */}
      <div className="mt-auto border-t border-[#5A33FF33] bg-[#100b24]/95 backdrop-blur-md px-4 py-2.5">
        <div className="max-w-md mx-auto grid grid-cols-5 gap-1 text-center">
          {/* 1. Éditer */}
          <button
            onClick={() => {
              setActiveBottomTab('editer');
              onNavigate('studio');
            }}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
              activeBottomTab === 'editer'
                ? 'text-white font-bold'
                : 'text-[#c4b5fd]/70 hover:text-white'
            }`}
          >
            <Scissors className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Éditer</span>
          </button>

          {/* 2. Modèles */}
          <button
            onClick={() => {
              setActiveBottomTab('modeles');
              onNavigate('modeles');
            }}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
              activeBottomTab === 'modeles'
                ? 'text-white font-bold'
                : 'text-[#c4b5fd]/70 hover:text-white'
            }`}
          >
            <Layers className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Modèles</span>
          </button>

          {/* 3. Labo d'IA (Active by default matching Image 2) */}
          <button
            onClick={() => setActiveBottomTab('labo')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
              activeBottomTab === 'labo'
                ? 'text-white font-bold'
                : 'text-[#c4b5fd]/70 hover:text-white'
            }`}
          >
            <Sparkles className="w-5 h-5 mb-0.5 text-[#8B70FF]" />
            <span className="text-[10px] text-[#8B70FF] font-bold">Labo d'IA</span>
          </button>

          {/* 4. Boîte de réception */}
          <button
            onClick={() => {
              setActiveBottomTab('inbox');
              onNavigate('chat');
            }}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
              activeBottomTab === 'inbox'
                ? 'text-white font-bold'
                : 'text-[#c4b5fd]/70 hover:text-white'
            }`}
          >
            <Bell className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Boîte</span>
          </button>

          {/* 5. Moi */}
          <button
            onClick={() => {
              setActiveBottomTab('moi');
              onNavigate('profil');
            }}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
              activeBottomTab === 'moi'
                ? 'text-white font-bold'
                : 'text-[#c4b5fd]/70 hover:text-white'
            }`}
          >
            <User className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Moi</span>
          </button>
        </div>
      </div>

      {/* Modal Remix Detail */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1b143c] border border-[#5A33FF66] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#201844] text-purple-300 border border-purple-500/40">
                {selectedTemplate.tag} · {selectedTemplate.views} vues
              </span>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="text-xs text-[#c4b5fd] hover:text-white underline"
              >
                Fermer
              </button>
            </div>

            <div className="text-lg font-extrabold text-white">
              {selectedTemplate.title}
            </div>

            <div className="bg-[#140e2d] p-3.5 rounded-2xl border border-[#5A33FF33] text-xs leading-relaxed text-[#c4b5fd]">
              <strong className="text-white block mb-1">Prompt du modèle :</strong>
              {selectedTemplate.prompt}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="px-4 py-2 rounded-xl bg-[#231a4a] hover:bg-[#2e2260] text-xs font-semibold text-white transition"
              >
                Annuler
              </button>
              <button
                onClick={() => handleConfirmRemix(selectedTemplate)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:from-[#2a24bf] hover:to-[#7048ff] text-xs font-bold text-white transition flex items-center gap-1.5 shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                <span>Remixer dans Andrea</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1b143c] border border-[#5A33FF66] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>Historique des créations</span>
              </h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-xs text-[#c4b5fd] hover:text-white underline"
              >
                Fermer
              </button>
            </div>
            <div className="space-y-2 text-xs text-[#c4b5fd]">
              <div className="p-3 rounded-xl bg-[#140e2d] border border-[#5A33FF22]">
                <div className="font-bold text-white">Shooting Mode & Piscine</div>
                <div className="text-[11px] text-[#c4b5fd]/70">Généré il y a 2 heures · 00:11</div>
              </div>
              <div className="p-3 rounded-xl bg-[#140e2d] border border-[#5A33FF22]">
                <div className="font-bold text-white">Hook Vidéo Orange Dad</div>
                <div className="text-[11px] text-[#c4b5fd]/70">Généré hier · 01:24</div>
              </div>
            </div>
            <button
              onClick={() => setShowHistoryModal(false)}
              className="w-full py-2 rounded-xl bg-[#231a4a] text-xs font-bold text-white"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
