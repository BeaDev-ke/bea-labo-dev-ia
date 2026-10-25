import React, { useState } from 'react';
import { 
  Globe, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  User, 
  CreditCard, 
  Layers, 
  Brain, 
  Zap, 
  Lock, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, SupportedLanguageCode } from '../types/bea';

interface VisitorLandingProps {
  onEnterApp: () => void;
  onOpenLab: () => void;
}

const TRANSLATIONS: Record<SupportedLanguageCode, {
  tagline: string;
  subtagline: string;
  ctaConnect: string;
  ctaDiscover: string;
  ctaOffers: string;
  aboutTitle: string;
  aboutText: string;
  offersTitle: string;
  offersSubtitle: string;
  guaranteeText: string;
}> = {
  fr: {
    tagline: 'L\'IA d\'analyse comportementale qui transforme l\'intention en action régulière.',
    subtagline: 'Clarifiez vos blocages, comprenez vos mécanismes décisionnels et avancez chaque jour sans procrastination.',
    ctaConnect: 'Se connecter à Andrea',
    ctaDiscover: 'Tester la discussion',
    ctaOffers: 'Voir les offres & tarifs',
    aboutTitle: 'Une intelligence pensée pour votre progression réelle',
    aboutText: 'BehaviorLab AI conçoit des technologies comportementales appliquées. Nous analysons les frictions psychologiques, le modèle de Fogg et les habitudes pour vous amener au résultat mesurable.',
    offersTitle: 'Choisissez votre accompagnement',
    offersSubtitle: 'Formules simples, sans engagement, conçues pour accélérer vos résultats.',
    guaranteeText: 'Sécurité maximale · Données privées chiffrées · Annulable à tout moment',
  },
  en: {
    tagline: 'The behavioral AI that turns intention into daily, compounding momentum.',
    subtagline: 'Identify mental friction, understand your decision patterns, and execute without procrastination.',
    ctaConnect: 'Sign in to Andrea',
    ctaDiscover: 'Try the conversation',
    ctaOffers: 'View Plans & Pricing',
    aboutTitle: 'Artificial Intelligence designed for tangible progress',
    aboutText: 'BehaviorLab AI builds applied behavioral science engines. We diagnose cognitive friction, apply Fogg behavior design, and deliver practical daily breakthroughs.',
    offersTitle: 'Select your progress tier',
    offersSubtitle: 'Transparent plans, zero lock-in, engineered for real execution.',
    guaranteeText: 'AST Protected · Privacy-first encryption · Cancel anytime',
  },
  es: {
    tagline: 'La IA de análisis conductual que convierte la intención en acción constante.',
    subtagline: 'Clarifica tus bloqueos, supera la procrastinación y avanza paso a paso con rigor científico.',
    ctaConnect: 'Iniciar sesión en Andrea',
    ctaDiscover: 'Probar la conversación',
    ctaOffers: 'Ver planes y precios',
    aboutTitle: 'Inteligencia diseñada para tu progreso medible',
    aboutText: 'BehaviorLab AI combina la psicología conductual y modelos de IA avanzados para eliminar la fricción mental.',
    offersTitle: 'Elige tu nivel de acompañamiento',
    offersSubtitle: 'Sin permanencia, diseñado para multiplicar tus resultados.',
    guaranteeText: 'Máxima seguridad · Datos cifrados · Cancelación flexible',
  },
  de: {
    tagline: 'Die verhaltensbasierte KI, die Absicht in tägliche Umsetzung verwandelt.',
    subtagline: 'Blockaden erkennen, kognitive Reibung abbauen und nachhaltige Gewohnheiten etablieren.',
    ctaConnect: 'Bei Andrea anmelden',
    ctaDiscover: 'Gespräch testen',
    ctaOffers: 'Angebote & Preise ansehen',
    aboutTitle: 'Künstliche Intelligenz für messbare Fortschritte',
    aboutText: 'BehaviorLab AI verbindet Verhaltensökonomie mit Spitzen-KI zur sofortigen Beseitigung von Prokrastination.',
    offersTitle: 'Wählen Sie Ihre Betreuung',
    offersSubtitle: 'Transparente Tarife, jederzeit kündbar, auf Ergebnisse fokussiert.',
    guaranteeText: 'Höchste Datensicherheit · Verschlüsselt · Keine Bindung',
  },
  pt: {
    tagline: 'A IA comportamental que transforma intenção em ação consistente diária.',
    subtagline: 'Esclareça bloqueios mentais, supere a procrastinação e avance com métodos validados.',
    ctaConnect: 'Entrar na Andrea',
    ctaDiscover: 'Experimentar o chat',
    ctaOffers: 'Ver planos e preços',
    aboutTitle: 'Inteligência focada em resultados reais',
    aboutText: 'A BehaviorLab AI aplica modelos de hábitos e gatilhos de ação para desbloquear seu potencial diário.',
    offersTitle: 'Escolha seu plano',
    offersSubtitle: 'Planos flexíveis para criadores, estudantes e profissionais.',
    guaranteeText: 'Segurança total · Dados privados · Cancele quando quiser',
  },
  it: {
    tagline: 'L\'IA comportamentale che trasforma l\'intenzione in azione quotidiana.',
    subtagline: 'Supera la procrastinazione, comprendi le tue decisioni e costruisci abitudini solide.',
    ctaConnect: 'Accedi a Bea',
    ctaDiscover: 'Prova la conversazione',
    ctaOffers: 'Piani e tariffe',
    aboutTitle: 'Intelligenza artificiale per il progresso tangibile',
    aboutText: 'BehaviorLab AI integra neuroscienze decisionali e LLM moderni per sbloccare ogni progetto.',
    offersTitle: 'Scegli la tua formula',
    offersSubtitle: 'Zero vincoli, massima efficacia per i tuoi traguardi.',
    guaranteeText: 'Dati protetti · Privacy totale · Disdetta facile',
  },
  nl: {
    tagline: 'De gedrags-AI die intentie omzet in dagelijkse concrete vooruitgang.',
    subtagline: 'Doorbreek uitstelgedrag en bereik consistente resultaten met bewezen methodes.',
    ctaConnect: 'Inloggen bij Andrea',
    ctaDiscover: 'Probeer het gesprek',
    ctaOffers: 'Bekijk abonnementen',
    aboutTitle: 'AI ontwikkeld voor meetbare groei',
    aboutText: 'BehaviorLab AI bouwt gedragstechnologieën die mentale weerstand direct omzetten in actie.',
    offersTitle: 'Kies uw ondersteuning',
    offersSubtitle: 'Transparant, maandelijks opzegbaar, gericht op resultaat.',
    guaranteeText: 'Veiligheid gegarandeerd · Versleuteld · Eenvoudig opzegbaar',
  },
  ar: {
    tagline: 'الذكاء الاصطناعي السلوكي الذي يحول النية إلى إنجاز يومي ملموس.',
    subtagline: 'تغلب على التسويف، وافهم معوقاتك النفسية، وحقق أهدافك خطوة بخطوة.',
    ctaConnect: 'تسجيل الدخول إلى Andrea',
    ctaDiscover: 'تجربة المحادثة',
    ctaOffers: 'عرض الخطط والأسعار',
    aboutTitle: 'ذكاء اصطناعي مكرس لتقدمك الحقيقي',
    aboutText: 'تطور BehaviorLab AI محركات سلوكية متقدمة قائمة على علم النفس العملي لمساعدتك في اتخاذ القرارات وتنفيذها.',
    offersTitle: 'اختر باقة المرافقة المناسبة',
    offersSubtitle: 'خطط واضحة بدون قيود مصممة لتسريع نجاحك.',
    guaranteeText: 'أمان كامل للبيانات · تشفير متقدم · إلغاء في أي وقت',
  },
  zh: {
    tagline: '将意图转化为每日持续行动的行为分析人工智能。',
    subtagline: '清晰识别行动阻力，破解拖延症，以科学方法稳步达成目标。',
    ctaConnect: '登录 Andrea',
    ctaDiscover: '体验对话',
    ctaOffers: '查看方案与价格',
    aboutTitle: '专为实际进步打造的人工智能',
    aboutText: 'BehaviorLab AI 融合行为心理学与尖端大语言模型，帮助个人与企业实现高效决策与落地。',
    offersTitle: '选择适合您的方案',
    offersSubtitle: '无约束透明计费，专注于助您取得实质突破。',
    guaranteeText: '银行级安全保护 · 数据隐私加密 · 随时可退订',
  },
  ja: {
    tagline: '意思を行動へと変え、毎日の前進を支える行動科学AI。',
    subtagline: '先延ばしを克服し、意思決定の摩擦を解消して着実に成果を積み上げます。',
    ctaConnect: 'Andrea にログイン',
    ctaDiscover: '会話を試す',
    ctaOffers: '料金プランを見る',
    aboutTitle: '真の成果のために設計されたインテリジェンス',
    aboutText: 'BehaviorLab AI は行動科学と最先端AIを融合し、日常の習慣形成と目標達成を支援します。',
    offersTitle: 'プランをお選びください',
    offersSubtitle: '縛りなし、いつでも解約可能、結果に直結するサポート。',
    guaranteeText: '堅牢なセキュリティ · 完全なプライバシー · いつでも解約可能',
  },
  ko: {
    tagline: '의도를 매일의 실천으로 전환하는 행동 분석 인공지능.',
    subtagline: '미루는 습관을 극복하고, 인지적 마찰을 줄여 한 단계씩 확실하게 성장하세요.',
    ctaConnect: 'Andrea 로그인',
    ctaDiscover: '대화 체험하기',
    ctaOffers: '요금제 및 혜택 확인',
    aboutTitle: '실질적인 성장을 위해 설계된 AI',
    aboutText: 'BehaviorLab AI는 행동 심리학 프레임워크를 기반으로 목표를 실행 가능한 습관으로 바꿉니다.',
    offersTitle: '원하는 플랜을 선택하세요',
    offersSubtitle: '위약금 없는 투명한 가격, 결과를 위한 최고의 파트너.',
    guaranteeText: '데이터 암호화 보호 · 강력한 보안 · 언제든 해지 가능',
  },
  ru: {
    tagline: 'Поведенческий ИИ, превращающий намерения в ежедневные измеримые действия.',
    subtagline: 'Преодолейте прокрастинацию, выявите скрытые барьеры и двигайтесь вперед каждый день.',
    ctaConnect: 'Войти в Andrea',
    ctaDiscover: 'Попробовать диалог',
    ctaOffers: 'Тарифы и возможности',
    aboutTitle: 'Искусственный интеллект для реального прогресса',
    aboutText: 'BehaviorLab AI объединяет поведенческую психологию и передовые модели для устранения трения при принятии решений.',
    offersTitle: 'Выберите подходящий тариф',
    offersSubtitle: 'Без скрытых условий, нацелено на максимальный результат.',
    guaranteeText: 'Полная конфиденциальность · Надежная защита · Отмена в любой момент',
  },
  hi: {
    tagline: 'व्यवहार विश्लेषण एआई जो विचारों को दैनिक क्रियान्वयन में बदलता है।',
    subtagline: 'टालमटोल पर काबू पाएं, मानसिक बाधाओं को पहचानें और हर दिन आगे बढ़ें।',
    ctaConnect: 'Andrea में लॉग इन करें',
    ctaDiscover: 'बातचीत आज़माएं',
    ctaOffers: 'ऑफ़र और मूल्य देखें',
    aboutTitle: 'वास्तविक प्रगति के लिए निर्मित बुद्धिमत्ता',
    aboutText: 'BehaviorLab AI निर्णय लेने और आदतों को सुदृढ़ करने के लिए व्यावहारिक व्यवहार विज्ञान का उपयोग करता है।',
    offersTitle: 'अपनी योजना चुनें',
    offersSubtitle: 'पारदर्शी और सरल, आपकी सफलता को गति देने के लिए डिज़ाइन किया गया।',
    guaranteeText: 'सुरक्षित डेटा · एन्क्रिप्टेड गोपनीयता · कभी भी रद्द करें',
  },
  tr: {
    tagline: 'Niyeti günlük istikrarlı eyleme dönüştüren davranışsal yapay zekâ.',
    subtagline: 'Ertelemeyi bırakın, karar engellerinizi aşın ve hedeflerinize emin adımlarla ilerleyin.',
    ctaConnect: 'Bea\'ya Giriş Yap',
    ctaDiscover: 'Sohbeti Dene',
    ctaOffers: 'Planları ve Fiyatları Gör',
    aboutTitle: 'Gerçek ilerlemeniz için tasarlanmış teknoloji',
    aboutText: 'BehaviorLab AI, karar süreçlerini ve eyleme geçişi kolaylaştıran davranışsal bilim modelleri geliştirir.',
    offersTitle: 'Destek seviyenizi seçin',
    offersSubtitle: 'Taahhütsüz, sonuç odaklı ve esnek paketler.',
    guaranteeText: 'Tam güvenlik · Şifrelenmiş gizlilik · İstediğiniz an iptal',
  },
  wo: {
    tagline: 'Xam-xam bu xel miy soppi sa yéene def ko jëf ju teey bu bés bu nekk.',
    subtagline: 'Dindi ay jafe-jafe, fexee baña teel a tàbbi ci liggéey bi te yokk sa doole.',
    ctaConnect: 'Dugg ci Andrea',
    ctaDiscover: 'Jéem waxtaan wi',
    ctaOffers: 'Xool paj yi ak njëg yi',
    aboutTitle: 'Xel mu xereñ ngir sa kanam gu wér',
    aboutText: 'BehaviorLab AI dafay lëkkale xam-xamu jiko yi ak xarala yu yees yi ngir dimbali la nga gaaw a jëfe li nga bëgg.',
    offersTitle: 'Tànnal paju li nga soxla',
    offersSubtitle: 'Ay njëg yu yomb, te amul benn tënk, ngir yombal sa liggéey.',
    guaranteeText: 'Kaarange bu mat sëkk · Sa mbóot lañuy aar · Mën nga ko dakkal saa yoo bëggee',
  },
};

