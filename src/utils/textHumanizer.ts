import { UserProfile, ProfileType } from '../types/bea';

/**
 * HUMANISATEUR DE TEXTE POUR ANDREA (BEHAVIORLAB AI)
 * 
 * Génère des réponses vivantes, chaleureuses, directes et profondément humaines (style ChatGPT) :
 * 1. Clarifier une idée floue et la transformer en projet concret.
 * 2. Débloquer des situations grâce aux biais cognitifs, avec un plan clair en 3 étapes pour avancer sans se perdre.
 * 3. Structurer en un seul prompt un site web complet (page de présentation, tarifs, code prêt à déployer).
 * 4. Accompagnement scolaire (révisions, méthodes de travail, préparation aux examens).
 * 5. Accompagnement à la création de vidéo et de visuel (hooks percutants 0-3s, formats verticaux 9:16, rétention).
 * 6. Recherche Web en direct pour des informations récentes.
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

  let cleaned = rawText
    .replace(/###\s*🎯\s*Diagnostic Comportemental\s*:?/gi, '')
    .replace(/###\s*🧠\s*Analyse de la dynamique\s*:?/gi, '')
    .replace(/\*\*Grille d'analyse stratégique\s*:\*\*/gi, '')
    .replace(/Protocole d'activation\s*:?/gi, '')
    .replace(/Charge cognitive résiduelle\s*:?/gi, '')
    .trim();

  return cleaned;
}

/**
 * Moteur conversationnel local d'Andrea (utilisé directement ou en secours haute résilience)
 */
