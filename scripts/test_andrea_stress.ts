/**
 * Script de test de charge et de résilience pour Andrea
 * Simule 1 000 requêtes concurrentes et valide les métriques
 */

import { andreaEngine } from '../src/utils/andreaRequestEngine';

async function run() {
  console.log('--- DÉBUT DU TEST DE CHARGE ANDREA (1 000 REQUÊTES) ---');
  const startTime = Date.now();

  const metrics = await andreaEngine.runStressTest(1000, 30, (p) => {
    if (p.successfulRequests % 250 === 0 && p.successfulRequests > 0) {
      console.log(`[Progression] ${p.successfulRequests}/1000 requêtes traitées... (${p.requestsPerSecond} req/s)`);
    }
  });

  const totalDuration = Date.now() - startTime;
  console.log('--- RÉSULTATS DU BENCHMARK ---');
  console.log(`Statut : ${metrics.status}`);
  console.log(`Total Requêtes : ${metrics.totalRequests}`);
  console.log(`Succès : ${metrics.successfulRequests}`);
  console.log(`Échecs : ${metrics.failedRequests}`);
  console.log(`Cache Hits : ${metrics.cacheHits}`);
  console.log(`Débit : ${metrics.requestsPerSecond} req/s`);
  console.log(`Latence Moyenne : ${metrics.avgLatencyMs} ms`);
  console.log(`Durée Totale : ${totalDuration} ms`);

  if (metrics.failedRequests === 0 && metrics.successfulRequests === 1000) {
    console.log('✅ TEST DE CHARGE RÉUSSI AVEC SUCCÈS (100% RÉUSSITE)');
    process.exit(0);
  } else {
    console.error('❌ Échec du test de charge');
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Erreur critique pendant le test :', err);
  process.exit(1);
});
