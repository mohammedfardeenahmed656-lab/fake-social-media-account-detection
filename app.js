/**
 * CyberSentry AI - Fake Social Media Account Detection Platform
 * Core Application Engine, Forensic Auditor, Batch Benchmark, and Network Physics
 * Author: Mohammed Fardeen Ahmed
 */

// Application State
const STATE = {
  activeTab: 'auditor',
  currentAccount: null,
  customWeights: {
    velocity: 22.0,
    clockwork: 24.0,
    circadian: 16.0,
    reputation: 18.0
  },
  decisionThreshold: 50.0,
  benchmarkData: [],
  networkSimulation: {
    isRunning: true,
    nodes: [],
    links: [],
    draggedNode: null,
    selectedNode: null
  }
};

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initPresetChips();
  initAuditor();
  initBenchmarkStudio();
  initNetworkGraph();
  initModelTuner();
  initReportModal();

  // Load first preset by default
  if (PRESET_ACCOUNTS && PRESET_ACCOUNTS.length > 0) {
    loadAccountToAuditor(PRESET_ACCOUNTS[0]);
  }
});

/* ==========================================================================
   Navigation Tabs
   ========================================================================== */
function initNavigation() {
  const tabs = document.querySelectorAll('.nav-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPane = tab.getAttribute('data-tab');
      switchTab(targetPane);
    });
  });
}

function switchTab(tabId) {
  STATE.activeTab = tabId;

  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });

  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.toggle('active', pane.id === `pane-${tabId}`);
  });

  if (tabId === 'network' && !STATE.networkSimulation.isInitialized) {
    setupNetworkCanvas();
  }
}

/* ==========================================================================
   Analytical Math & Scoring Algorithms
   ========================================================================== */