export function generateHumanAndreaResponse(userPrompt: string, userProfile?: UserProfile): string {
  const p = userPrompt.toLowerCase().trim();
  const name = userProfile?.preferredCallName || userProfile?.displayName || '';
  const appel = name ? `${name}` : 'à vous';

  // 1. CLARIFIER UNE IDÉE FLOUE ET LA TRANSFORMER EN PROJET CONCRET
  if (p.includes('idée floue') || p.includes('clarifier') || p.includes('projet concret') || p.includes('structurer') || p.includes('idée')) {
    return `C'est exactement mon rôle premier avec vous, ${name || ''} : transformer ce brouillard d'idées en un projet concret et limpide.

Quand une idée est floue, notre cerveau a tendance à imaginer 50 fonctionnalités à la fois, ce qui paralyse l'action. Voici comment nous allons la décanter ensemble :

**1. La Définition en 1 seule phrase :**
Quel est le problème unique et précis que ce projet résout, et pour qui exactement ? (Exemple : "J'aide les étudiants à réviser sans stress", ou "J'automatise la création de sites").

**2. Le Livrable Minimum Viable (V0) :**
Oublions les détails secondaires. Quel est le premier élément concret qu'on peut sortir dès aujourd'hui ? Une simple page, un document de 1 page, ou une première vidéo pilote ?

**3. Le Test de validation en 24h :**
Comment un vrai utilisateur peut tester ou voir ce projet d'ici demain soir ?

Partagez-moi vos notes en vrac ou votre idée telle quelle, même si c'est désordonné. Je m'occupe de la ranger et de la formaliser immédiatement en plan concret. On commence par quoi ?`;
  }

  // 2. DÉBLOQUER DES SITUATIONS GRÂCE AUX BIAIS COGNITIFS + PLAN CLAIR EN 3 ÉTAPES
  if (p.includes('bloqu') || p.includes('procrastin') || p.includes('biais') || p.includes('décourag') || p.includes('peur') || p.includes('n\'arrive pas') || p.includes('plan en 3')) {
    return `Respirons un coup ${name ? name : ''} : ce blocage n'est pas un manque de compétence ou de volonté, c'est purement un mécanisme psychologique bien connu.

**Le biais cognitif à l'œuvre : La Surcharge Cognitive & La Friction de Démarrage**
Quand notre cerveau voit une tâche comme un monolithe flou, il active un réflexe d'évitement pour préserver son énergie. C'est la loi de Laborit (recherche de satisfaction immédiate).

Voici votre **plan clair en 3 étapes pour avancer sans vous perdre** :

**Étape 1 : Réduire la friction à l'absurde (Règle des 2 minutes)**
Ne cherchez pas à terminer la tâche. Engagez-vous uniquement sur une action physique minuscule : ouvrir le fichier et écrire 1 seule ligne, ou lancer votre logiciel. Rien d'autre.

**Étape 2 : Un chrono de 15 minutes chrono (Zéro dispersion)**
Pendant 15 minutes, coupez toute distraction. Pas de retouche, pas d'autocritique. Vous produisez du brouillon brut.

**Étape 3 : Validation immédiate avec moi**
Dès que les 15 minutes sont écoulées, collez-moi ce que vous avez fait. Je vous donne un retour direct pour affiner et passer à la suite.

Lancez votre chrono de 2 minutes maintenant, et dites-moi la première action que vous venez de faire !`;
  }

  // 3. GÉNÉRATION EN UN SEUL PROMPT D'UN SITE WEB COMPLET
  if (p.includes('site') || p.includes('web') || p.includes('landing') || p.includes('page de présentation') || p.includes('tarif') || p.includes('bolt')) {
    return `Avec Andrea, vous pouvez concevoir en un seul prompt un site web complet, moderne et prêt pour le déploiement.

Voici exactement la formule prête à l'emploi que vous pouvez utiliser dans l'onglet **Création de Site** :

\`\`\`text
Crée un site web complet et responsive pour [Nom de votre projet].
Inclus :
1. Une page de présentation percutante avec hero banner, proposition de valeur claire et bouton d'action principal.
2. Une section des fonctionnalités clés avec icônes modernes et explications concises.
3. Une grille de tarifs transparente avec 3 offres distinctes (Basique, Pro, Premium) et mise en avant de la formule recommandée.
4. Une section de réassurance (témoignages et FAQ).
5. Un code HTML5, Tailwind CSS et JavaScript pur, ultra rapide, responsive mobile et prêt à être déployé sur Vercel.
\`\`\`

Vous pouvez basculer directement dans le menu **🌐 Création de Site** à gauche pour visualiser la génération en direct et exporter votre code en 1 clic !`;
  }

  // 4. ACCOMPAGNEMENT SCOLAIRE
  if (p.includes('scolaire') || p.includes('cour') || p.includes('examen') || p.includes('devoir') || p.includes('révis') || p.includes('étudiant') || p.includes('lycée')) {
    return `Pour vos études et vos cours, ${name || ''}, la méthode fait 90% de la note finale. Travailler des heures sans stratégie mène juste à l'épuisement.

Voici notre cadre d'**accompagnement scolaire personnalisé** :

**1. Le Rappel Actif (Active Recall) plutôt que la relecture passive :**
Ne relisez pas vos cours en surlignant. Fermez la feuille et écrivez tout ce dont vous vous souvenez. Les erreurs que vous repérez sont celles que vous ne ferez jamais à l'examen.

**2. La Répétition Espacée :**
Une session de 25 minutes aujourd'hui, 10 minutes après-demain, et 5 minutes la semaine suivante ancrent la mémoire à long terme bien mieux qu'une nuit blanche de 6 heures.

**3. Synthèse Feynman en 3 points :**
Donnez-moi n'importe quelle notion complexe de votre programme (maths, droit, histoire, physique, philo). Je vous l'explique avec des métaphores limpides comme à un enfant de 10 ans.

Quel est le cours ou le sujet précis sur lequel vous travaillez aujourd'hui ? Donnez-moi son titre !`;
  }

  // 5. ACCOMPAGNEMENT À LA CRÉATION DE VIDÉO ET DE VISUEL
  if (p.includes('vidéo') || p.includes('montage') || p.includes('visuel') || p.includes('hook') || p.includes('accroche') || p.includes('format') || p.includes('9:16') || p.includes('court')) {
    return `Sur les formats courts et les visuels, la règle d'or est simple : **les 3 premières secondes décident de tout**.

Voici votre guide d'**accompagnement à la création vidéo & visuelle** :

**1. Le Hook Psychologique (0 à 3 secondes) :**
- Pas de "Bonjour à tous" ni de générique.
- Posez une tension immédiate : *« Si vous faites encore cette erreur en 2026, vous perdez 80% de vos résultats. »* ou *« Personne ne vous dit la vérité sur... »*

**2. Le Cadrage Vertical Optimisé (9:16) :**
- Regard dans le tiers supérieur de l'écran.
- Sous-titres dynamiques contrastés centrés pour captiver l'œil même sans le son.
- Changement de plan ou zoom léger toutes les 4 à 6 secondes pour relancer la dopamine visuelle.

**3. Le Studio de Montage Andrea :**
Ouvrez le menu **🎬 Montage & Labo** : vous y trouverez vos modèles de cadres prêts à l'emploi et vos accroches psychologiques déjà rédigées.

Quel est le sujet de votre prochaine vidéo ? Je vous rédige 3 accroches percutantes sur mesure !`;
  }

  // 6. RECHERCHE WEB EN DIRECT
  if (p.includes('recherche') || p.includes('web') || p.includes('internet') || p.includes('actualité') || p.includes('dernière') || p.includes('source')) {
    return `Le skill de **Recherche Web en Direct** est connecté et actif sur mon moteur d'intelligence !

Pendant nos conversations, j'ai la capacité de requêter Internet en temps réel pour :
- Vérifier des informations et faits récents.
- Trouver des exemples d'actualité pertinents pour vos contenus ou vos cours.
- Citer les sources fiables pour étayer vos arguments.

Posez-moi votre question en mentionnant l'élément à rechercher, et je scanne le Web immédiatement pour vous apporter une synthèse claire et sourcée !`;
  }

  // 7. RÉPONSE GÉNÉRALE BIENVEILLANTE ET STRATÉGIQUE
  return `Bonjour ${name || ''} ! Je suis Andrea, votre partenaire d'intelligence stratégique et créative.

Voici ce que nous pouvons accomplir ensemble dès maintenant :
- **Clarifier une idée floue** pour en faire un projet concret étape par étape.
- **Débloquer une situation** grâce aux biais cognitifs avec un plan d'action en 3 étapes claires.
- **Générer en un seul prompt un site web complet** avec page de présentation, tarifs et code prêt à déployer.
- **Accompagnement scolaire** : réviser efficacement, structurer vos cours et préparer vos examens sans stress.
- **Accompagnement vidéo & visuel** : hooks en 3 secondes, formats verticaux 9:16 et rétention maximale.
- **Recherche Web en direct** pour accéder aux données d'Internet en temps réel.

Dites-moi : sur quel projet ou quel blocage souhaitez-vous que nous travaillions tout de suite ?`;
}
