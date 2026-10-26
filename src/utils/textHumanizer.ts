import { UserProfile, ProfileType } from '../types/bea';

/**
 * HUMANISATEUR DE TEXTE POUR ANDREA (BEHAVIORLAB AI)
 * 
 * Transforme les réponses mécaniques et robotiques en échanges vivants,
 * chaleureux, tranchants et profondément humains :
 * - Supprime le jargon clinique et les gabarits automatiques (ex: "Diagnostic Comportemental :", "Protocole 1 :").
 * - S'adresse personnellement au client par son prénom ou nom d'usage choisi.
 * - Adopte un débit conversationnel naturel (connecteurs vivants, respirations, empathie réelle).
 * - Transforme les listes d'étapes rigides en conseils concrets expliqués comme par un mentor humain.
 * - Termine par une question d'ouverture naturelle pour maintenir l'échange.
 */

interface HumanizeOptions {
  userProfile?: UserProfile;
  userPrompt?: string;
}

export function humanizeAndreaResponse(rawText: string, options: HumanizeOptions = {}): string {
  if (!rawText || typeof rawText !== 'string') return '';

  const { userProfile, userPrompt = '' } = options;
  const clientName = userProfile?.preferredCallName?.trim() 
    || userProfile?.displayName?.split(' ')[0]?.trim() 
    || '';

  let cleaned = rawText;

  // 1. SUPPRESSION DU JARGON ROBOTIQUE & TITRES DE TEMPLATES ARTIFICIELS
  const roboticPatternsToRemove = [
    /###\s*🎯\s*Diagnostic Comportemental\s*:?/gi,
    /###\s*🧠\s*Analyse de la dynamique\s*:?/gi,
    /\*\*Analyse de la dynamique\s*:\*\*/gi,
    /\*\*Grille d'analyse stratégique\s*:\*\*/gi,
    /###\s*⚡\s*Le levier immédiat\s*:?/gi,
    /\*\*Le levier immédiat\s*:\*\*/gi,
    /\*\*Points clés d'optimisation\s*:\*\*/gi,
    /\*\*Les axes stratégiques pour ton contenu\s*:\*\*/gi,
    /\*\*1\.\s*Déconstruction de la notion\s*\(Principe de Feynman\)\s*:\*\*/gi,
    /\*\*2\.\s*Pratique active immédiate\s*:\*\*/gi,
    /Analyse stratégique de ta demande\s*:?/gi,
    /Protocole d'activation\s*:?/gi,
    /Heuristiques activées\s*:?/gi,
    /Charge cognitive résiduelle\s*:?/gi,
    /Seuil d'activation neuro-comportemental\s*:?/gi
  ];

  for (const pat of roboticPatternsToRemove) {
    cleaned = cleaned.replace(pat, '');
  }

  // 2. ADOUCISSEMENT DES LISTES RIGIDES ET FORMATAGE PLUS NATUREL
  // Remplacer les puces raides "1. **Titre complexe** : Description raide" par des tournures directes
  cleaned = cleaned.replace(/\d+\.\s*\*\*Règle des 5 minutes sans enjeu\*\*\s*:\s*/gi, 'Première chose toute simple : lance un chrono de 5 minutes. Pas plus. Engage-toi juste à poser les yeux dessus ou à taper trois lignes brouillon, sans aucun jugement. ');
  cleaned = cleaned.replace(/\d+\.\s*\*\*Scission du livrable\*\*\s*:\s*/gi, 'Deuxième chose : oublie le résultat final pour l\'instant. Fais juste la toute première action physique (ouvrir le bon doc, renommer le fichier). ');
  cleaned = cleaned.replace(/\d+\.\s*\*\*L'accroche disruptive[^\*]*\*\*\s*:\s*/gi, 'D\'abord, ton accroche : balance une antithèse ou casse une idée reçue dès les 3 premières secondes. Pas de bonjour convenu. ');
  cleaned = cleaned.replace(/\d+\.\s*\*\*La progression rythmique\*\*\s*:\s*/gi, 'Ensuite, le rythme : alterne une phrase forte et un visuel ou exemple toutes les 5 secondes pour garder les gens accrochés. ');
  cleaned = cleaned.replace(/\d+\.\s*\*\*La clarté cognitive\*\*\s*:\s*/gi, 'Enfin, une seule idée maîtresse par vidéo ou post. Si une deuxième idée arrive, garde-la pour le prochain format. ');
  cleaned = cleaned.replace(/\d+\.\s*\*\*Inversion du risque\*\*\s*:\s*/gi, 'Pour commencer, inverse le risque : plus ton offre est limpide et rassurante pour ton client, plus sa décision coule de source. ');
  cleaned = cleaned.replace(/\d+\.\s*\*\*Cadrage sur le coût de l'inaction\*\*\s*:\s*/gi, 'Ensuite, montre-lui ce que ça lui coûte d\'attendre : le problème n\'est pas ton tarif, c\'est ce qu\'il perd chaque semaine sans solution. ');
  cleaned = cleaned.replace(/\d+\.\s*\*\*Posture de conseil affirmée\*\*\s*:\s*/gi, 'Et adopte une vraie posture de diagnostic, comme un spécialiste qui analyse une situation, pas un commercial qui négocie. ');

  // 3. ENLEVER LES DOUBLES RETOURS À LA LIGNE INUTILES CRÉÉS PAR LE NETTOYAGE
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();

  // 4. PERSONNALISATION DE L'ACCROCHE (AVEC LE PRÉNOM DU CLIENT S'IL EXISTE)
  const isGreeting = /^(bonjour|salut|hello|coucou|qui es-tu|présente-toi)/i.test(userPrompt.trim());
  const isStruggle = /peur|bloqu|procrastin|doute|difficile|n'arrive pas|décourag|épuis|angoisse|panique|retard|friction/i.test(userPrompt);

  let warmOpener = '';
  if (clientName) {
    if (isGreeting) {
      warmOpener = `Bonjour ${clientName} ! C'est un vrai plaisir d'échanger avec toi.`;
    } else if (isStruggle) {
      const struggleStarters = [
        `Je te rassure tout de suite ${clientName} : ce que tu ressens là est 100% normal.`,
        `Respire un coup ${clientName}, on est ensemble là-dessus.`,
        `Écoute ${clientName}, pas de panique ni de culpabilité.`
      ];
      warmOpener = struggleStarters[Math.floor(Math.random() * struggleStarters.length)];
    } else {
      const naturalStarters = [
        `Écoute ${clientName}, voici comment je vois les choses :`,
        `Regardons ça ensemble ${clientName} :`,
        `Excellente question ${clientName}. Voici le plan le plus direct :`
      ];
      // Si la réponse ne commence pas déjà par le prénom
      if (!cleaned.startsWith(clientName) && !cleaned.toLowerCase().includes(`bonjour ${clientName.toLowerCase()}`)) {
        warmOpener = naturalStarters[Math.floor(Math.random() * naturalStarters.length)];
      }
    }
  }

  // 5. REMODELER LA FIN POUR ÉVITER LES FORMULES ROBOTIQUES
  let finalClosing = '';
  if (cleaned.includes('Sur quel aspect spécifique souhaites-tu que nous approfondissions')) {
    cleaned = cleaned.replace('Sur quel aspect spécifique souhaites-tu que nous approfondissions en premier ?', '');
    finalClosing = clientName 
      ? `Dis-moi ${clientName}, tu préfères qu'on commence par quoi ?`
      : `Dis-moi, tu préfères qu'on commence par quoi ?`;
  } else if (cleaned.includes('On démarre sur ces 5 premières minutes ensemble ?')) {
    cleaned = cleaned.replace('On démarre sur ces 5 premières minutes ensemble ?', '');
    finalClosing = clientName
      ? `On tente ça maintenant ${clientName} ? Je reste là pendant que tu démarres.`
      : `On tente ça maintenant ? Je reste là pendant que tu démarres.`;
  }

  // Assembler la réponse humanisée
  let humanized = '';
  if (warmOpener && !cleaned.toLowerCase().startsWith('bonjour') && !cleaned.toLowerCase().startsWith('salut')) {
    humanized = `${warmOpener}\n\n${cleaned}`;
  } else {
    humanized = cleaned;
  }

  if (finalClosing && !humanized.includes(finalClosing)) {
    humanized = `${humanized.trim()}\n\n${finalClosing}`;
  }

  // Nettoyage final des espacements
  return humanized.replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * Générateur conversationnel direct et empathique
 * Produit directement une réponse humaine pour tout sujet
 */
export function generateHumanAndreaResponse(userPrompt: string, userProfile: UserProfile): string {
  const cleanInput = userPrompt.trim();
  const lower = cleanInput.toLowerCase();
  const clientName = userProfile.preferredCallName?.trim() 
    || userProfile.displayName?.split(' ')[0]?.trim() 
    || '';

  const isGreeting = /^(bonjour|salut|hello|coucou|qui es-tu|présente-toi)/i.test(cleanInput);
  const isCodeRequest = /code|script|fonction|python|react|javascript|bug|erreur|api|composant|dev/i.test(lower);
  const isExplicitStruggle = /peur|bloqu|procrastin|doute|difficile|n'arrive pas|décourag|épuis|angoisse|panique|retard|friction/i.test(lower);
  const isCreativeOrVideo = /vidéo|montage|format_court|publication|accroche|hook|script|contenu|post|cam|visuel/i.test(lower);
  const isBusinessOrSales = /client|prix|vente|offre|prospect|devis|négocier|chiffre|marketing|déléguer/i.test(lower);
  const isStudyRequest = userProfile.useCase === 'scolaire' || /cours|révis|examen|devoir|formule|leçon/i.test(lower);

  let raw = '';

  if (isGreeting) {
    if (clientName) {
      raw = `Bonjour ${clientName} ! C'est un vrai plaisir de te retrouver. Je suis Andrea, à tes côtés pour t'aider à avancer sur tes projets, clarifier tes idées ou débloquer ce qui traîne. Dis-moi ce sur quoi tu as envie d'avancer aujourd'hui !`;
    } else {
      raw = `Bonjour ! C'est un plaisir de t'accueillir. Je suis Andrea, ton alliée pour concrétiser tes idées, structurer tes contenus et garder un rythme serein. Par quoi a-t-on envie de commencer aujourd'hui ?`;
    }
  } else if (isExplicitStruggle) {
    raw = `Je comprends tout à fait ce que tu ressens. Quand on bloque ou qu'on repousse, ce n'est presque jamais un manque de motivation, c'est juste que la tâche paraît floue ou trop lourde à attaquer d'un coup.

Voici ce que je te propose pour casser la glace sans te prendre la tête :

1. Ne cherche pas à finir. Bloque juste 5 minutes montre en main et fais le geste le plus bête du monde (ouvrir le document, poser le titre, préparer tes photos).
2. Écris ou produis un truc imparfait. La perfection est le pire ennemi du démarrage. Une fois que c'est sur la table, on le peaufine ensemble.

Tu veux qu'on se cale 5 minutes ensemble là tout de suite ?`;
  } else if (isCreativeOrVideo) {
    raw = `C'est un super sujet. Sur les réseaux, ce qui fait la différence entre un post qui passe inaperçu et un contenu qui cartonne, c'est la clarté et le rythme.

Voilà comment structurer ça simplement :
- L'accroche : casse une certitude ou pose une question intrigante dès la première seconde. Zéro intro formelle.
- Le cœur : donne un conseil ultra concret que la personne peut tester aujourd'hui.
- Le visuel : utilise des contrastes lisibles et des textes courts. Tu peux d'ailleurs utiliser notre Studio Visuel pour glisser tes photos dans un beau cadre en quelques clics.

Tu as déjà une idée de ton accroche ou tu veux qu'on en écrive deux ou trois ensemble ?`;
  } else if (isBusinessOrSales) {
    raw = `Sur ce point, il y a une règle d'or : tes clients n'achètent pas du temps ou des heures, ils achètent la certitude d'un résultat et la tranquillité d'esprit.

Voici ce que je te conseille de poser :
- Mets en avant ce qu'ils risquent de perdre s'ils ne résolvent pas ce problème maintenant.
- Rends ton process lisible en 3 étapes simples : rassurer enlève 90% des objections.
- Annonce ton tarif avec assurance, comme un médecin qui pose un diagnostic évident.

C'est quoi la principale réticence que tes prospects te renvoient en ce moment ?`;
  } else if (isStudyRequest) {
    raw = `Pas de panique, on va rendre ça limpide et digeste. Quand un cours semble indigeste, la pire méthode est de le relire en boucle passivement.

Faisons plutôt ça :
- On isole la formule ou la notion clé en une seule phrase simple de la vie courante.
- On fait immédiatement un mini-exercice d'application pour voir exactement où ça coince.
- Dès que tu sais l'expliquer simplement avec tes propres mots, c'est ancré pour de bon.

Quel est l'exercice ou le chapitre exact qui te donne du fil à retordre ?`;
  } else if (isCodeRequest) {
    raw = `Je te prépare une solution propre, rapide et bien structurée pour régler ça :

\`\`\`python
# Solution directe et lisible
def resoudre_besoin(donnees):
    """Traitement direct sans complication."""
    if not donnees:
        return {"statut": "vide", "message": "Aucune donnée à traiter"}
    
    # Étape clé simplifiée
    resultat = [item.strip() for item in donnees if item]
    return {"statut": "ok", "elements": resultat, "total": len(resultat)}
\`\`\`

Le principe est simple : on évite les effets de bord, on traite les cas vides immédiatement et le code reste agréable à maintenir.

Dis-moi si tu veux qu'on l'adapte à un cas plus spécifique ou qu'on le teste directement !`;
  } else {
    raw = `C'est une excellente question, et tu fais bien de la poser.

Pour qu'on avance de manière super efficace, voici ce que je te propose :
- On cible la priorité absolue pour ne pas s'éparpiller.
- On définit la toute première action simple à faire dans les prochaines minutes.
- On ajuste au fur et à mesure selon ce qui marche pour toi.

Quel est le résultat précis que tu aimerais avoir d'ici la fin de notre échange ?`;
  }

  return humanizeAndreaResponse(raw, { userProfile, userPrompt });
}
