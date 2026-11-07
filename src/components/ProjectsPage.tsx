import React, { useState } from 'react';
import {
  FolderArchive,
  Film,
  Code,
  Globe,
  Scissors,
  Download,
  Trash2,
  ExternalLink,
  Plus
} from 'lucide-react';
import { CodeProject } from '../types';

export const ProjectsPage: React.FC<{ onOpenApp?: () => void; onOpenMontage?: () => void }> = ({
  onOpenApp,
  onOpenMontage,
}) => {
  const [projects, setProjects] = useState<CodeProject[]>([
    {
      id: 'p_1',
      title: 'Campagne Rétention TikTok (Wan 2.1)',
      language: 'video 9:16',
      updatedAt: 'Il y a 20 min',
      code: 'Accroche virale + Caméra Orbit 360° + Voix F5-TTS + Whisper SRT',
    },
    {
      id: 'p_2',
      title: 'SaaS Analytics Dashboard',
      language: 'html/tailwind',
      updatedAt: 'Hier 16:30',
      code: 'Application autonome un fichier avec métriques de productivité',
    },
    {
      id: 'p_3',
      title: 'Script Ingestion Streaming',
      language: 'python',
      updatedAt: '03 nov. 2026',
      code: 'def process_stream_data(events): ...',
    },
  ]);

  const handleDelete = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#1A1930] border border-[#5A33FF44] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8B70FF] uppercase tracking-wider mb-1">
            <FolderArchive className="w-4 h-4" />
            <span>Gestion de Projets & Exports</span>
          </div>
          <h2 className="text-2xl font-black text-white">Vos Réalisations</h2>
          <p className="text-xs text-slate-300 mt-1">
            Retrouvez tous vos scripts de code, applications web autonomes et montages vidéo générés.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenApp && (
            <button
              onClick={onOpenApp}
              className="px-3.5 py-2 bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:from-[#2521a8] hover:to-[#6a44ff] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Créer une App Web</span>
            </button>
          )}
          {onOpenMontage && (
            <button
              onClick={onOpenMontage}
              className="px-3.5 py-2 bg-[#201844] hover:bg-[#2c2060] border border-[#5A33FF44] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Scissors className="w-3.5 h-3.5 text-sky-400" />
              <span>Menu Montage</span>
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((proj) => {
          const isVideo = proj.language.includes('video');
          const isWeb = proj.language.includes('html');

          return (
            <div
              key={proj.id}
              className="p-6 rounded-2xl bg-[#14132b] border border-[#5A33FF33] flex flex-col justify-between hover:border-[#5A33FF66] transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#201844] border border-[#5A33FF44] flex items-center justify-center">
                    {isVideo ? (
                      <Film className="w-5 h-5 text-indigo-400" />
                    ) : isWeb ? (
                      <Globe className="w-5 h-5 text-sky-400" />
                    ) : (
                      <Code className="w-5 h-5 text-emerald-400" />
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">{proj.updatedAt}</span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-[#8B70FF] transition-colors">
                  {proj.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {proj.code}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#5A33FF22] flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-[#c4b5fd] uppercase">
                  {proj.language}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(proj.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-[#201844] transition-colors cursor-pointer"
                    title="Supprimer le projet"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
