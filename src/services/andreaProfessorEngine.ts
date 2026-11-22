import { AppLanguage, ChatMessage } from '../types';
import { renderPhototextToCanvas, sampleImageRegionColor } from './andreaSkillsService';

export type AndreaConversationStyle =
  | 'professeur'
  | 'jeu_creatif'
  | 'ludique'
  | 'concis'
  | 'socratique';

export interface ProfessorEngineContext {
  displayName: string;
  userProfile: string;
  language: AppLanguage;
  history: ChatMessage[];
  activeStyle: AndreaConversationStyle;
}

export interface ProfessorReply {
  text: string;
  nextStyle: AndreaConversationStyle;
}

const LANG_GREETING: Record<AppLanguage, { hello: string; askFollow: string; modeUpdated: string }> = {
  fr: {
    hello: 'Bonjour',
    askFollow: 'Souhaitez-vous que nous approfondissions un point précis, ou préférez-vous que j’adapte mon approche (plus ludique, plus technique, ou sous forme de défis) ?',
    modeUpdated: "J'ai ajusté mon style de réponse selon votre demande.",
  },
  en: {
    hello: 'Hello',
    askFollow: 'Would you like to dive deeper into any part of this, or should I adapt my teaching style (more playful, more concise, or interactive challenges)?',
    modeUpdated: 'I have adjusted my response style to match your request.',
  },
  es: {
    hello: 'Hola',
    askFollow: '¿Quieres profundizar en un punto concreto o prefieres que adapte mi estilo (más lúdico, más breve o con retos prácticos)?',
    modeUpdated: 'He ajustado mi estilo de respuesta según tu petición.',
  },
  de: {
    hello: 'Hallo',
    askFollow: 'Möchten Sie einen bestimmten Punkt vertiefen oder soll ich meinen Stil anpassen (spielerischer, kürzer oder interaktiver)?',
    modeUpdated: 'Ich habe meinen Antwortstil entsprechend angepasst.',
  },
  pt: {
    hello: 'Olá',
    askFollow: 'Gostaria de aprofundar algum ponto específico ou prefere que eu adapte o meu estilo (mais lúdico, mais direto ou com desafios)?',
    modeUpdated: 'Ajustei o meu estilo de resposta conforme o seu pedido.',
  },
  ar: {
    hello: 'مرحباً',
    askFollow: 'هل تود أن نتعمق في نقطة محددة، أم تفضل أن أغيّر أسلوبي ليكون أكثر متعة أو اختصاراً؟',
    modeUpdated: 'لقد قمت بتكييف أسلوب إجابتي وفقاً لطلبك.',
  },
};

function detectStyleShift(prompt: string, current: AndreaConversationStyle): AndreaConversationStyle {
  const lower = prompt.toLowerCase();
  if (
    lower.includes('idée de jeu') ||
    lower.includes('idées de jeu') ||
    lower.includes('idee de jeu') ||
    lower.includes('idees de jeu') ||
    lower.includes('game idea') ||
    lower.includes('créer un jeu') ||
    lower.includes('concept de jeu') ||
    lower.includes('jeu vidéo') ||
    lower.includes('jeu mobile')
  ) {
    return 'jeu_creatif';
  }
  if (
    lower.includes('ludique') ||
    lower.includes('amusant') ||
    lower.includes('quiz') ||
    lower.includes('joue') ||
    lower.includes('drôle')
  ) {
    return 'ludique';
  }
  if (
    lower.includes('plus court') ||
    lower.includes('résume') ||
    lower.includes('concis') ||
    lower.includes('synthétique') ||
    lower.includes('va droit au but')
  ) {
    return 'concis';
  }
  if (
    lower.includes('pose-moi des questions') ||
    lower.includes('challenge-moi') ||
    lower.includes('interroge-moi') ||
    lower.includes('socratique')
  ) {
    return 'socratique';
  }
  if (
    lower.includes('professeur') ||
    lower.includes('explique en détail') ||
    lower.includes('en profondeur') ||
    lower.includes('cours')
  ) {
    return 'professeur';
  }
  return current;
}

