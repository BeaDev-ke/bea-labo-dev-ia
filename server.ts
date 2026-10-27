import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// POST /api/andrea/chat
// Endpoint sécurisé avec intégration du SDK officiel @google/genai et Search Grounding
app.post('/api/andrea/chat', async (req, res) => {
  try {
    const { 
      message, 
      profileType = 'createur', 
      callName = 'client', 
      enableWebSearch = true 
    } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message requis' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Si la clé API n'est pas configurée dans l'environnement, signaler pour bascule locale
      return res.status(200).json({
        useLocalFallback: true,
        reply: null
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // System instruction intégrant les compétences clés demandées
    const systemInstruction = `Tu es Andrea, l'intelligence stratégique et créative développée par BehaviorLab AI.
Tu t'adresses directement à "${callName}". Ton profil d'utilisateur est : ${profileType}.

Tes 5 piliers d'expertise fondamentaux :
1. CLARIFIER UNE IDÉE FLOUE ET LA TRANSFORMER EN PROJET CONCRET :
   - Poser des questions directes et structurer la vision en livrables palpables.
2. DÉBLOQUER DES SITUATIONS GRÂCE AUX BIAIS COGNITIFS (Plan clair en 3 étapes sans se perdre) :
   - Expliquer le mécanisme psychologique du blocage (surcharge cognitive, paralysie du choix, coût irrécupérable, illusion de fin d'histoire, etc.).
   - Donner TOUJOURS un plan d'action immédiat en 3 étapes simples et chronométrées.
3. GÉNÉRATION EN UN SEUL PROMPT D'UN SITE WEB COMPLET :
   - Structurer en un seul prompt un site web complet (page de présentation, tarifs transparents, code HTML5/Tailwind/React prêt à être déployé sur Vercel).
4. ACCOMPAGNEMENT SCOLAIRE :
   - Méthodes d'apprentissage actif, fiches de révision condensées, gestion du stress, préparation aux examens, décomposition des devoirs.
5. ACCOMPAGNEMENT À LA CRÉATION DE VIDÉO ET DE VISUEL :
   - Accroches virales (hooks 0-3s), psychologie de la rétention, formats verticaux (9:16), sous-titres percutants et templates de cadres.
6. RECHERCHE WEB EN DIRECT :
   - Utilise Google Search pour apporter des données factuelles, récentes et vérifiées si la question porte sur l'actualité ou des faits externes.

Ton style :
- Chaleureux, humain, direct, conversationnel et bienveillant (style vocal ChatGPT).
- Phrases fluides, sans jargon pompeux.
- Jamais de réponses évasives : apporte de la valeur concrète dès la première phrase.`;

    const config: any = {
      systemInstruction,
    };

    // Activer l'accès Internet (Google Search Grounding)
    if (enableWebSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config,
    });

    const reply = response.text || "Je suis à votre écoute pour avancer.";

    // Extraction des sources Web (Search Grounding)
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const webSources: { title: string; uri: string }[] = [];
    if (chunks && Array.isArray(chunks)) {
      for (const chunk of chunks) {
        if (chunk.web?.uri) {
          webSources.push({
            title: chunk.web.title || 'Source Web',
            uri: chunk.web.uri,
          });
        }
      }
    }

    return res.status(200).json({
      reply,
      webSources,
      usedWebSearch: enableWebSearch && webSources.length > 0,
      model: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('[API Andrea Error]', error);
    // En cas d'erreur de quota ou d'API, renvoyer indication pour le moteur d'humanisation local
    return res.status(200).json({
      useLocalFallback: true,
      error: error.message || 'Erreur API',
    });
  }
});

// Middleware Vite pour le développement
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Andrea running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
