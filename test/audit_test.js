/**
 * Automated Test Suite for Fake Social Media Account Detection Engine
 * Verifies feature extraction, Shannon entropy, risk scoring calibration,
 * and benchmark classification accuracy.
 */

const assert = require('assert');
const { PRESET_ACCOUNTS, BENCHMARK_DATASET, NETWORK_TOPOLOGY_DATA } = require('../data.js');

console.log('🧪 Starting Fake Social Media Account Detection Test Suite...\n');

let passedTests = 0;
let totalTests = 0;

function it(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
  }
}

// Inline Scoring Engine (Mirrors Python & Client implementation)
function calculateEntropy(str) {
  if (!str) return 0;
  const counts = {};
  for (const c of str) counts[c] = (counts[c] || 0) + 1;
  const len = str.length;
  let ent = 0;
  for (const k in counts) {
    const p = counts[k] / len;
    ent -= p * Math.log2(p);
  }
  return ent;
}

function scoreAccount(p) {
  const followers = Number(p.followers_count || 0);
  const following = Number(p.following_count || 0);
  const reputation = followers / (followers + following + 1e-5);
  const velocity = Number(p.avg_posts_per_day || 0);
  const variance = Number(p.inter_arrival_variance || 0.5);
  const circadian = Number(p.circadian_entropy || 0.5);
  const lexical = Number(p.lexical_diversity || 0.7);
  const retweet = Number(p.retweet_ratio || 0.3);
  const defaultAv = p.has_default_avatar ? 1 : 0;

  let score = 0;
  if (reputation < 0.05) score += 18;
  else if (reputation > 0.4) score -= 10;

  if (velocity > 60) score += 22;
  if (variance < 0.20) score += 24;
  else if (variance > 0.65) score -= 20;

  if (circadian > 0.75) score += 16;
  if (lexical < 0.35) score += 15;
  if (retweet > 0.80) score += 14;
  if (defaultAv) score += 10;
  if (p.has_bio) score -= 12;

  // Sigmoid calibration centered at 15
  const prob = 1 / (1 + Math.exp(-0.065 * (score - 15)));
  return Math.round(prob * 1000) / 10;
}

// 1. Data Integrity Tests
it('Benchmark dataset contains at least 100 balanced records', () => {
  assert(Array.isArray(BENCHMARK_DATASET), 'Benchmark dataset is an array');
  assert(BENCHMARK_DATASET.length >= 100, `Expected >= 100 records, got ${BENCHMARK_DATASET.length}`);
  const bots = BENCHMARK_DATASET.filter(a => a.ground_truth === 'fake').length;
  const humans = BENCHMARK_DATASET.filter(a => a.ground_truth === 'human').length;
  assert(bots > 0 && humans > 0, 'Dataset contains both bots and humans');
  assert(Math.abs(bots - humans) <= 10, 'Dataset is balanced');
});

it('Presets include critical threat archetypes (Spam, Sybil, Impersonator, Human)', () => {
  assert(PRESET_ACCOUNTS.length >= 6, 'Preset accounts count >= 6');
  const spam = PRESET_ACCOUNTS.find(a => a.handle.includes('crypto'));
  const human = PRESET_ACCOUNTS.find(a => a.handle.includes('sarah'));
  const impersonator = PRESET_ACCOUNTS.find(a => a.handle.includes('supp0rt'));
  assert(spam && human && impersonator, 'All archetypes found');
});

it('Network topology contains coherent nodes and links for graph visualization', () => {
  assert(NETWORK_TOPOLOGY_DATA.nodes.length >= 20, 'Nodes count >= 20');
  assert(NETWORK_TOPOLOGY_DATA.links.length >= 20, 'Links count >= 20');
  const nodeIds = new Set(NETWORK_TOPOLOGY_DATA.nodes.map(n => n.id));
  NETWORK_TOPOLOGY_DATA.links.forEach(l => {
    assert(nodeIds.has(l.source), `Link source ${l.source} must exist in nodes`);
    assert(nodeIds.has(l.target), `Link target ${l.target} must exist in nodes`);
  });
});

// 2. Analytical Algorithm Tests
it('Shannon entropy correctly detects high-entropy randomized strings vs repetitive patterns', () => {
  const lowEnt = calculateEntropy('aaaaaaaa');
  const highEnt = calculateEntropy('u8f93q7d');
  assert.strictEqual(lowEnt, 0, 'Single character string entropy is 0');
  assert(highEnt > 2.5, `Randomized string entropy should be high, got ${highEnt}`);
});

it('Algorithm flags spam bot @crypto_pump_bot99 as High Risk Bot (>85%)', () => {
  const bot = PRESET_ACCOUNTS.find(a => a.handle.includes('crypto_pump'));
  const score = scoreAccount(bot);
  assert(score >= 85, `Expected bot score >= 85%, got ${score}%`);
});

it('Algorithm classifies verified researcher @sarah_j_tech as Authentic Human (<20%)', () => {
  const human = PRESET_ACCOUNTS.find(a => a.handle.includes('sarah_j_tech'));
  const score = scoreAccount(human);
  assert(score <= 20, `Expected human score <= 20%, got ${score}%`);
});

it('Algorithm flags Sybil node @user_784910283 with high confidence (>90%)', () => {
  const sybil = PRESET_ACCOUNTS.find(a => a.handle.includes('user_784910283'));
  const score = scoreAccount(sybil);
  assert(score >= 90, `Expected sybil score >= 90%, got ${score}%`);
});

// 3. Batch Performance Accuracy Benchmark
it('Batch benchmark achieves Accuracy >= 90% and Precision >= 90%', () => {
  let tp = 0, fp = 0, tn = 0, fn = 0;
  BENCHMARK_DATASET.forEach(rec => {
    const s = scoreAccount(rec);
    const predBot = s >= 50;
    const trueBot = rec.ground_truth === 'fake';
    if (predBot && trueBot) tp++;
    else if (predBot && !trueBot) fp++;
    else if (!predBot && !trueBot) tn++;
    else fn++;
  });

  const total = BENCHMARK_DATASET.length;
  const acc = (tp + tn) / total;
  const prec = tp / (tp + fp);
  const rec = tp / (tp + fn);
  const f1 = 2 * (prec * rec) / (prec + rec);

  console.log(`\n    [Benchmark Results: Acc: ${(acc*100).toFixed(1)}%, Prec: ${(prec*100).toFixed(1)}%, Recall: ${(rec*100).toFixed(1)}%, F1: ${(f1*100).toFixed(1)}%]`);
  assert(acc >= 0.90, `Accuracy must be >= 90%, got ${(acc*100).toFixed(1)}%`);
  assert(prec >= 0.90, `Precision must be >= 90%, got ${(prec*100).toFixed(1)}%`);
  assert(f1 >= 0.90, `F1-Score must be >= 90%, got ${(f1*100).toFixed(1)}%`);
});

console.log(`\n========================================`);
console.log(` Test Summary: ${passedTests}/${totalTests} Passed`);
console.log(`========================================\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}