function getPreviousTopic(history: ChatMessage[]): string {
  const userMsgs = history.filter((m) => m.sender === 'user');
  if (userMsgs.length === 0) return '';
  return userMsgs[userMsgs.length - 1].text;
}

/**
 * Moteur de conversation d'Andrea en posture de professeur pédagogue
 * avec mémoire de conversation et adaptation dynamique de style.
 */
export function buildProfessorResponse(prompt: string, ctx: ProfessorEngineContext): ProfessorReply {
  const { displayName, userProfile, language, history, activeStyle } = ctx;
  const name = displayName.trim() || 'vous';
  const nextStyle = detectStyleShift(prompt, activeStyle);
  const lower = prompt.toLowerCase();
  const prevTopic = getPreviousTopic(history);
  const langPack = LANG_GREETING[language] || LANG_GREETING.fr;

  const isFollowUpNumber = /\b(1|2|3|premier|deuxième|troisième|celui|développe|approfondis|suite|continue)\b/i.test(
    lower
  );

  // Réponse en anglais si langue = en
  if (language === 'en') {
    if (nextStyle === 'jeu_creatif') {
      return {
        nextStyle,
        text:
          `${langPack.hello} ${name}, let's switch into interactive Game Design mode! Here are original game concepts built around strong player psychology rather than generic mechanics:\n\n` +
          `• **Echo Chronos (Memory & Rhythm Puzzle)** — Every action you take leaves a physical echo 3 seconds later that you must cooperate with to unlock doors. Core hook: tension between anticipation and timing.\n` +
          `• **Signal Lost (Asymmetric Social Deduction)** — One player transmits coded visual clues using only 4 minimalist shapes while others decode before the timer decays. Ideal for rapid social sessions.\n` +
          `• **Kinetic Forge (Physics Micro-Builder)** — Combine 3 simple materials under changing gravity rules every 20 seconds to protect a fragile core.\n\n` +
          `Which concept sparks your curiosity, ${name}? Tell me if you want me to detail the gameplay loop, adjust the genre, or prototype it directly in code.`,
      };
    }
    return {
      nextStyle,
      text:
        `${langPack.hello} ${name}. Let's examine « ${prompt.slice(0, 70)} » deeply, as we would in an applied masterclass.\n\n` +
        `Most challenges stall when people jump directly to surface tactics without examining the underlying mechanism. Whether your priority is ${userProfile} or creative execution, meaningful mastery starts by separating your **real objective** from the **habitual reflexes** that surround it.\n\n` +
        `Notice how each variable alters cognitive load and clarity: when you isolate a single bottleneck, observe the immediate cause-and-effect feedback on a small scale, and refine based on real reactions rather than assumptions, everything becomes far easier to steer.\n\n` +
        `${langPack.askFollow}`,
    };
  }

  // Réponse en espagnol si langue = es
  if (language === 'es') {
    if (nextStyle === 'jeu_creatif') {
      return {
        nextStyle,
        text:
          `${langPack.hello} ${name}, adapto mi enfoque para proponerte ideas originales de juego basadas en mecánicas memorables:\n\n` +
          `• **Eco Temporal** — Un juego de puzles donde tus movimientos de hace 4 segundos ayudan a tu versión actual a resolver salas.\n` +
          `• **Señal Oculta** — Deducción rápida por pistas visuales mínimas contra reloj.\n` +
          `• **Gravedad Variable** — Micro-construcción física donde las leyes cambian cada 20 segundos.\n\n` +
          `¿Cuál de estas ideas quieres desarrollar juntos, ${name}?`,
      };
    }
    return {
      nextStyle,
      text:
        `${langPack.hello} ${name}. Analicemos « ${prompt.slice(0, 70)} » con profundidad pedagógica.\n\n` +
        `Para dominar de verdad cualquier tema — incluso dentro de tu ámbito (${userProfile}) — conviene comprender primero el mecanismo invisible antes de aplicar técnicas aisladas. Cada decisión modifica la atención, la fricción y la respuesta real de quien tienes delante.\n\n` +
        `Si observas qué variable produce el mayor cambio real y pones a prueba una sola hipótesis medible hoy mismo, ganarás control sin sobrecargarte.\n\n` +
        `${langPack.askFollow}`,
    };
  }

  // Réponse en allemand si langue = de
  if (language === 'de') {
    if (nextStyle === 'jeu_creatif') {
      return {
        nextStyle,
        text:
          `${langPack.hello} ${name}, hier sind originelle Spielideen mit starker Spielmechanik:\n\n` +
          `• **Zeit-Echo** — Jede Bewegung hinterlässt nach 4 Sekunden ein physikalisches Echo, mit dem du gemeinsam Rätsel löst.\n` +
          `• **Verzerrtes Signal** — Schnelle soziale Deduktion mit nur vier Lichtsymbolen gegen die Zeit.\n\n` +
          `Welche Idee möchtest du weiter vertiefen, ${name}?`,
      };
    }
    return {
      nextStyle,
      text:
        `${langPack.hello} ${name}. Betrachten wir « ${prompt.slice(0, 70)} » gemeinsam mit akademischer Klarheit.\n\n` +
        `In fast jedem Bereich — auch rund um ${userProfile} — entstehen Durchbrüche erst dann, wenn wir das zugrunde liegende Prinzip verstehen, statt nur oberflächliche Rezepte anzuwenden. Achte auf das konkrete Ursache-Wirkungs-Verhältnis einer einzelnen Veränderung, bevor du weitere Faktoren hinzufügst.\n\n` +
        `${langPack.askFollow}`,
    };
  }

  // Réponse en portugais si langue = pt
  if (language === 'pt') {
    if (nextStyle === 'jeu_creatif') {
      return {
        nextStyle,
        text:
          `${langPack.hello} ${name}, aqui estão ideias originais de jogos focadas em psicologia de jogador:\n\n` +
          `• **Eco Cronos** — Um quebra-cabeça em que suas ações de 4 segundos atrás cooperam com você para abrir passagens.\n` +
          `• **Sinal Oculto** — Dedução rápida usando apenas quatro símbolos visuais mínimos.\n\n` +
          `Qual desses conceitos você gostaria de detalhar agora, ${name}?`,
      };
    }
    return {
      nextStyle,
      text:
        `${langPack.hello} ${name}. Vamos analisar « ${prompt.slice(0, 70)} » com rigor e clareza.\n\n` +
        `Em vez de seguir fórmulas rígidas, observe sempre a relação direta entre causa e efeito no seu contexto (${userProfile}): identifique o ponto exato de atrito, valide uma melhoria simples e analise a resposta real antes de escalar.\n\n` +
        `${langPack.askFollow}`,
    };
  }

  // Réponse en arabe si langue = ar
  if (language === 'ar') {
    if (nextStyle === 'jeu_creatif') {
      return {
        nextStyle,
        text:
          `${langPack.hello} ${name}، إليك أفكار ألعاب مبتكرة تعتمد على آليات ذكية:\n\n` +
          `• **صدى الزمن** — كل حركة تقوم بها تترك صدىً بعد ٤ ثوانٍ تتعاون معه لحل الألغاز.\n` +
          `• **إشارة مشفّرة** — لعبة استنتاج سريعة باستخدام أربعة رموز بصرية فقط.\n\n` +
          `أي فكرة تفضل أن نطوّرها معاً يا ${name}؟`,
      };
    }
    return {
      nextStyle,
      text:
        `${langPack.hello} ${name}. دعنا ندرس « ${prompt.slice(0, 70)} » بأسلوب تعليمي واضح ومتعمق.\n\n` +
        `لفهم أي موضوع بعمق — سواء في مجالك (${userProfile}) أو في المشاريع الإبداعية — نبدأ بفهم المبدأ الأساسي الذي يحرك النتيجة، ثم نختبر فرضية واحدة ملموسة لنلاحظ أثرها الفعلي قبل الانتقال للخطوة التالية.\n\n` +
        `${langPack.askFollow}`,
    };
  }

  // MODE JEU CRÉATIF / IDÉES DE JEU (adaptation demandée en conversation)
  if (nextStyle === 'jeu_creatif') {
    if (isFollowUpNumber && prevTopic) {
      return {
        nextStyle,
        text:
          `Excellente direction, ${name} ! Approfondissons cette piste ludique à la manière d'un cours de Game Design appliqué :\n\n` +
          `**Boucle principale (Core Loop) :**\n` +
          `Un bon jeu repose sur une boucle de 15 à 30 secondes claire : *Observer un indice → Prendre une décision risquée → Recevoir un retour visuel et sonore immédiat → Débloquer une nouvelle règle*.\n\n` +
          `**Équilibrage & Rétention :**\n` +
          `Au lieu d'ajouter des menus complexes, introduis une contrainte nouvelle toutes les 3 vagues (gravité inversée, champ de vision réduit ou chrono partagé). C'est ce contraste qui maintient la curiosité éveillée.\n\n` +
          `Veux-tu que je rédige le cahier des mécaniques complet, qu'on explore un autre univers (enquête, survie, coop), ou que je code un prototype jouable dès maintenant ?`,
      };
    }

    return {
      nextStyle,
      text:
        `Avec grand plaisir, ${name} ! J'adapte mon style en mode **Atelier d'Idées de Jeu & Game Design** pour te proposer des concepts originaux :\n\n` +
        `• **Écho Chronos (Puzzle & Mémoire)** — Chaque déplacement que tu effectues laisse un double fantôme 4 secondes plus tard. Tu dois collaborer avec ton propre passé pour actionner des leviers simultanément.\n` +
        `• **Signal Brouillé (Déduction Rapide / Multi)** — Un joueur voit la carte complète mais ne peut communiquer qu'avec 4 symboles lumineux ; les autres doivent décoder la sortie avant l'extinction du radar.\n` +
        `• **Atelier Instable (Physique & Réflexes)** — Construis une passerelle avec des matériaux légers pendant que la gravité change de direction toutes les 15 secondes.\n\n` +
        `Lequel de ces univers t'attire le plus, ${name} ? Tu peux aussi me préciser ton genre préféré (mobile, narration, multijoueur, éducatif) et j'ajusterai les propositions !`,
    };
  }

  // MODE CONCIS (si l'utilisateur a demandé d'être plus court)
  if (nextStyle === 'concis') {
    return {
      nextStyle,
      text:
        `${name}, voici l'essentiel de manière directe et condensée sur « ${prompt.slice(0, 60)} » :\n\n` +
        `Le cœur du sujet repose sur un mécanisme simple : isole la variable qui bloque réellement le résultat, teste une correction ciblée immédiatement, puis observe le retour factuel avant d'ajuster.\n\n` +
        `Dis-moi si tu veux développer un détail précis ou revenir à une explication complète et détaillée.`,
    };
  }

  // MODE SOCRATIQUE (si l'utilisateur veut être questionné / challengé)
  if (nextStyle === 'socratique') {
    return {
      nextStyle,
      text:
        `Très bien ${name}, passons en méthode socratique pour aiguiser ta réflexion sur « ${prompt.slice(0, 60)} » :\n\n` +
        `Avant de te livrer toute la réponse, posons deux questions décisives :\n` +
        `• Quel est l'élément exact que tu supposes vrai aujourd'hui, mais que tu n'as pas encore vérifié concrètement ?\n` +
        `• Si tu n'avais droit qu'à une seule action de 15 minutes pour prouver ton hypothèse, laquelle choisirais-tu ?\n\n` +
        `Réponds-moi librement, et je construirai la suite de la leçon à partir de ta réponse.`,
    };
  }

  // MODE LUDIQUE
  if (nextStyle === 'ludique') {
    return {
      nextStyle,
      text:
        `C'est parti ${name} ! Explorons « ${prompt.slice(0, 60)} » sous un angle ludique et imagé :\n\n` +
        `Imagine ton sujet comme un plateau de jeu où chaque obstacle est une énigme qui cache une règle secrète. En comprenant le *pourquoi* derrière la mécanique — plutôt que d'appliquer une recette figée — tu gagnes la capacité d'improviser dans n'importe quelle situation.\n\n` +
        `Tu veux qu'on transforme ce sujet en mini-défi pratique, en quiz interactif, ou en explication encore plus poussée ?`,
    };
  }

  // POSTURE PAR DÉFAUT : PROFESSEUR DÉTAILLÉ & PÉDAGOGUE (prose continue, jamais de plan en 3 étapes)
  if (isFollowUpNumber && prevTopic) {
    return {
      nextStyle: 'professeur',
      text:
        `Très bonne question de suivi, ${name}. Reprenons notre fil sur « ${prevTopic.slice(0, 50)} » pour entrer dans le détail mécanique.\n\n` +
        `Lorsque l'on observe ce phénomène de près, on remarque qu'il ne s'agit pas d'un simple réglage superficiel, mais d'une véritable relation de cause à effet. Chaque choix que vous faites modifie la charge cognitive, la lisibilité et l'engagement de la personne en face de vous. En formulant d'abord clairement votre intention, puis en l'appuyant sur un fait concret et vérifiable, vous supprimez l'ambiguïté qui freine l'action.\n\n` +
        `Prenez garde toutefois à une erreur fréquente : vouloir tout optimiser simultanément. Concentrez votre attention sur un seul levier à la fois, observez ce qui change réellement sur le terrain, et conservez uniquement ce qui apporte de la clarté. Dans quelle direction souhaitez-vous orienter la suite de notre échange, ${name} ?`,
    };
  }

  if (lower.includes('médecine') || lower.includes('révis') || lower.includes('cours') || lower.includes('apprendre') || lower.includes('mémoriser')) {
    return {
      nextStyle: 'professeur',
      text:
        `${langPack.hello} ${name}. Permettez-moi de vous expliquer d'abord *pourquoi* notre mémoire résiste parfois aux révisions classiques, avant de voir comment la débloquer durablement.\n\n` +
        `Relire passivement un cours crée ce que les chercheurs en sciences cognitives appellent *l'illusion de compétence* : vos yeux reconnaissent les mots sur la page, donc votre cerveau croit savoir, alors qu'il n'a pas encore reconstruit le chemin neuronal pour retrouver l'information par lui-même. À l'inverse, l'effort actif de restitution — fermer votre support et tenter d'expliquer le mécanisme à voix haute avec vos propres mots — oblige vos synapses à se consolider.\n\n` +
        `De plus, démarrer par une micro-tâche très accessible lève la barrière émotionnelle de l'effort, tandis que des pauses courtes sans écran laissent à l'hippocampe le temps de consolider ce que vous venez d'étudier. Sur quelle notion précise souhaitez-vous que nous approfondissions ou construisions un exercice ensemble, ${name} ?`,
    };
  }

  return {
    nextStyle: 'professeur',
    text:
      `${langPack.hello} ${name}. Prenons le temps d'examiner « ${prompt.slice(0, 75)} » avec rigueur et pédagogie, comme dans un cours approfondi.\n\n` +
      `Derrière toute situation qui semble complexe — qu'il s'agisse de votre activité (${userProfile}), d'un projet créatif ou d'une question technique — se cache une distinction fondamentale entre *l'intention* (ce que l'on espère obtenir) et *le mécanisme réel* (ce qui déclenche concrètement le résultat). Lorsque l'on comprend cette mécanique intime plutôt que d'appliquer une recette figée, chaque décision devient beaucoup plus juste et on cesse de disperser son énergie sur des détails secondaires.\n\n` +
      `Concrètement, observez comment une seule variable influence l'ensemble du système : posez un socle clair, mettez une hypothèse précise à l'épreuve du réel à petite échelle, puis analysez objectivement la réaction obtenue. C'est cette démarche d'analyse et de compréhension profonde qui vous rend pleinement autonome.\n\n` +
      `Nous pouvons poursuivre cette discussion comme vous le souhaitez, ${name} : demandez-moi d'approfondir une notion précise, d'adapter mon style (par exemple pour imaginer des idées de jeu, un quiz ou une explication plus courte), ou de passer directement à la création d'une vidéo 9:16 ou d'un site interactif.`,
  };
}