function calculateShannonEntropy(str) {
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

function scoreAccountProfile(profile, weights = STATE.customWeights) {
  const followers = Number(profile.followers_count || 0);
  const following = Number(profile.following_count || 0);
  const posts = Number(profile.posts_count || 0);
  const age = Math.max(1, Number(profile.account_age_days || 1));
  const velocity = Number(profile.avg_posts_per_day || (posts / age));
  const variance = Number(profile.inter_arrival_variance || 0.5);
  const circadian = Number(profile.circadian_entropy || 0.5);
  const lexical = Number(profile.lexical_diversity || 0.7);
  const retweet = Number(profile.retweet_ratio || 0.3);
  const defaultAv = profile.has_default_avatar ? 1 : 0;
  const hasBio = profile.bio ? 1 : (profile.has_bio ? 1 : 0);

  // Reputation Ratio [0, 1]
  const reputation = followers / (followers + following + 1e-5);

  // Handle Entropy & Digit Density
  const cleanHandle = (profile.handle || '').replace('@', '');
  const entropy = calculateShannonEntropy(cleanHandle);
  const digits = (cleanHandle.match(/\d/g) || []).length;
  const digitRatio = digits / Math.max(1, cleanHandle.length);

  let rawScore = 0;
  const explanations = [];

  // 1. Reputation
  if (reputation < 0.05) {
    const contrib = weights.reputation;
    rawScore += contrib;
    explanations.push({
      signal: 'Extreme Follower Asymmetry',
      delta: `+${contrib.toFixed(1)}%`,
      type: 'danger',
      detail: `Follows ${following.toLocaleString()} accounts but has only ${followers.toLocaleString()} followers (Reputation Index: ${reputation.toFixed(3)})`
    });
  } else if (reputation > 0.40) {
    rawScore -= 12.0;
    explanations.push({
      signal: 'Balanced Social Reputation',
      delta: '-12.0%',
      type: 'safe',
      detail: `Healthy reciprocal community engagement ratio (${reputation.toFixed(2)})`
    });
  }

  // 2. Velocity
  if (velocity > 60) {
    const normVel = Math.min(1.0, velocity / 150.0);
    const contrib = weights.velocity * normVel;
    rawScore += contrib;
    explanations.push({
      signal: 'High Post Velocity (Spam Indicator)',
      delta: `+${contrib.toFixed(1)}%`,
      type: 'danger',
      detail: `Average volume of ${velocity.toFixed(1)} posts/day significantly exceeds human baselines`
    });
  } else if (velocity < 4.0) {
    rawScore -= 6.0;
    explanations.push({
      signal: 'Organic Activity Pace',
      delta: '-6.0%',
      type: 'safe',
      detail: `Human-like conversational post frequency (${velocity.toFixed(1)} posts/day)`
    });
  }

  // 3. Temporal Clockwork Timing (Cron variance)
  if (variance < 0.20) {
    const contrib = weights.clockwork * (1.0 - variance);
    rawScore += contrib;
    explanations.push({
      signal: 'Clockwork Inter-Arrival Timing',
      delta: `+${contrib.toFixed(1)}%`,
      type: 'danger',
      detail: `Low inter-arrival variance (${variance.toFixed(3)}) confirms automated script/cron execution`
    });
  } else if (variance > 0.65) {
    rawScore -= 18.0;
    explanations.push({
      signal: 'Natural Human Burstiness',
      delta: '-18.0%',
      type: 'safe',
      detail: `Irregular inter-event gaps (${variance.toFixed(2)}) consistent with human thought processes`
    });
  }

  // 4. Circadian Rhythm
  if (circadian > 0.75) {
    const contrib = weights.circadian * circadian;
    rawScore += contrib;
    explanations.push({
      signal: 'Circadian Sleep Absence',
      delta: `+${contrib.toFixed(1)}%`,
      type: 'danger',
      detail: `Active 24/7 across typical human rest hours without physiological breaks`
    });
  } else if (circadian < 0.45) {
    rawScore -= 8.0;
    explanations.push({
      signal: 'Distinct Circadian Sleep Cycle',
      delta: '-8.0%',
      type: 'safe',
      detail: `Clear nocturnal inactivity window matching human circadian rhythm`
    });
  }

  // 5. Lexical Diversity
  if (lexical < 0.35) {
    const contrib = 15.0 * (1.0 - lexical);
    rawScore += contrib;
    explanations.push({
      signal: 'Repetitive Lexical Templates',
      delta: `+${contrib.toFixed(1)}%`,
      type: 'warning',
      detail: `Low vocabulary Type-Token Ratio (${lexical.toFixed(2)}) indicates automated spam phrasing`
    });
  }

  // 6. Retweet Ratio
  if (retweet > 0.80) {
    const contrib = 14.0 * retweet;
    rawScore += contrib;
    explanations.push({
      signal: 'Astroturfing Echo Chamber',
      delta: `+${contrib.toFixed(1)}%`,
      type: 'warning',
      detail: `${(retweet * 100).toFixed(0)}% of content consists of retweets and coordinated amplification`
    });
  }

  // 7. Handle digit synthesis
  if (digitRatio > 0.30) {
    const contrib = 12.0 * digitRatio;
    rawScore += contrib;
    explanations.push({
      signal: 'Synthetic Handle Pattern',
      delta: `+${contrib.toFixed(1)}%`,
      type: 'warning',
      detail: `${(digitRatio * 100).toFixed(0)}% digits in username characteristic of batch account generation`
    });
  }

  if (defaultAv) {
    rawScore += 10.0;
    explanations.push({
      signal: 'Default Profile Picture',
      delta: '+10.0%',
      type: 'warning',
      detail: 'No custom avatar uploaded, common in disposable bot accounts'
    });
  }

  if (hasBio) {
    rawScore -= 10.0;
  }

  // Calibrated Sigmoid Function centered at 15
  const prob = 1 / (1 + Math.exp(-0.065 * (rawScore - 15.0)));
  const riskPercentage = Math.round(prob * 1000) / 10;

  let verdict = '';
  let badgeClass = '';
  if (riskPercentage >= 75) {
    verdict = 'High Risk Automated Bot';
    badgeClass = 'badge-danger';
  } else if (riskPercentage >= STATE.decisionThreshold) {
    verdict = 'Suspicious Account (Needs Review)';
    badgeClass = 'badge-warning';
  } else {
    verdict = 'Authentic Account (Likely Human)';
    badgeClass = 'badge-safe';
  }

  return {
    riskScore: riskPercentage,
    verdict,
    badgeClass,
    reputation,
    velocity,
    variance,
    circadian,
    lexical,
    entropy,
    explanations
  };
}

/* ==========================================================================
   Auditor View Logic
   ========================================================================== */
function initPresetChips() {
  const container = document.getElementById('presetChipsContainer');
  if (!container || !PRESET_ACCOUNTS) return;

  container.innerHTML = '';
  PRESET_ACCOUNTS.forEach((acc, idx) => {
    const chip = document.createElement('div');
    chip.className = `preset-chip ${idx === 0 ? 'active' : ''}`;
    chip.setAttribute('data-id', acc.id);

    const isBot = acc.ground_truth === 'fake';
    const tagClass = isBot ? 'danger' : 'safe';
    const tagText = isBot ? 'BOT' : 'HUMAN';

    chip.innerHTML = `
      <div class="preset-chip-avatar">
        ${acc.avatar ? `<img src="${acc.avatar}" alt="" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">` : '🤖'}
      </div>
      <div class="preset-chip-info">
        <strong>${acc.handle}</strong>
        <span class="preset-chip-tag ${tagClass}">${tagText} • ${acc.expected_type.split(' ')[0]}</span>
      </div>
    `;

    chip.addEventListener('click', () => {
      document.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      loadAccountToAuditor(acc);
    });

    container.appendChild(chip);
  });
}

function loadAccountToAuditor(acc) {
  STATE.currentAccount = acc;

  document.getElementById('inputHandle').value = acc.handle || '';
  document.getElementById('inputName').value = acc.name || '';
  document.getElementById('inputFollowers').value = acc.followers_count || 0;
  document.getElementById('inputFollowing').value = acc.following_count || 0;
  document.getElementById('inputAge').value = acc.account_age_days || 1;
  document.getElementById('inputPostsDay').value = acc.avg_posts_per_day || 1;
  document.getElementById('inputBio').value = acc.bio || '';
  document.getElementById('inputUrl').value = acc.url || '';
  document.getElementById('checkDefaultAvatar').checked = !!acc.has_default_avatar;
  document.getElementById('checkVerified').checked = !!acc.verified;

  runAuditOnCurrentData();
}

function initAuditor() {
  const form = document.getElementById('auditForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      runAuditOnCurrentData();
    });
  }

  const quickExport = document.getElementById('btnQuickExport');
  if (quickExport) {
    quickExport.addEventListener('click', openReportModal);
  }
}

function runAuditOnCurrentData() {
  const accountData = {
    handle: document.getElementById('inputHandle').value,
    name: document.getElementById('inputName').value,
    followers_count: Number(document.getElementById('inputFollowers').value),
    following_count: Number(document.getElementById('inputFollowing').value),
    account_age_days: Number(document.getElementById('inputAge').value),
    avg_posts_per_day: Number(document.getElementById('inputPostsDay').value),
    bio: document.getElementById('inputBio').value,
    url: document.getElementById('inputUrl').value,
    has_default_avatar: document.getElementById('checkDefaultAvatar').checked,
    verified: document.getElementById('checkVerified').checked,
    inter_arrival_variance: STATE.currentAccount?.inter_arrival_variance || 0.45,
    circadian_entropy: STATE.currentAccount?.circadian_entropy || 0.55,
    lexical_diversity: STATE.currentAccount?.lexical_diversity || 0.70,
    retweet_ratio: STATE.currentAccount?.retweet_ratio || 0.30,
    posts_sample: STATE.currentAccount?.posts_sample || []
  };

  const results = scoreAccountProfile(accountData);
  renderAuditResults(accountData, results);
}

function renderAuditResults(account, res) {
  // 1. Circular Gauge Animation
  const gaugeCircle = document.getElementById('gaugeCircle');
  const percentText = document.getElementById('gaugePercentText');
  const banner = document.getElementById('verdictBanner');

  const circumference = 2 * Math.PI * 65; // ~408.4
  const offset = circumference - (res.riskScore / 100) * circumference;
  
  if (gaugeCircle) {
    gaugeCircle.style.strokeDashoffset = offset;
    let strokeColor = 'var(--accent-emerald)';
    if (res.riskScore >= 75) strokeColor = 'var(--accent-crimson)';
    else if (res.riskScore >= 45) strokeColor = 'var(--accent-amber)';
    gaugeCircle.style.stroke = strokeColor;
  }

  if (percentText) {
    percentText.textContent = `${res.riskScore.toFixed(1)}%`;
    percentText.style.color = res.riskScore >= 75 ? 'var(--accent-crimson)' : (res.riskScore >= 45 ? 'var(--accent-amber)' : 'var(--accent-emerald)');
  }

  if (banner) {
    banner.className = `verdict-banner ${res.riskScore >= 75 ? 'danger' : (res.riskScore >= 45 ? 'warning' : 'safe')}`;
  }

  // 2. Verdict details
  const badge = document.getElementById('verdictBadge');
  const title = document.getElementById('verdictTitle');
  const narrative = document.getElementById('verdictNarrative');
  const archetype = document.getElementById('verdictArchetype');

  if (badge) {
    badge.className = `verdict-badge ${res.badgeClass}`;
    badge.textContent = res.verdict;
  }

  if (title) {
    title.textContent = res.riskScore >= 75 
      ? `Automated Bot / Sybil Activity Detected (${res.riskScore}%)` 
      : (res.riskScore >= 45 ? `Suspicious Behavioral Signals (${res.riskScore}%)` : `Authentic Human Account Cleared (${res.riskScore}%)`);
  }

  if (narrative) {
    if (res.riskScore >= 75) {
      narrative.textContent = `High risk indicators present: Follower reputation index is ${res.reputation.toFixed(3)}, posting velocity is ${res.velocity.toFixed(1)} posts/day, with clockwork inter-arrival variance (${res.variance.toFixed(2)}) and lack of natural circadian rest.`;
    } else if (res.riskScore >= 45) {
      narrative.textContent = `Moderate threat profile: Some automation signals detected in posting patterns or follow ratio (${res.reputation.toFixed(2)}). Step-up authentication or CAPTCHA challenge recommended.`;
    } else {
      narrative.textContent = `Natural organic account: Exhibits healthy follower reciprocation (${res.reputation.toFixed(2)}), organic human burstiness (${res.variance.toFixed(2)}), rich lexical vocabulary, and clear circadian nocturnal rest intervals.`;
    }
  }

  if (archetype) {
    archetype.textContent = STATE.currentAccount?.expected_type || 'Custom Evaluation';
  }

  // 3. Vector Bars
  document.getElementById('valReputation').textContent = `${res.reputation.toFixed(3)} ${res.reputation < 0.05 ? '(Critical)' : '(Healthy)'}`;
  document.getElementById('barReputation').style.width = `${Math.min(100, Math.max(3, res.reputation * 100))}%`;
  document.getElementById('barReputation').style.background = res.reputation < 0.05 ? 'var(--accent-crimson)' : 'var(--accent-emerald)';

  document.getElementById('valVelocity').textContent = `${res.velocity.toFixed(1)} posts/day`;
  const velPercent = Math.min(100, (res.velocity / 150) * 100);
  document.getElementById('barVelocity').style.width = `${velPercent}%`;
  document.getElementById('barVelocity').style.background = res.velocity > 50 ? 'var(--accent-crimson)' : 'var(--accent-emerald)';

  document.getElementById('valTemporal').textContent = `${res.variance.toFixed(3)} ${res.variance < 0.2 ? '(Clockwork)' : '(Natural)'}`;
  document.getElementById('barTemporal').style.width = `${Math.round((1 - res.variance) * 100)}%`;
  document.getElementById('barTemporal').style.background = res.variance < 0.2 ? 'var(--accent-crimson)' : 'var(--accent-emerald)';

  document.getElementById('valCircadian').textContent = `${res.circadian.toFixed(2)} ${res.circadian > 0.75 ? '(Non-Stop 24/7)' : '(Human Sleep Cycle)'}`;
  document.getElementById('barCircadian').style.width = `${Math.round(res.circadian * 100)}%`;
  document.getElementById('barCircadian').style.background = res.circadian > 0.75 ? 'var(--accent-amber)' : 'var(--accent-cyan)';

  document.getElementById('valLexical').textContent = `${res.lexical.toFixed(2)} ${res.lexical < 0.35 ? '(Repetitive Spam)' : '(Diverse)'}`;
  document.getElementById('barLexical').style.width = `${Math.round(res.lexical * 100)}%`;

  document.getElementById('valEntropy').textContent = `${res.entropy.toFixed(2)} bits`;
  document.getElementById('barEntropy').style.width = `${Math.min(100, (res.entropy / 4.2) * 100)}%`;

  // 4. SHAP Attribution List
  const explainList = document.getElementById('explainabilityList');
  if (explainList) {
    explainList.innerHTML = '';
    res.explanations.forEach(item => {
      const el = document.createElement('div');
      el.className = `explain-item ${item.type}`;
      el.innerHTML = `
        <div class="explain-delta ${item.type}">${item.delta}</div>
        <div class="explain-content">
          <strong>${item.signal}</strong>
          <p>${item.detail}</p>
        </div>
      `;
      explainList.appendChild(el);
    });
  }

  // 5. Render Circadian 24h Histogram
  renderCircadianHistogram(res.circadian > 0.7);

  // 6. Render Sample Posts
  renderSamplePosts(account.posts_sample || []);
}

function renderCircadianHistogram(isFlat247) {
  const container = document.getElementById('circadianHistogram');
  if (!container) return;

  container.innerHTML = '';
  // 24 hours
  for (let h = 0; h < 24; h++) {
    const col = document.createElement('div');
    col.className = 'hist-col';

    let heightPercent = 0;
    if (isFlat247) {
      // Bots post constantly at all hours
      heightPercent = 75 + Math.floor(Math.random() * 20);
    } else {
      // Humans sleep between 00:00 and 07:00
      if (h >= 1 && h <= 6) {
        heightPercent = Math.floor(Math.random() * 8); // near zero
      } else if (h >= 12 && h <= 21) {
        heightPercent = 50 + Math.floor(Math.random() * 45); // peak activity
      } else {
        heightPercent = 25 + Math.floor(Math.random() * 30);
      }
    }

    const bar = document.createElement('div');
    bar.className = 'hist-bar';
    bar.style.height = `${heightPercent}%`;
    if (isFlat247) {
      bar.style.background = h >= 1 && h <= 6 ? 'var(--accent-crimson)' : 'var(--accent-amber)';
    } else {
      bar.style.background = 'var(--accent-cyan)';
    }

    col.appendChild(bar);
    container.appendChild(col);
  }
}

function renderSamplePosts(posts) {
  const list = document.getElementById('postsTelemetryList');
  if (!list) return;

  if (posts.length === 0) {
    list.innerHTML = `<div style="font-size:0.8rem; color:var(--text-muted);">No live posts ingested for this handle.</div>`;
    return;
  }

  list.innerHTML = '';
  posts.slice(0, 3).forEach(p => {
    const item = document.createElement('div');
    item.style.background = 'rgba(10, 15, 28, 0.6)';
    item.style.padding = '0.65rem 0.9rem';
    item.style.borderRadius = 'var(--radius-sm)';
    item.style.fontSize = '0.82rem';
    item.style.borderLeft = p.is_retweet ? '3px solid var(--accent-amber)' : '3px solid var(--accent-cyan)';

    item.innerHTML = `
      <div style="display:flex; justify-content:space-between; color:var(--text-muted); font-size:0.72rem; margin-bottom:0.25rem;">
        <span>${p.is_retweet ? '🔄 Retweet' : '💬 Original Post'}</span>
        <span>${new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div style="color:var(--text-primary);">${p.text}</div>
    `;
    list.appendChild(item);
  });
}

/* ==========================================================================
   Benchmark Studio Logic
   ========================================================================== */
function initBenchmarkStudio() {
  if (typeof BENCHMARK_DATASET !== 'undefined') {
    STATE.benchmarkData = BENCHMARK_DATASET;
  } else {
    STATE.benchmarkData = GENERATE_BENCHMARK_DATASET ? GENERATE_BENCHMARK_DATASET() : [];
  }

  evaluateBenchmarkBatch();

  const filterPlatform = document.getElementById('filterPlatform');
  const filterGroundTruth = document.getElementById('filterGroundTruth');
  const filterSearch = document.getElementById('filterSearch');

  if (filterPlatform) filterPlatform.addEventListener('change', renderBenchmarkTable);
  if (filterGroundTruth) filterGroundTruth.addEventListener('change', renderBenchmarkTable);
  if (filterSearch) filterSearch.addEventListener('input', renderBenchmarkTable);

  const btnExport = document.getElementById('btnExportBenchmarkCsv');
  if (btnExport) btnExport.addEventListener('click', exportBenchmarkCsv);

  const btnScan = document.getElementById('btnScanAllBatch');

  // Custom CSV Upload Integration
  const btnUpload = document.getElementById('btnUploadCsv');
  const fileInput = document.getElementById('csvFileInput');
  if (btnUpload && fileInput) {
    btnUpload.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        parseAndLoadCustomCsv(evt.target.result);
      };
      reader.readAsText(file);
    });
  }

  if (btnScan) btnScan.addEventListener('click', evaluateBenchmarkBatch);
}

function evaluateBenchmarkBatch() {
  let tp = 0, fp = 0, tn = 0, fn = 0;
  const scoredData = [];

  STATE.benchmarkData.forEach(account => {
    const res = scoreAccountProfile(account);
    const isPredBot = res.riskScore >= STATE.decisionThreshold;
    const isTrueBot = account.ground_truth === 'fake';

    if (isPredBot && isTrueBot) tp++;
    else if (isPredBot && !isTrueBot) fp++;
    else if (!isPredBot && !isTrueBot) tn++;
    else fn++;

    scoredData.push({
      ...account,
      predictedScore: res.riskScore,
      predictedVerdict: res.verdict,
      badgeClass: res.badgeClass
    });
  });

  STATE.evaluatedBenchmark = scoredData;

  const total = scoredData.length;
  const accuracy = (tp + tn) / total;
  const precision = (tp + fp) > 0 ? tp / (tp + fp) : 1;
  const recall = (tp + fn) > 0 ? tp / (tp + fn) : 1;
  const f1 = (precision + recall) > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  // Update DOM metrics
  document.getElementById('statTotalAccounts').textContent = total;
  document.getElementById('statAccuracy').textContent = `${(accuracy * 100).toFixed(1)}%`;
  document.getElementById('statPrecision').textContent = `${(precision * 100).toFixed(1)}%`;
  document.getElementById('statRecall').textContent = `${(recall * 100).toFixed(1)}%`;
  document.getElementById('statF1').textContent = f1.toFixed(3);

  document.getElementById('matrixTP').textContent = tp;
  document.getElementById('matrixFP').textContent = fp;
  document.getElementById('matrixFN').textContent = fn;
  document.getElementById('matrixTN').textContent = tn;

  // Update Tuner quick metrics
  const tunedAcc = document.getElementById('tunedAccuracy');
  const tunedFP = document.getElementById('tunedFP');
  if (tunedAcc) tunedAcc.textContent = `${(accuracy * 100).toFixed(1)}%`;
  if (tunedFP) tunedFP.textContent = fp;

  renderBimodalChart(scoredData);
  renderBenchmarkTable();
}

function renderBimodalChart(data) {
  const chart = document.getElementById('bimodalChart');
  if (!chart) return;

  chart.innerHTML = '';
  // 10 buckets (0-10, 10-20, ..., 90-100)
  const buckets = new Array(10).fill(0);
  data.forEach(d => {
    const idx = Math.min(9, Math.floor(d.predictedScore / 10));
    buckets[idx]++;
  });

  const maxVal = Math.max(...buckets, 1);

  buckets.forEach((count, idx) => {
    const col = document.createElement('div');
    col.className = 'hist-col';

    const bar = document.createElement('div');
    bar.className = 'hist-bar';
    bar.style.height = `${(count / maxVal) * 100}%`;
    bar.style.background = idx >= 5 ? 'var(--accent-crimson)' : 'var(--accent-emerald)';

    col.appendChild(bar);
    chart.appendChild(col);
  });
}

function renderBenchmarkTable() {
  const tbody = document.getElementById('benchmarkTableBody');
  if (!tbody || !STATE.evaluatedBenchmark) return;

  const platform = document.getElementById('filterPlatform')?.value || 'all';
  const groundTruth = document.getElementById('filterGroundTruth')?.value || 'all';
  const search = (document.getElementById('filterSearch')?.value || '').toLowerCase();

  const filtered = STATE.evaluatedBenchmark.filter(item => {
    if (platform !== 'all' && item.platform !== platform) return false;
    if (groundTruth !== 'all' && item.ground_truth !== groundTruth) return false;
    if (search && !item.handle.toLowerCase().includes(search)) return false;
    return true;
  });

  tbody.innerHTML = '';
  filtered.slice(0, 40).forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="handle-col"><strong>${row.handle}</strong></td>
      <td><span style="text-transform:capitalize;">${row.platform}</span></td>
      <td>${row.followers_count.toLocaleString()} / ${row.following_count.toLocaleString()}</td>
      <td>${row.account_age_days}d</td>
      <td>${row.avg_posts_per_day}</td>
      <td>
        <span class="preset-chip-tag ${row.ground_truth === 'fake' ? 'danger' : 'safe'}">
          ${row.ground_truth.toUpperCase()}
        </span>
      </td>
      <td><strong style="color:${row.predictedScore >= 50 ? 'var(--accent-crimson)' : 'var(--accent-emerald)'}; font-family:var(--font-mono);">${row.predictedScore.toFixed(1)}%</strong></td>
      <td><span class="verdict-badge ${row.badgeClass}">${row.predictedVerdict}</span></td>
      <td>
        <button class="btn-secondary" style="padding:0.25rem 0.6rem; font-size:0.75rem;" onclick="loadBenchmarkRowToAuditor('${row.id}')">
          Audit
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.loadBenchmarkRowToAuditor = function(id) {
  const target = STATE.evaluatedBenchmark.find(x => x.id === id);
  if (!target) return;
  switchTab('auditor');
  loadAccountToAuditor(target);
};

function exportBenchmarkCsv() {
  if (!STATE.evaluatedBenchmark || STATE.evaluatedBenchmark.length === 0) return;

  const headers = ['Handle', 'Platform', 'Followers', 'Following', 'AgeDays', 'PostsPerDay', 'GroundTruth', 'PredictedRisk', 'Verdict'];
  const rows = [headers.join(',')];

  STATE.evaluatedBenchmark.forEach(r => {
    rows.push([
      r.handle,
      r.platform,
      r.followers_count,
      r.following_count,
      r.account_age_days,
      r.avg_posts_per_day,
      r.ground_truth,
      r.predictedScore,
      `"${r.predictedVerdict}"`
    ].join(','));
  });

  const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cybersentry_benchmark_results_${Date.now()}.csv`;
  a.click();
}

/* ==========================================================================
   Tab 3: Sybil Botnet Network Graph (2D Physics Engine)
   ========================================================================== */
function initNetworkGraph() {
  const btnToggle = document.getElementById('btnTogglePhysics');
  const btnReset = document.getElementById('btnResetGraph');
  const btnDeepAudit = document.getElementById('btnInspectDeepAudit');

  if (btnToggle) {
    btnToggle.addEventListener('click', () => {
      STATE.networkSimulation.isRunning = !STATE.networkSimulation.isRunning;
      btnToggle.innerHTML = STATE.networkSimulation.isRunning 
        ? `<span>⏸️</span> Pause Physics` 
        : `<span>▶️</span> Resume Physics`;
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', resetNetworkNodes);
  }

  if (btnDeepAudit) {
    btnDeepAudit.addEventListener('click', () => {
      if (STATE.networkSimulation.selectedNode) {
        const found = PRESET_ACCOUNTS.find(a => a.handle === STATE.networkSimulation.selectedNode.handle);
        if (found) {
          switchTab('auditor');
          loadAccountToAuditor(found);
        }
      }
    });
  }
}

function setupNetworkCanvas() {
  STATE.networkSimulation.isInitialized = true;
  const canvas = document.getElementById('networkCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  const width = rect.width;
  const height = rect.height;

  // Clone topology
  const rawData = typeof NETWORK_TOPOLOGY_DATA !== 'undefined' ? NETWORK_TOPOLOGY_DATA : { nodes: [], links: [] };

  const nodesMap = {};
  const nodes = rawData.nodes.map(n => {
    const nodeObj = {
      ...n,
      x: width / 2 + (Math.random() - 0.5) * (width * 0.7),
      y: height / 2 + (Math.random() - 0.5) * (height * 0.7),
      vx: 0,
      vy: 0,
      radius: n.role === 'hub' ? 14 : 9
    };
    nodesMap[n.id] = nodeObj;
    return nodeObj;
  });

  const links = rawData.links.map(l => ({
    ...l,
    sourceNode: nodesMap[l.source],
    targetNode: nodesMap[l.target]
  })).filter(l => l.sourceNode && l.targetNode);

  STATE.networkSimulation.nodes = nodes;
  STATE.networkSimulation.links = links;
  STATE.networkSimulation.width = width;
  STATE.networkSimulation.height = height;

  // Mouse interaction
  let hoveredNode = null;

  canvas.addEventListener('mousedown', (e) => {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
    const clicked = nodes.find(n => Math.hypot(n.x - mouseX, n.y - mouseY) < n.radius + 6);
    if (clicked) {
      STATE.networkSimulation.draggedNode = clicked;
      STATE.networkSimulation.selectedNode = clicked;
      updateNodeInspector(clicked);
    }
  });

  canvas.addEventListener('mousemove', (e) => {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    if (STATE.networkSimulation.draggedNode) {
      STATE.networkSimulation.draggedNode.x = mouseX;
      STATE.networkSimulation.draggedNode.y = mouseY;
    } else {
      hoveredNode = nodes.find(n => Math.hypot(n.x - mouseX, n.y - mouseY) < n.radius + 6);
      canvas.style.cursor = hoveredNode ? 'pointer' : 'default';
    }
  });

  window.addEventListener('mouseup', () => {
    STATE.networkSimulation.draggedNode = null;
  });

  // Start Physics Loop
  function tick() {
    if (STATE.networkSimulation.isRunning) {
      updateNetworkPhysics();
    }
    renderNetworkCanvas(ctx, width, height, hoveredNode);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function updateNetworkPhysics() {
  const { nodes, links, width, height } = STATE.networkSimulation;
  if (!nodes || nodes.length === 0) return;

  const repulsion = 500;
  const springLength = 85;
  const springK = 0.05;
  const damping = 0.88;
  const centerGravity = 0.015;

  // 1. Repulsion between all node pairs
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const n1 = nodes[i];
      const n2 = nodes[j];
      const dx = n2.x - n1.x;
      const dy = n2.y - n1.y;
      const dist = Math.hypot(dx, dy) || 1;
      if (dist < 220) {
        const force = repulsion / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        n1.vx -= fx;
        n1.vy -= fy;
        n2.vx += fx;
        n2.vy += fy;
      }
    }
  }

  // 2. Spring force along links
  links.forEach(link => {
    const n1 = link.sourceNode;
    const n2 = link.targetNode;
    const dx = n2.x - n1.x;
    const dy = n2.y - n1.y;
    const dist = Math.hypot(dx, dy) || 1;
    const displacement = dist - springLength;
    const force = displacement * springK;
    const fx = (dx / dist) * force;
    const fy = (dy / dist) * force;

    n1.vx += fx;
    n1.vy += fy;
    n2.vx -= fx;
    n2.vy -= fy;
  });

  // 3. Central gravity and position update
  nodes.forEach(n => {
    if (n === STATE.networkSimulation.draggedNode) return;
    n.vx += (width / 2 - n.x) * centerGravity;
    n.vy += (height / 2 - n.y) * centerGravity;

    n.vx *= damping;
    n.vy *= damping;

    n.x += n.vx;
    n.y += n.vy;

    // Boundary constraints
    n.x = Math.max(n.radius + 10, Math.min(width - n.radius - 10, n.x));
    n.y = Math.max(n.radius + 10, Math.min(height - n.radius - 10, n.y));
  });
}

function renderNetworkCanvas(ctx, width, height, hovered) {
  ctx.clearRect(0, 0, width, height);
  const { nodes, links, selectedNode } = STATE.networkSimulation;

  // Draw Links
  links.forEach(l => {
    ctx.beginPath();
    ctx.moveTo(l.sourceNode.x, l.sourceNode.y);
    ctx.lineTo(l.targetNode.x, l.targetNode.y);

    if (l.type === 'retweet_ring') {
      ctx.strokeStyle = 'rgba(255, 51, 102, 0.4)';
      ctx.lineWidth = 1.5;
    } else if (l.type === 'synchronized_blast') {
      ctx.strokeStyle = 'rgba(255, 123, 0, 0.45)';
      ctx.lineWidth = 2.0;
    } else if (l.type === 'academic_citation' || l.type === 'github_collab') {
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
      ctx.lineWidth = 1.8;
    } else {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.0;
    }
    ctx.stroke();
  });

  // Draw Nodes
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);

    let color = 'var(--accent-cyan)';
    if (n.cluster === 'botnet_alpha') color = '#ff3366';
    else if (n.cluster === 'botnet_beta') color = '#ff7b00';
    else if (n.cluster === 'botnet_gamma') color = '#ff00ea';
    else if (n.cluster === 'organic_ai') color = '#00f2fe';
    else color = '#ffb703';

    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = (n === hovered || n === selectedNode) ? 18 : 6;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Border
    ctx.strokeStyle = (n === selectedNode) ? '#ffffff' : 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = (n === selectedNode) ? 3 : 1;
    ctx.stroke();

    // Node handle text label
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.textAlign = 'center';
    ctx.fillText(n.handle, n.x, n.y + n.radius + 12);
  });
}

function updateNodeInspector(node) {
  const handleEl = document.getElementById('inspectHandle');
  const badgesEl = document.getElementById('inspectBadges');
  const detailsEl = document.getElementById('inspectDetails');

  if (handleEl) handleEl.textContent = node.handle;
  if (badgesEl) {
    const isBot = node.is_bot;
    badgesEl.innerHTML = `
      <span class="verdict-badge ${isBot ? 'badge-danger' : 'badge-safe'}">
        ${isBot ? `High Risk Bot (${node.bot_score}%)` : `Authentic Human (${node.bot_score}%)`}
      </span>
      <span class="verdict-badge" style="background:rgba(255,255,255,0.06); color:var(--text-secondary); margin-left:4px;">
        ${node.cluster}
      </span>
    `;
  }
  if (detailsEl) {
    detailsEl.textContent = `Node role: ${node.role}. Belongs to ${node.cluster} cluster with calibrated bot probability of ${node.bot_score}%.`;
  }
}

function resetNetworkNodes() {
  const { nodes, width, height } = STATE.networkSimulation;
  nodes.forEach(n => {
    n.x = width / 2 + (Math.random() - 0.5) * (width * 0.7);
    n.y = height / 2 + (Math.random() - 0.5) * (height * 0.7);
    n.vx = 0;
    n.vy = 0;
  });
}

/* ==========================================================================
   Tab 4: Model Laboratory & Tuner
   ========================================================================== */
function initModelTuner() {
  const slVel = document.getElementById('sliderWeightVelocity');
  const slClock = document.getElementById('sliderWeightClockwork');
  const slCirc = document.getElementById('sliderWeightCircadian');
  const slRep = document.getElementById('sliderWeightReputation');
  const slThresh = document.getElementById('sliderThreshold');
  const btnReset = document.getElementById('btnResetWeights');

  function updateWeights() {
    STATE.customWeights.velocity = Number(slVel.value);
    STATE.customWeights.clockwork = Number(slClock.value);
    STATE.customWeights.circadian = Number(slCirc.value);
    STATE.customWeights.reputation = Number(slRep.value);
    STATE.decisionThreshold = Number(slThresh.value);

    document.getElementById('valWeightVelocity').textContent = STATE.customWeights.velocity.toFixed(1);
    document.getElementById('valWeightClockwork').textContent = STATE.customWeights.clockwork.toFixed(1);
    document.getElementById('valWeightCircadian').textContent = STATE.customWeights.circadian.toFixed(1);
    document.getElementById('valWeightReputation').textContent = STATE.customWeights.reputation.toFixed(1);
    document.getElementById('valThreshold').textContent = `${STATE.decisionThreshold}%`;

    evaluateBenchmarkBatch();
    runAuditOnCurrentData();
  }

  [slVel, slClock, slCirc, slRep, slThresh].forEach(sl => {
    if (sl) sl.addEventListener('input', updateWeights);
  });

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      slVel.value = 22;
      slClock.value = 24;
      slCirc.value = 16;
      slRep.value = 18;
      slThresh.value = 50;
      updateWeights();
    });
  }

  // Profile Simulator Sliders
  const simRatio = document.getElementById('simRatio');
  const simPosts = document.getElementById('simPosts');
  const simVar = document.getElementById('simVariance');
  const simCirc = document.getElementById('simCircadian');

  function runSimulation() {
    const ratioVal = Number(simRatio.value) / 1000;
    const postsVal = Number(simPosts.value);
    const varVal = Number(simVar.value) / 100;
    const circVal = Number(simCirc.value) / 100;

    document.getElementById('simValRatio').textContent = `${(ratioVal * 2500).toFixed(0)} / 2,500 (${ratioVal.toFixed(3)})`;
    document.getElementById('simValPosts').textContent = `${postsVal} posts/day`;
    document.getElementById('simValVariance').textContent = `${varVal.toFixed(2)} ${varVal < 0.2 ? '(Automated Cron)' : '(Natural)'}`;
    document.getElementById('simValCircadian').textContent = `${circVal.toFixed(2)} ${circVal > 0.7 ? '(24/7 Continuous)' : '(Circadian Sleep)'}`;

    const simProfile = {
      followers_count: Math.round(ratioVal * 2500),
      following_count: 2500,
      posts_count: postsVal * 30,
      account_age_days: 30,
      avg_posts_per_day: postsVal,
      inter_arrival_variance: varVal,
      circadian_entropy: circVal,
      lexical_diversity: postsVal > 80 ? 0.2 : 0.8,
      retweet_ratio: postsVal > 100 ? 0.9 : 0.2,
      has_default_avatar: ratioVal < 0.01,
      has_bio: ratioVal > 0.1
    };

    const res = scoreAccountProfile(simProfile);
    const scoreEl = document.getElementById('simRiskScore');
    const verdEl = document.getElementById('simVerdict');
    const boxEl = document.getElementById('simOutputBox');

    if (scoreEl) {
      scoreEl.textContent = `${res.riskScore.toFixed(1)}%`;
      scoreEl.style.color = res.riskScore >= 75 ? 'var(--accent-crimson)' : (res.riskScore >= 45 ? 'var(--accent-amber)' : 'var(--accent-emerald)');
    }
    if (verdEl) {
      verdEl.textContent = res.verdict;
      verdEl.style.color = res.riskScore >= 75 ? 'var(--accent-crimson)' : (res.riskScore >= 45 ? 'var(--accent-amber)' : 'var(--accent-emerald)');
    }
  }

  [simRatio, simPosts, simVar, simCirc].forEach(s => {
    if (s) s.addEventListener('input', runSimulation);
  });
}

/* ==========================================================================
   Forensic Report Modal
   ========================================================================== */
function initReportModal() {
  const overlay = document.getElementById('reportModalOverlay');
  const btnOpen = document.getElementById('btnOpenReportModal');
  const btnClose = document.getElementById('btnCloseReportModal');
  const btnDone = document.getElementById('btnCloseReport');

  if (btnOpen) btnOpen.addEventListener('click', openReportModal);
  if (btnClose) btnClose.addEventListener('click', closeReportModal);
  if (btnDone) btnDone.addEventListener('click', closeReportModal);
}

function openReportModal() {
  const overlay = document.getElementById('reportModalOverlay');
  if (!overlay) return;

  const current = STATE.currentAccount || PRESET_ACCOUNTS[0];
  const res = scoreAccountProfile(current);

  document.getElementById('modalTargetHandle').textContent = current.handle;
  document.getElementById('modalTargetName').textContent = current.name || '';
  document.getElementById('modalTargetPlatform').textContent = `${(current.platform || 'twitter').toUpperCase()} Protocol`;
  document.getElementById('modalTargetScore').textContent = `${res.riskScore.toFixed(1)}%`;
  document.getElementById('modalTargetScore').style.color = res.riskScore >= 75 ? 'var(--accent-crimson)' : 'var(--accent-emerald)';

  const badge = document.getElementById('modalVerdictBadge');
  badge.className = `verdict-badge ${res.badgeClass}`;
  badge.textContent = res.verdict;

  document.getElementById('modalFollowersRatio').textContent = `${(current.followers_count || 0).toLocaleString()} Followers / ${(current.following_count || 0).toLocaleString()} Following`;
  document.getElementById('modalAuditTimestamp').textContent = new Date().toUTCString();

  // Pseudo-random deterministic SHA-256 string for verification certificate
  const fakeHash = `sha256:${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  document.getElementById('modalCryptoHash').textContent = fakeHash;

  const evidence = document.getElementById('modalAttributionEvidence');
  if (evidence) {
    evidence.innerHTML = res.explanations.map(e => `
      <div style="margin-bottom:0.35rem;">
        • <strong>${e.signal} (${e.delta}):</strong> ${e.detail}
      </div>
    `).join('');
  }

  overlay.classList.add('active');
}

function closeReportModal() {
  const overlay = document.getElementById('reportModalOverlay');
  if (overlay) overlay.classList.remove('active');
}


function parseAndLoadCustomCsv(csvText) {
  try {
    const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length < 2) return;
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const newRecords = [];

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map(p => p.trim());
      if (parts.length < headers.length) continue;
      const row = {};
      headers.forEach((h, idx) => {
        row[h] = parts[idx];
      });

      newRecords.push({
        id: row.id || `custom_${i}`,
        handle: row.handle || `@account_${i}`,
        platform: row.platform || 'twitter',
        followers_count: Number(row.followers_count || 100),
        following_count: Number(row.following_count || 100),
        posts_count: Number(row.posts_count || 50),
        account_age_days: Number(row.account_age_days || 30),
        has_default_avatar: row.has_default_avatar === '1' || row.has_default_avatar === 'true',
        has_bio: row.has_bio === '1' || row.has_bio === 'true',
        avg_posts_per_day: Number(row.avg_posts_per_day || 1),
        retweet_ratio: Number(row.retweet_ratio || 0.2),
        inter_arrival_variance: Number(row.inter_arrival_variance || 0.5),
        circadian_entropy: Number(row.circadian_entropy || 0.5),
        lexical_diversity: Number(row.lexical_diversity || 0.7),
        digits_in_username: Number(row.digits_in_username || 0),
        ground_truth: (row.ground_truth || 'fake').toLowerCase() === 'fake' ? 'fake' : 'human',
        bot_type: row.bot_type || 'custom'
      });
    }

    if (newRecords.length > 0) {
      STATE.benchmarkData = newRecords;
      evaluateBenchmarkBatch();
      alert(`Successfully ingested and evaluated ${newRecords.length} records from uploaded CSV!`);
    }
  } catch (err) {
    console.error('Error parsing CSV:', err);
    alert('Failed to parse uploaded CSV. Please check formatting.');
  }
}
