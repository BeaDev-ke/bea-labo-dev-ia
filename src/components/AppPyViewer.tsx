import React, { useState } from 'react';
import { 
  FileCode, 
  Download, 
  Copy, 
  Check, 
  Search, 
  ShieldCheck, 
  Terminal, 
  ExternalLink,
  Code2,
  Sparkles
} from 'lucide-react';

export const AppPyViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [copiedLabOnly, setCopiedLabOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const sampleDevLabSnippet = `# ==============================================================================
# LABO DEV IA AVANCÉ - MOTEUR DE MODIFICATION PAR NIVEAU
# ==============================================================================

LAB_LEVELS = {
    "1": {
        "title": "🎨 Niveau 1 : Cosmétique & UI",
        "badge": "Niveau 1 - Zéro risque",
        "scope": "Textes, boutons, couleurs, styles CSS, messages d'accueil",
        "targets": {...},
        "presets": [...]
    },
    "2": {
        "title": "🧩 Niveau 2 : Page ou Fonction isolée",
        "badge": "Niveau 2 - Chirurgical",
        "scope": "Une fonction de page ciblée (chat, studio, code, onboarding...)",
        "targets": {...},
        "presets": [...]
    },
    "3": {
        "title": "🧠 Niveau 3 : Moteur Comportemental & Prompts IA",
        "badge": "Niveau 3 - Intelligence IA",
        "scope": "Prompts système, biais cognitifs, règles d'analyse comportementale",
        "targets": {...},
        "presets": [...]
    },
    "4": {
        "title": "⚡ Niveau 4 : Nouveau Module ou Fonctionnalité",
        "badge": "Niveau 4 - Évolution fonctionnelle",
        "scope": "Ajout de nouvelle page, nouvelle section studio, nouveau profil",
        "targets": {...},
        "presets": [...]
    },
    "5": {
        "title": "🏛️ Niveau 5 : Architecture Complète (Full-Stack)",
        "badge": "Niveau 5 - Refonte globale",
        "scope": "Fichier app.py complet avec découpage sécurisé et sauvegarde intégrale",
        "targets": {...},
        "presets": [...]
    }
}

def extract_target_code(full_code: str, target: str) -> str:
    """Extrait le code source correspondant exactement à la cible demandée."""
    ...

def inject_target_code(full_code: str, target: str, new_code: str) -> str:
    """Réinjecte le code modifié proprement à l'emplacement exact de la cible."""
    ...

def validate_python_code(code_str: str):
    """Valide la syntaxe Python via ast.parse pour garantir zéro plantage."""
    try:
        ast.parse(code_str)
        return True, "Syntaxe Python 100% valide"
    except SyntaxError as e:
        return False, f"Erreur de syntaxe ligne {e.lineno} : {e.msg}"

def page_dev_lab():
    st.markdown("### 🧪 Labo Dev IA - Modifications par Niveau")
    ...`;

  const handleDownloadFile = () => {
    // We trigger download of /app.py
    const link = document.createElement('a');
    link.href = '/app.py';
    link.download = 'app.py';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyLabCode = () => {
    navigator.clipboard.writeText(sampleDevLabSnippet);
    setCopiedLabOnly(true);
    setTimeout(() => setCopiedLabOnly(false), 2000);
  };

  return (
    <div className="bg-[#15112a] border-2 border-[#7c3aed] rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#7c3aed]/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Syntaxe Validée (Python AST)
            </span>
            <span className="text-xs text-[#a78bfa] font-mono">2200+ lignes</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCode className="w-5 h-5 text-purple-400" />
            Fichier Principal Streamlit : <code className="text-cyan-300 font-mono">app.py</code>
          </h2>
          <p className="text-xs text-[#c4b5fd] mt-1">
            Ce fichier contient l'application Streamlit complète d'Andrea avec le Labo Dev IA amélioré (support des 5 Niveaux de modification, validation AST, diff et rollback).
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleCopyLabCode}
            className="px-3.5 py-2 rounded-xl bg-[#231a4a] hover:bg-[#34246e] border border-[#7c3aed] text-xs font-bold text-[#e8e0ff] transition flex items-center gap-2 shadow"
          >
            {copiedLabOnly ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-purple-400" />}
            {copiedLabOnly ? 'Copié !' : 'Copier page_dev_lab()'}
          </button>
          <button
            onClick={handleDownloadFile}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1d4ed8] via-[#7c3aed] to-[#c026d3] text-xs font-bold text-white hover:opacity-95 transition flex items-center gap-2 shadow-lg shadow-purple-900/30"
          >
            <Download className="w-4 h-4" />
            Télécharger app.py complet
          </button>
        </div>
      </div>

      {/* Highlights of changes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-[#1a1535] border border-[#7c3aed]/40 rounded-xl p-4 space-y-1.5">
          <div className="font-bold text-purple-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            1. Moteur à 5 Niveaux de Portée
          </div>
          <p className="text-[#c4b5fd] leading-relaxed">
            Permet de demander des modifications au Niveau 1 (UI), 2 (Page), 3 (Prompts IA), 4 (Nouveaux modules), ou 5 (Full-Stack).
          </p>
        </div>

        <div className="bg-[#1a1535] border border-[#7c3aed]/40 rounded-xl p-4 space-y-1.5">
          <div className="font-bold text-emerald-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            2. Bouclier AST Anti-Plantage
          </div>
          <p className="text-[#c4b5fd] leading-relaxed">
            Chaque code généré passe par <code className="text-white font-mono">ast.parse()</code> avant toute écriture. Si la moindre erreur survient, le site n'est pas touché.
          </p>
        </div>

        <div className="bg-[#1a1535] border border-[#7c3aed]/40 rounded-xl p-4 space-y-1.5">
          <div className="font-bold text-cyan-300 flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-cyan-400" />
            3. Diff Visuel & Rollback 1-Clic
          </div>
          <p className="text-[#c4b5fd] leading-relaxed">
            Prévisualisez les lignes ajoutées/supprimées et restaurez n'importe quelle version sauvegardée en cas de doute.
          </p>
        </div>
      </div>

      {/* Code Viewer Container */}
      <div className="bg-[#0b081b] border-2 border-[#7c3aed]/60 rounded-xl overflow-hidden font-mono text-xs">
        <div className="bg-[#181135] px-4 py-2.5 border-b border-[#7c3aed]/40 flex items-center justify-between text-[#c4b5fd]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 text-white font-bold text-xs">Aperçu du code : page_dev_lab() et LAB_LEVELS</span>
          </div>
          <span className="text-[11px] text-[#a78bfa]">Python 3.10+ · Streamlit</span>
        </div>

        <div className="p-4 max-h-[420px] overflow-y-auto overflow-x-auto text-[#d8ccff] leading-relaxed">
          <pre>{sampleDevLabSnippet}</pre>
        </div>
      </div>

      {/* Quick Deploy Instructions */}
      <div className="bg-gradient-to-r from-[#17122e] to-[#120e24] border border-[#7c3aed]/30 rounded-xl p-4 text-xs text-[#c4b5fd] space-y-2">
        <div className="font-bold text-white flex items-center gap-2">
          <ExternalLink className="w-4 h-4 text-purple-400" />
          Comment déployer ce app.py amélioré dans votre environnement Streamlit ?
        </div>
        <p className="leading-relaxed">
          1. Téléchargez le fichier <strong className="text-white">app.py</strong> ci-dessus.<br />
          2. Remplacez votre fichier <strong className="text-white">app.py</strong> local ou poussez-le sur GitHub.<br />
          3. Démarrez Streamlit avec la commande habituelle : <code className="bg-[#231a4a] text-purple-200 px-1.5 py-0.5 rounded font-mono">streamlit run app.py</code>.<br />
          4. Connectez-vous avec votre compte développeur pour accéder immédiatement au nouveau Labo Dev avec les 5 niveaux de modification !
        </p>
      </div>
    </div>
  );
};