/**
 * Compétence interne d'Andrea : retouche texte sur photo 100% locale via Canvas HTML5
 * sans aucun menu séparé ni mention d'application externe.
 */
export async function executeInternalPhotoTextSkill(
  prompt: string,
  attachedFile?: File | null
): Promise<{ dataUrl: string; explanation: string }> {
  const quoted = prompt.match(/["«']([^"»']+)["»']/g)?.map((s) => s.replace(/["«»']/g, '')) || [];
  const newText = quoted[quoted.length - 1] || prompt.replace(/retouche|photo|texte|remplace|efface/gi, '').trim().slice(0, 32) || 'NOUVEAU VISUEL';

  let loadedImg: HTMLImageElement | null = null;
  if (attachedFile && attachedFile.type.startsWith('image/')) {
    loadedImg = await new Promise<HTMLImageElement | null>((resolve) => {
      const url = URL.createObjectURL(attachedFile);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = url;
    });
  }

  const canvas = document.createElement('canvas');
  const sampledColor = loadedImg ? sampleImageRegionColor(loadedImg, 25, 42, 50, 14) : '#0f172a';
  const eraseOnly = /efface|supprime|gomme|retire/i.test(prompt) && !/remplace|ajoute|écris|mets/i.test(prompt);

  const eraseBoxes = [
    {
      id: 'int_er_1',
      x: 22,
      y: 42,
      width: 56,
      height: 14,
      sampledColor,
      label: 'Zone reconstruite',
    },
  ];

  const layers = eraseOnly
    ? []
    : [
        {
          id: 'int_lay_1',
          text: newText.toUpperCase(),
          x: 50,
          y: 49,
          fontSize: 34,
          fontFamily: 'Impact',
          color: '#ffffff',
          gradientEnabled: false,
          gradientStart: '#38bdf8',
          gradientEnd: '#a855f7',
          strokeEnabled: true,
          strokeColor: '#020617',
          strokeWidth: 3,
          shadowEnabled: true,
          shadowColor: 'rgba(0,0,0,0.75)',
          curveAngle: 0,
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          isBold: true,
          isItalic: false,
          isUnderline: false,
        },
      ];

  const dataUrl = renderPhototextToCanvas(canvas, loadedImg, eraseBoxes, layers, 1080, 1080);

  return {
    dataUrl,
    explanation: loadedImg
      ? `J'ai appliqué ma compétence interne de retouche sur votre image « ${attachedFile?.name} » en reconstruisant la zone d'arrière-plan${eraseOnly ? ' sans texte.' : ` avec le nouveau texte « ${newText.toUpperCase()} ».`}`
      : `J'ai généré un aperçu visuel avec ma compétence interne de retouche${eraseOnly ? ' (zone reconstruite proprement).' : ` intégrant le texte « ${newText.toUpperCase()} ».`} Joignez directement une photo via « + » pour que je travaille sur votre propre image.`,
  };
}