export const VisitorLanding: React.FC<VisitorLandingProps> = ({ onEnterApp, onOpenLab }) => {
  const [selectedLang, setSelectedLang] = useState<SupportedLanguageCode>('fr');
  const [activeSidebarTab, setActiveSidebarTab] = useState<'home' | 'offers' | 'about' | 'login'>('home');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authSuccessNotice, setAuthSuccessNotice] = useState('');

  const t = TRANSLATIONS[selectedLang] || TRANSLATIONS.fr;

  const handleSimulateLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) return;
    setAuthSuccessNotice(`Authentification réussie pour ${loginEmail}. Redirection vers Andrea...`);
    setTimeout(() => {
      onEnterApp();
    }, 700);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[750px] bg-[#121214] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl text-white">
      {/* 1. LEFT SIDEBAR (OFFRES & BEHAVIORLAB AI À GAUCHE) */}
      <aside className="w-full md:w-72 bg-[#18181b] border-b md:border-b-0 md:border-r border-zinc-800 p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 border border-zinc-700 flex items-center justify-center font-black text-xl shadow-md">
              B
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                <span>Andrea</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                  IA
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 font-medium">
                BehaviorLab AI
              </div>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <nav className="space-y-1.5">
            <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider px-2 py-1">
              Navigation Visiteur
            </div>

            <button
              onClick={() => setActiveSidebarTab('home')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition ${
                activeSidebarTab === 'home'
                  ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
              }`}
            >
              <Sparkles className="w-4 h-4 text-zinc-300" />
              <span>Accueil & Découverte</span>
            </button>

            {/* BOUTON OFFRES À GAUCHE */}
            <button
              onClick={() => setActiveSidebarTab('offers')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition ${
                activeSidebarTab === 'offers'
                  ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
              }`}
            >
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>💎 Offres & Tarifs</span>
            </button>

            {/* BOUTON BEHAVIORLAB AI À GAUCHE */}
            <button
              onClick={() => setActiveSidebarTab('about')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition ${
                activeSidebarTab === 'about'
                  ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
              }`}
            >
              <Brain className="w-4 h-4 text-purple-400" />
              <span>🧠 BehaviorLab AI (Vision)</span>
            </button>

            <button
              onClick={() => setActiveSidebarTab('login')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition ${
                activeSidebarTab === 'login'
                  ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
              }`}
            >
              <Lock className="w-4 h-4 text-blue-400" />
              <span>🔑 Connexion / Inscription</span>
            </button>
          </nav>

          {/* Sélecteur de toutes les langues des modèles IA */}
          <div className="pt-2 border-t border-zinc-800 space-y-2">
            <label className="text-[11px] font-bold text-zinc-400 flex items-center gap-1.5 px-1">
              <Globe className="w-3.5 h-3.5 text-zinc-400" />
              <span>Langue ({SUPPORTED_LANGUAGES.length} langues IA) :</span>
            </label>
            <select
              value={selectedLang}
              onChange={e => setSelectedLang(e.target.value as SupportedLanguageCode)}
              className="w-full bg-[#212121] border border-zinc-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-zinc-500 font-medium"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
            <div className="text-[10px] text-zinc-500 px-1">
              Traduction temps réel par les modèles haute vitesse Andrea.
            </div>
          </div>
        </div>

        {/* Bottom Actions & Shield Badge */}
        <div className="pt-6 border-t border-zinc-800 space-y-3">
          <button
            onClick={onEnterApp}
            className="w-full py-2.5 px-3 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Entrer dans Andrea (Prod)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenLab}
            className="w-full py-2 px-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-medium transition flex items-center justify-center gap-2"
          >
            <span>🧪 Ouvrir le Labo Dev</span>
          </button>

          <div className="flex items-center justify-between text-[10px] text-zinc-500 px-1 pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>AST Shield Vérifié</span>
            </span>
            <span>v2.8 Stable</span>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA (CONTENU DYNAMIQUE DU SITE VISITEUR) */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* TAB: ACCUEIL & DÉCOUVERTE */}
        {activeSidebarTab === 'home' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in">
            <div className="space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700 text-zinc-300 text-xs font-semibold">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>BehaviorLab AI · Système d'Analyse Comportementale</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                {t.tagline}
              </h1>

              <p className="text-base text-zinc-400 leading-relaxed max-w-2xl">
                {t.subtagline}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onEnterApp}
                className="px-6 py-3 rounded-2xl bg-white text-black font-bold text-sm hover:bg-zinc-200 transition flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95"
              >
                <span>{t.ctaDiscover}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveSidebarTab('offers')}
                className="px-6 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-semibold text-sm transition"
              >
                {t.ctaOffers}
              </button>
            </div>

            {/* Feature Matrix Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-5 space-y-2 hover:border-zinc-700 transition">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-lg">
                  🎯
                </div>
                <h3 className="font-bold text-sm text-white">Zéro Flou & 5 Étapes</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Pas de bavardage générique : reformulation, blocages probables, leviers et 3 actions immédiates pour aujourd'hui.
                </p>
              </div>

              <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-5 space-y-2 hover:border-zinc-700 transition">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-lg">
                  🧠
                </div>
                <h3 className="font-bold text-sm text-white">Psychologie des Biais</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Diagnostic des blocages selon BJ Fogg (Motivation × Capacité × Déclencheur) et contre-poisons cognitifs.
                </p>
              </div>

              <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-5 space-y-2 hover:border-zinc-700 transition">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-lg">
                  🌐
                </div>
                <h3 className="font-bold text-sm text-white">Bâtisseur Web & Studio</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Génération instantanée de pages web persuasives et studio de design visuel adaptés à vos conversions.
                </p>
              </div>
            </div>

            {/* Trust Footer */}
            <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl flex items-center justify-between text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{t.guaranteeText}</span>
              </div>
              <span className="font-mono text-[11px] text-zinc-500">saydoukebe31@gmail.com</span>
            </div>
          </div>
        )}

        {/* TAB: OFFRES & TARIFS (DÉCLENCHÉ PAR LE BOUTON À GAUCHE) */}
        {activeSidebarTab === 'offers' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
            <div className="text-center md:text-left space-y-1.5">
              <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                💎 Tarification BehaviorLab AI
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white">{t.offersTitle}</h2>
              <p className="text-xs text-zinc-400">{t.offersSubtitle}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Plan 1: Gratuit */}
              <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-white">Gratuit</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">Démarrage</span>
                  </div>
                  <div className="text-3xl font-black text-white">0 €</div>
                  <p className="text-xs text-zinc-400 leading-relaxed">Accès essentiel pour poser vos premières questions et débloquer une situation.</p>
                  <ul className="space-y-1.5 text-xs text-zinc-300 pt-2 border-t border-zinc-800">
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Discussion comportementale</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Plan d'action en 5 étapes</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Dictée vocale gratuite</li>
                  </ul>
                </div>
                <button onClick={onEnterApp} className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition">
                  Continuer en Gratuit
                </button>
              </div>

              {/* Plan 2: Bea 9€ */}
              <div className="bg-[#18181b] border border-zinc-700 rounded-2xl p-5 flex flex-col justify-between space-y-4 relative">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-white">Andrea</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">Populaire</span>
                  </div>
                  <div className="text-3xl font-black text-white">9 € <span className="text-xs font-normal text-zinc-400">/mois</span></div>
                  <p className="text-xs text-zinc-400 leading-relaxed">Accompagnement comportemental régulier avec mémoire durable des habitudes.</p>
                  <ul className="space-y-1.5 text-xs text-zinc-300 pt-2 border-t border-zinc-800">
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> Tout le plan Gratuit</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> Mémoire sémantique continue</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> Suivi de la série (Streak)</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> Analyse de biais avancée</li>
                  </ul>
                </div>
                <button onClick={onEnterApp} className="w-full py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition shadow">
                  Choisir Andrea · 9 €
                </button>
              </div>

              {/* Plan 3: Andrea Pro 14.90€ */}
              <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-white">Andrea Pro</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">Créateurs & Études</span>
                  </div>
                  <div className="text-3xl font-black text-white">14,90 € <span className="text-xs font-normal text-zinc-400">/mois</span></div>
                  <p className="text-xs text-zinc-400 leading-relaxed">Pour créateurs de contenu, étudiants et indépendants en phase d'accélération.</p>
                  <ul className="space-y-1.5 text-xs text-zinc-300 pt-2 border-t border-zinc-800">
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Tout le plan Andrea</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Studio de design visuel</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Sous-titres Whisper SRT/VTT</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Accompagnement scolaire</li>
                  </ul>
                </div>
                <button onClick={onEnterApp} className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition">
                  Choisir Andrea Pro · 14,90 €
                </button>
              </div>

              {/* Plan 4: Andrea Ultra 16€ */}
              <div className="bg-[#18181b] border border-amber-500/40 rounded-2xl p-5 flex flex-col justify-between space-y-4 relative shadow-lg">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-white">Andrea Ultra</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">Full-Stack</span>
                  </div>
                  <div className="text-3xl font-black text-white">16 € <span className="text-xs font-normal text-zinc-400">/mois</span></div>
                  <p className="text-xs text-zinc-400 leading-relaxed">Accès complet illimité avec bâtisseur de site web et coach code Python/JS.</p>
                  <ul className="space-y-1.5 text-xs text-zinc-300 pt-2 border-t border-zinc-800">
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> Tout Andrea Pro</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> Bâtisseur de site web complet</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> Éditeur de code assisté</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> Zéro limite de messages</li>
                  </ul>
                </div>
                <button onClick={onEnterApp} className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition shadow">
                  Choisir Andrea Ultra · 16 €
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: BEHAVIORLAB AI (VISION & HISTOIRE DÉCLENCHÉ PAR LE BOUTON À GAUCHE) */}
        {activeSidebarTab === 'about' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in">
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-bold">
                🧠 Manifeste BehaviorLab AI
              </span>
              <h2 className="text-2xl md:text-4xl font-black text-white">
                {t.aboutTitle}
              </h2>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {t.aboutText}
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-zinc-800">
              <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-5 space-y-2">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <span>1. Pourquoi la majorité des outils IA échouent à vous faire avancer</span>
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Poser 10 questions avant d'aider crée de la surcharge cognitive. Andrea adopte une approche opposée : elle formule immédiatement des hypothèses explicites, propose une lecture claire des blocages et donne 3 actions concrètes pour aujourd'hui.
                </p>
              </div>

              <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-5 space-y-2">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <span>2. Le modèle BJ Fogg intégré</span>
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Le comportement est le résultat de la Motivation, de la Capacité (facilité d'action) et d'un Déclencheur au même instant. Lorsque la motivation chute, Andrea réduit drastiquement la friction pour que vous continuiez à avancer.
                </p>
              </div>

              <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-5 space-y-2">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <span>3. Confidentialité & Indépendance</span>
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Vos projets, vos données et vos analyses restent strictement confidentiels. Aucune revente de données, conformité RGPD intégrale et suppression en 1 clic.
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <button
                onClick={onEnterApp}
                className="px-6 py-3 rounded-2xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition flex items-center gap-2 shadow"
              >
                <span>Démarrer avec Andrea</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB: CONNEXION / INSCRIPTION */}
        {activeSidebarTab === 'login' && (
          <div className="max-w-md mx-auto py-6 space-y-6 animate-in fade-in">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto text-2xl">
                🔑
              </div>
              <h2 className="text-2xl font-black text-white">Espace Utilisateur Andrea</h2>
              <p className="text-xs text-zinc-400">Connectez-vous pour retrouver votre mémoire et vos projets.</p>
            </div>

            {authSuccessNotice && (
              <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{authSuccessNotice}</span>
              </div>
            )}

            <form onSubmit={handleSimulateLogin} className="bg-[#18181b] border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Adresse e-mail</label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  className="w-full bg-[#212121] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-300">Mot de passe</label>
                  <a href="#reset" onClick={e => { e.preventDefault(); alert('Lien de réinitialisation envoyé à votre adresse.'); }} className="text-[11px] text-zinc-400 hover:text-white underline">
                    Oublié ?
                  </a>
                </div>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#212121] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition shadow"
              >
                Continuer vers Andrea
              </button>

              <div className="text-center pt-2 text-xs text-zinc-500">
                Pas encore de compte ? Saisissez votre adresse ci-dessus pour le créer automatiquement.
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};
