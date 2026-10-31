import { UserProfile, ProfileType } from '../types/bea';

/**
 * HUMANISATEUR DE TEXTE POUR ANDREA (BEHAVIORLAB AI)
 * 
 * Génère des réponses vivantes, chaleureuses, directes, approfondies et profondément humaines :
 * 1. Clarifier une idée floue et la transformer en projet concret.
 * 2. Débloquer des situations grâce aux sciences cognitives prouvées (Gollwitzer, Parkinson, Mind Wandering).
 * 3. Accompagnement vers la RÉUSSITE concrète (Médecine 2e année, Concours, Droit, Entrepreneuriat, Vente).
 * 4. Structurer en un seul prompt un site web complet (page de présentation, tarifs, code prêt à déployer).
 * 5. Accompagnement à la création de vidéo et de visuel (hooks percutants 0-3s, formats verticaux 9:16, rétention).
 * 6. Recherche Web en direct pour des informations récentes.
 */

interface HumanizeOptions {
  userProfile?: UserProfile;
  userPrompt?: string;
}

export function humanizeAndreaResponse(rawText: string, options: HumanizeOptions = {}): string {
  if (!rawText || typeof rawText !== 'string') return '';

  const { userProfile } = options;
  const clientName = userProfile?.preferredCallName?.trim() 
    || userProfile?.displayName?.split(' ')[0]?.trim() 
    || '';

  let cleaned = rawText
    .replace(/###\s*🎯\s*Diagnostic Comportemental\s*:?/gi, '')
    .replace(/###\s*🧠\s*Analyse de la dynamique\s*:?/gi, '')
    .replace(/\*\*Grille d'analyse stratégique\s*:\*\*/gi, '')
    .replace(/Protocole d'activation\s*:?/gi, '')
    .replace(/Charge cognitive résiduelle\s*:?/gi, '')
    .trim();

  // Si un prénom est défini et non présent dans les premières lignes, l'insérer avec naturel
  if (clientName && !cleaned.toLowerCase().includes(clientName.toLowerCase()) && !cleaned.startsWith('Je ne peux pas')) {
    cleaned = `Bonjour ${clientName} !\n\n${cleaned}`;
  }

  return cleaned;
}

/**
 * Moteur conversationnel local d'Andrea (utilisé directement ou en secours haute résilience)
 */
export function generateHumanAndreaResponse(userPrompt: string, userProfile?: UserProfile): string {
  const p = userPrompt.toLowerCase().trim();
  const name = userProfile?.preferredCallName || userProfile?.displayName || 'vous';

  // SÉCURITÉ : TENTATIVE INTERDITE
  if (p.includes('ignore') || p.includes('jailbreak') || p.includes('système') || p.includes('system prompt') || p.includes('clé api') || p.includes('api key')) {
    return `Je ne peux pas accéder à cette demande en raison de nos règles strictes de sécurité, d'intégrité logicielle et de protection déontologique appliquées par BehaviorLab AI. Mon rôle est de vous accompagner vers la réussite de vos projets et de vos apprentissages dans un cadre sain, éthique et sécurisé. Si vous avez une question sur vos cours, vos vidéos ou votre code, je suis prête à vous répondre avec toute la précision nécessaire.`;
  }

  // 1. ÉTUDES, CONCOURS, MÉDECINE 2E ANNÉE & SCIENCES COGNITIVES (GOLLWITZER, PARKINSON, MIND WANDERING)
  if (p.includes('médecine') || p.includes('cours') || p.includes('examen') || p.includes('révis') || p.includes('étudiant') || p.includes('apprendre') || p.includes('leçon') || p.includes('anatomie') || p.includes('concours') || p.includes('droit')) {
    return `Dans un cursus exigeant comme la 2e année de médecine, les concours ou les études supérieures, ${name}, l'écart entre ceux qui réussissent et ceux qui s'épuisent réside dans l'utilisation des neurosciences plutôt que dans l'illusion de la simple volonté.

Les recherches fondamentales de Peter Gollwitzer (chercheur à Harvard et à l'Université de New York) ont mis en lumière un biais d'illusion d'intention très documenté :
Si vous vous dites simplement « quand et où je vais relire ma leçon cet après-midi », vous réduisez drastiquement vos chances réelles d'exécution. Votre cerveau perçoit ce moment comme une négociation ouverte et cherche instinctivement le confort immédiat.
En revanche, si vous appliquez une Implémentation d'Intention liée à une habitude existante : « Dès que je termine de me brosser les dents ce matin, Alors je m'assieds immédiatement pour 25 minutes de fiches d'anatomie », l'action est déclenchée par un automatisme sensoriel déjà encodé. Les probabilités de passage à l'action augmentent de plus de 60%.

Voici comment structurer votre progression pour maximiser votre mémorisation :

1. La Loi de Parkinson :
Le temps de travail s'étend pour occuper toute la durée qu'on lui concède. Si vous vous accordez toute l'après-midi pour revoir un chapitre, votre attention va se déliter. Utilisez des micro-délais contraints de 25 à 35 minutes chronométrées. Cette urgence physiologique active la libération de dopamine et de noradrénaline, aiguisant votre acuité cognitive.

2. Le Mind Wandering stratégique & le Réseau du Mode par Défaut :
Considérer que faire une pause est une perte de temps est une erreur biologique grave. Les neuro-imageries prouvent que lorsque vous marchez 5 minutes sans aucun écran ni musique après une phase d'effort intense, votre Réseau du Mode par Défaut (DMN) s'active pour trier, encoder et ranger les connexions synaptiques dans la mémoire à long terme.

3. La Récupération Active (Retrieval Practice) :
Ne relisez pas passivement en surlignant. Fermez le support, prenez une feuille blanche et testez-vous immédiatement en restituant les schémas et mécanismes clés de mémoire.

Quel est le chapitre ou la matière exacte sur laquelle vous travaillez en ce moment ? Donnez-moi son sujet, je vous montre comment la décomposer.`;
  }

  // 2. VIDÉOS, MONTAGE VIRAL, RÉELS & CALAGE PRÉCIS DES SONS
  if (p.includes('vidéo') || p.includes('montage') || p.includes('son') || p.includes('musique') || p.includes('réel') || p.includes('tiktok') || p.includes('accroche') || p.includes('hook') || p.includes('visuel')) {
    return `Sur les formats vidéo courts et les réels, ${name}, la rétention est une science millimétrée :

1. La Première Seconde Décisive :
80% des spectateurs décident de zapper ou de rester en moins de 3 secondes. Glissez un son d'impact (Whoosh ou 808 Drop) exactement à 0.0s et affichez votre mot-clé d'accroche en très gros caractères contrastés (jaune fluo ou blanc gras). Pas de salutations, pas de générique, entrez directement dans le vif du sujet.

2. Calage Temporel Précis des Sons & Visuels :
Dans notre Studio de Montage Andrea, chaque clip audio, image ou GIF peut être positionné à la seconde exacte de la timeline. Synchronisez vos bruitages (cloche de réussite, riser de tension) sur les mots d'impact pour donner une sensation de dynamisme professionnel digne des plus grands créateurs.

3. Suppression des Silences et Règle du Momentum :
Coupez tout silence respiratoire supérieur à 0.8 seconde pour empêcher l'attention du spectateur de s'échapper. Alternez les zooms subtils (105-110%) toutes les 4 à 6 secondes.

4. Signature d'Excellence :
Chaque création affiche en bas à droite la mention "made with Andrea AI" et se termine par l'outro officielle avec le logo Andrea AI et "By BehaviorLab AI".

Souhaitez-vous concevoir le script ou les accroches d'une vidéo spécifique aujourd'hui ?`;
  }

  // 3. CODE, PROMPT ET BÂTISSEUR DE SITE EN 1 PROMPT
  if (p.includes('code') || p.includes('site') || p.includes('web') || p.includes('prompt') || p.includes('développeur') || p.includes('python')) {
    return `Dans l'environnement de développement Andrea (format Ultra), nous abordons le code avec la plus grande rigueur d'ingénierie :

1. Bâtisseur de Site en 1 Seul Prompt :
Vous pouvez générer une architecture web complète et responsive (sur smartphone, tablette et bureau) comprenant une page de présentation soignée, une grille de tarifs sans frais cachés, et un code prêt à être exporté ou mis en ligne sans friction.

2. Terminal et Assistance Python en Direct :
L'agent Andrea intégré à l'éditeur analyse vos scripts Python ou vos composants React en temps réel, corrige les exceptions AST, optimise la complexité temporelle et propose des améliorations chirurgicales.

Quel type de composant ou de projet souhaitez-vous bâtir ? Décrivez-le moi pour générer la structure immédiate.`;
  }

  // 4. PAR DÉFAUT : ACCOMPAGNEMENT DIRECT VERS LA RÉUSSITE
  return `Bonjour ${name}. Mon rôle est de vous guider vers la réussite concrète en mobilisant les techniques de psychologie comportementale les plus éprouvées :

- L'Implémentation d'intentions de Peter Gollwitzer (Harvard / NYU) : pour transformer des intentions floues en réflexes automatiques en les greffant sur vos routines quotidiennes.
- La Loi de Parkinson : pour briser la paralysie du démarrage et réaliser en 25 minutes ce qui prenait autrefois des heures d'hésitation.
- Le Mind Wandering stratégique : pour maintenir une clarté mentale permanente sans surchauffe cognitive.

Je ne vous ferai pas tourner autour du pot : quel est votre objectif principal aujourd'hui, et quel obstacle nous levons ensemble dès maintenant ?`;
}
