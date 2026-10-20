/**
 * CyberSentry AI - Fake Social Media Account Detection Platform
 * Production Node.js REST API Server and Static Application Host
 * Zero-dependency native HTTP implementation.
 * Author: Mohammed Fardeen Ahmed
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { PRESET_ACCOUNTS, BENCHMARK_DATASET, NETWORK_TOPOLOGY_DATA } = require('./data.js');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.csv': 'text/csv',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Analytical Scoring Engine (Mirrors Client & Python)
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
  else if (reputation > 0.4) score -= 12;

  if (velocity > 60) score += 22;
  else if (velocity < 4) score -= 6;

  if (variance < 0.20) score += 24;
  else if (variance > 0.65) score -= 18;

  if (circadian > 0.75) score += 16;
  if (lexical < 0.35) score += 15;
  if (retweet > 0.80) score += 14;
  if (defaultAv) score += 10;
  if (p.bio || p.has_bio) score -= 10;

  const prob = 1 / (1 + Math.exp(-0.065 * (score - 15)));
  const riskPercentage = Math.round(prob * 1000) / 10;

  let verdict = 'Authentic Account (Likely Human)';
  let badgeClass = 'badge-safe';
  if (riskPercentage >= 75) {
    verdict = 'High Risk Automated Bot';
    badgeClass = 'badge-danger';
  } else if (riskPercentage >= 50) {
    verdict = 'Suspicious Account (Needs Review)';
    badgeClass = 'badge-warning';
  }

  return {
    riskScore: riskPercentage,
    verdict,
    badgeClass,
    reputation,
    velocity,
    variance,
    circadian,
    lexical
  };
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Endpoints
  if (pathname.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json');

    if (pathname === '/api/health') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'ok', engine: 'CyberSentry-AI', version: '2.4.0', timestamp: new Date().toISOString() }));
      return;
    }

    if (pathname === '/api/presets') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'success', data: PRESET_ACCOUNTS }));
      return;
    }

    if (pathname === '/api/network') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'success', data: NETWORK_TOPOLOGY_DATA }));
      return;
    }

    if (pathname === '/api/benchmark') {
      let tp = 0, fp = 0, tn = 0, fn = 0;
      const results = BENCHMARK_DATASET.map(acc => {
        const sc = scoreAccount(acc);
        const predBot = sc.riskScore >= 50;
        const trueBot = acc.ground_truth === 'fake';
        if (predBot && trueBot) tp++;
        else if (predBot && !trueBot) fp++;
        else if (!predBot && !trueBot) tn++;
        else fn++;
        return { ...acc, predicted: sc };
      });

      const total = results.length;
      const accuracy = (tp + tn) / total;
      const precision = tp / (tp + fp);
      const recall = tp / (tp + fn);
      const f1 = 2 * (precision * recall) / (precision + recall);

      res.writeHead(200);
      res.end(JSON.stringify({
        status: 'success',
        metrics: { total, accuracy, precision, recall, f1, confusion_matrix: { tp, fp, tn, fn } },
        data: results
      }));
      return;
    }

    if (pathname === '/api/audit' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const profile = JSON.parse(body);
          const scored = scoreAccount(profile);
          res.writeHead(200);
          res.end(JSON.stringify({ status: 'success', audit: scored }));
        } catch (err) {
          res.writeHead(400);
          res.end(JSON.stringify({ status: 'error', message: 'Invalid JSON payload' }));
        }
      });
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ status: 'error', message: 'API Route Not Found' }));
    return;
  }

  // Static File Server
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`🛡️  CyberSentry AI Platform live at http://localhost:${PORT}`);
});

if (typeof module !== 'undefined') {
  module.exports = server;
}
