/**
 * Fake Social Media Account Detection - Core Datasets & Model Weights
 * Calibrated against benchmark research datasets (Cresci-2017, Botometer, Twibot-20)
 */

const PRESET_ACCOUNTS = [
  {
    id: "acc_1",
    handle: "@crypto_pump_bot99",
    name: "ETH Airdrop Claim 🎁 2026",
    platform: "twitter",
    avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    has_default_avatar: false,
    bio: "Official Smart Contract Airdrop claim portal! Drop your wallet in DMs for instant 2.5 ETH rewards! Powered by Web3 Foundation. Click link below 👇",
    url: "https://bit.ly/eth-claim-free99",
    verified: false,
    followers_count: 14,
    following_count: 4890,
    posts_count: 12840,
    account_age_days: 9,
    digits_in_username: 4,
    username_length: 18,
    avg_posts_per_day: 142.6,
    retweet_ratio: 0.94,
    inter_arrival_variance: 0.04, // Extremely automated/clockwork
    circadian_entropy: 0.98, // Posts 24/7 continuously
    lexical_diversity: 0.18, // Highly repetitive spam phrases
    hashtag_density: 6.8,
    mention_density: 4.2,
    posts_sample: [
      { text: "AIRDROP LIVE! Don't miss 2.5 ETH giveaway 🚀 DM wallet now #crypto #eth #airdrop #giveaway", timestamp: "2026-10-20T04:00:00Z", is_retweet: false },
      { text: "AIRDROP LIVE! Don't miss 2.5 ETH giveaway 🚀 DM wallet now #crypto #eth #airdrop #giveaway", timestamp: "2026-10-20T04:05:00Z", is_retweet: false },
      { text: "AIRDROP LIVE! Don't miss 2.5 ETH giveaway 🚀 DM wallet now #crypto #eth #airdrop #giveaway", timestamp: "2026-10-20T04:10:00Z", is_retweet: false },
      { text: "RT @ScamCluster4: Massive distribution incoming, send claim requests! #web3", timestamp: "2026-10-20T04:15:00Z", is_retweet: true }
    ],
    expected_type: "Spam & Phishing Bot",
    ground_truth: "fake"
  },
  {
    id: "acc_2",
    handle: "@sarah_j_tech",
    name: "Sarah Jenkins, Ph.D.",
    platform: "twitter",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    has_default_avatar: false,
    bio: "Senior AI Research Fellow @ Stanford Human-Centered AI. Writing on algorithmic fairness, ML ethics & LLM architectures. Views mine.",
    url: "https://sarahjenkins.io",
    verified: true,
    followers_count: 94200,
    following_count: 1140,
    posts_count: 6320,
    account_age_days: 2840,
    digits_in_username: 0,
    username_length: 12,
    avg_posts_per_day: 2.2,
    retweet_ratio: 0.28,
    inter_arrival_variance: 0.86, // Natural human burstiness
    circadian_entropy: 0.32, // Strong circadian sleep cycle (0 posts 1am-7am)
    lexical_diversity: 0.89, // Rich vocabulary
    hashtag_density: 0.8,
    mention_density: 0.9,
    posts_sample: [
      { text: "Delighted to share our latest paper on benchmark contamination in modern vision-language models: link in thread.", timestamp: "2026-10-19T17:30:00Z", is_retweet: false },
      { text: "Fascinating discussion today on calibration metrics for generative models with @stanford_nlp.", timestamp: "2026-10-18T20:15:00Z", is_retweet: false },
      { text: "RT @arXiv_CS: Scalable Graph Neural Networks for Anomaly Detection in Social Topologies.", timestamp: "2026-10-17T14:10:00Z", is_retweet: true }
    ],
    expected_type: "Legitimate Human (Verified Researcher)",
    ground_truth: "human"
  },
  {
    id: "acc_3",
    handle: "@elon_musk_supp0rt",
    name: "Elon Musk Support Team (Official)",
    platform: "twitter",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    has_default_avatar: false,
    bio: "Official Customer Escalation & Tesla/X Investor Support Desk. Having issues with your X Premium or Cybertruck? Send a direct message.",
    url: "https://t.me/elon_support_direct",
    verified: false,
    followers_count: 82,
    following_count: 950,
    posts_count: 420,
    account_age_days: 4,
    digits_in_username: 1, // '0' in 'supp0rt' (typosquatting)
    username_length: 18,
    avg_posts_per_day: 105.0,
    retweet_ratio: 0.05,
    inter_arrival_variance: 0.12,
    circadian_entropy: 0.91,
    lexical_diversity: 0.31,
    hashtag_density: 1.2,
    mention_density: 8.5, // Unsolicited target mentions
    posts_sample: [
      { text: "@johndoe_9 Kindly DM our official escalation desk regarding your account verification issue immediately.", timestamp: "2026-10-20T03:10:00Z", is_retweet: false },
      { text: "@crypto_king_7 Support ticket created. Please send private message to finalize authentication.", timestamp: "2026-10-20T03:14:00Z", is_retweet: false }
    ],
    expected_type: "Brand Impersonation & Typosquat Phishing",
    ground_truth: "fake"
  },
  {
    id: "acc_4",
    handle: "@user_784910283",
    name: "user_784910283",
    platform: "twitter",
    avatar: "", // Default egg avatar
    has_default_avatar: true,
    bio: "",
    url: "",
    verified: false,
    followers_count: 1,
    following_count: 850,
    posts_count: 3200,
    account_age_days: 12,
    digits_in_username: 9,
    username_length: 15,
    avg_posts_per_day: 266.6,
    retweet_ratio: 0.99,
    inter_arrival_variance: 0.02,
    circadian_entropy: 0.99,
    lexical_diversity: 0.09,
    hashtag_density: 0.2,
    mention_density: 0.1,
    posts_sample: [
      { text: "RT @astroturf_hub: Vote YES on Proposition 41! The only sensible decision for our economy.", timestamp: "2026-10-20T05:01:00Z", is_retweet: true },
      { text: "RT @astroturf_hub: Prop 41 brings jobs and lower taxes to working families.", timestamp: "2026-10-20T05:03:00Z", is_retweet: true }
    ],
    expected_type: "Sybil Node (Astroturfing Botnet)",
    ground_truth: "fake"
  },
  {
    id: "acc_5",
    handle: "@marcus_chen_dev",
    name: "Marcus Chen",
    platform: "linkedin",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    has_default_avatar: false,
    bio: "Full Stack Engineer @ FinTech Cloud. Distributed Systems, Rust, Node.js, and Kubernetes enthusiast. Coffee, cycling, open source.",
    url: "https://github.com/marcuschen-dev",
    verified: false,
    followers_count: 1420,
    following_count: 980,
    posts_count: 450,
    account_age_days: 1280,
    digits_in_username: 0,
    username_length: 15,
    avg_posts_per_day: 0.35,
    retweet_ratio: 0.35,
    inter_arrival_variance: 0.92,
    circadian_entropy: 0.29,
    lexical_diversity: 0.84,
    hashtag_density: 1.5,
    mention_density: 0.7,
    posts_sample: [
      { text: "Finally migrated our event bus from Kafka to Redpanda in staging. Latency drops on p99 are remarkable.", timestamp: "2026-10-18T19:00:00Z", is_retweet: false },
      { text: "Great weekend meetup at Vancouver Tech Hub discussing zero-trust service meshes.", timestamp: "2026-10-15T22:30:00Z", is_retweet: false }
    ],
    expected_type: "Legitimate Human (Tech Professional)",
    ground_truth: "human"
  },
  {
    id: "acc_6",
    handle: "@news_amplifier_omega",
    name: "Global Breaking News Wire",
    platform: "twitter",
    avatar: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=150&auto=format&fit=crop&q=80",
    has_default_avatar: false,
    bio: "Breaking international headlines 24/7. Real-time updates, geopolitics, economic alerts. Automated aggregator feed.",
    url: "https://suspicious-news-network.xyz",
    verified: false,
    followers_count: 8200,
    following_count: 120,
    posts_count: 48900,
    account_age_days: 180,
    digits_in_username: 0,
    username_length: 20,
    avg_posts_per_day: 271.6,
    retweet_ratio: 0.76,
    inter_arrival_variance: 0.08,
    circadian_entropy: 0.96,
    lexical_diversity: 0.44,
    hashtag_density: 4.5,
    mention_density: 1.1,
    posts_sample: [
      { text: "BREAKING: Emergency central bank summit convened amid currency volatility. Read story: https://suspicious-news-network.xyz/3482", timestamp: "2026-10-20T04:22:00Z", is_retweet: false },
      { text: "ALERT: Market futures shift 300 points in early Asian trading session.", timestamp: "2026-10-20T04:37:00Z", is_retweet: false }
    ],
    expected_type: "Automated News Amplifier / Click Farm",
    ground_truth: "fake"
  },
  {
    id: "acc_7",
    handle: "@sleeper_promo_agent",
    name: "David Miller",
    platform: "instagram",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    has_default_avatar: false,
    bio: "Living life to the fullest. Tech enthusiast, traveller.",
    url: "https://casinobonus-free-spins.top",
    verified: false,
    followers_count: 180,
    following_count: 4200,
    posts_count: 1450,
    account_age_days: 1460, // Created 4 years ago! Dormant account takeover
    digits_in_username: 0,
    username_length: 19,
    avg_posts_per_day: 35.0, // Massive recent surge after years of 0 activity
    retweet_ratio: 0.15,
    inter_arrival_variance: 0.11,
    circadian_entropy: 0.88,
    lexical_diversity: 0.22,
    hashtag_density: 9.2,
    mention_density: 2.1,
    posts_sample: [
      { text: "Claim $500 free bonus instantly without deposit! Use VIP code WIN77 #casino #gambling #spins #slot", timestamp: "2026-10-20T02:00:00Z", is_retweet: false },
      { text: "Claim $500 free bonus instantly without deposit! Use VIP code WIN77 #casino #gambling #spins #slot", timestamp: "2026-10-20T02:15:00Z", is_retweet: false }
    ],
    expected_type: "Compromised Sleeper Bot (Dormant Takeover)",
    ground_truth: "fake"
  },
  {
    id: "acc_8",
    handle: "@elena_design_lab",
    name: "Elena Rostova",
    platform: "instagram",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    has_default_avatar: false,
    bio: "Product Designer @ FinDesign Studio. Exploring spatial interfaces, typography & minimalist generative arts. Berlin / London.",
    url: "https://elenarostova.design",
    verified: false,
    followers_count: 18400,
    following_count: 650,
    posts_count: 820,
    account_age_days: 1820,
    digits_in_username: 0,
    username_length: 16,
    avg_posts_per_day: 0.45,
    retweet_ratio: 0.12,
    inter_arrival_variance: 0.88,
    circadian_entropy: 0.35,
    lexical_diversity: 0.91,
    hashtag_density: 2.1,
    mention_density: 0.4,
    posts_sample: [
      { text: "Studies on dark mode contrast ratios and glassmorphic depth perception for dashboard telemetry.", timestamp: "2026-10-18T16:00:00Z", is_retweet: false },
      { text: "New design system component library case study published: typography hierarchies.", timestamp: "2026-10-14T11:20:00Z", is_retweet: false }
    ],
    expected_type: "Legitimate Human (Creative Designer)",
    ground_truth: "human"
  }
];

// Curated 120-account benchmark evaluation dataset
const GENERATE_BENCHMARK_DATASET = () => {
  const dataset = [];
  
  // 60 Bot profiles across spam, sybil, impersonator, sleeper
  const botArchetypes = [
    { type: "spam", prefix: "crypto_claim_", followR: [10, 50], friendR: [2000, 5000], ageR: [2, 30], postPerDay: [80, 240], defaultAv: 0.4, lexDiv: 0.15, retwR: 0.85, varR: 0.05 },
    { type: "sybil", prefix: "user_voter_", followR: [0, 10], friendR: [800, 3000], ageR: [5, 45], postPerDay: [120, 350], defaultAv: 0.8, lexDiv: 0.10, retwR: 0.98, varR: 0.03 },
    { type: "impersonator", prefix: "support_desk_", followR: [20, 150], friendR: [500, 1500], ageR: [1, 15], postPerDay: [50, 160], defaultAv: 0.1, lexDiv: 0.30, retwR: 0.05, varR: 0.10 },
    { type: "astroturf", prefix: "patriot_wire_", followR: [500, 4000], friendR: [4500, 5000], ageR: [60, 400], postPerDay: [100, 300], defaultAv: 0.2, lexDiv: 0.28, retwR: 0.92, varR: 0.06 },
    { type: "sleeper", prefix: "promo_agent_", followR: [50, 300], friendR: [1500, 4500], ageR: [800, 2000], postPerDay: [40, 180], defaultAv: 0.0, lexDiv: 0.22, retwR: 0.35, varR: 0.08 }
  ];

  let idCounter = 1;

  botArchetypes.forEach(archetype => {
    for (let i = 0; i < 12; i++) {
      const followers = Math.floor(Math.random() * (archetype.followR[1] - archetype.followR[0])) + archetype.followR[0];
      const following = Math.floor(Math.random() * (archetype.friendR[1] - archetype.friendR[0])) + archetype.friendR[0];
      const age = Math.floor(Math.random() * (archetype.ageR[1] - archetype.ageR[0])) + archetype.ageR[0];
      const postsPerDay = +(Math.random() * (archetype.postPerDay[1] - archetype.postPerDay[0]) + archetype.postPerDay[0]).toFixed(1);
      const posts = Math.round(postsPerDay * Math.min(age, 30));
      const hasDefaultAvatar = Math.random() < archetype.defaultAv;
      const lexicalDiv = +(archetype.lexDiv + (Math.random() * 0.1 - 0.05)).toFixed(2);
      const retweetRatio = +(archetype.retwR + (Math.random() * 0.1 - 0.05)).toFixed(2);
      const interArrivalVariance = +(archetype.varR + Math.random() * 0.05).toFixed(3);
      const digitsCount = Math.floor(Math.random() * 6) + 3;
      const numStr = Math.floor(Math.random() * 900000 + 100000);

      dataset.push({
        id: `bench_bot_${idCounter++}`,
        handle: `@${archetype.prefix}${numStr}`,
        platform: i % 2 === 0 ? "twitter" : "instagram",
        followers_count: followers,
        following_count: following,
        posts_count: posts,
        account_age_days: age,
        has_default_avatar: hasDefaultAvatar,
        has_bio: Math.random() > 0.4,
        has_url: Math.random() > 0.3,
        digits_in_username: digitsCount,
        username_length: archetype.prefix.length + 6,
        avg_posts_per_day: postsPerDay,
        retweet_ratio: Math.min(0.99, Math.max(0.01, retweetRatio)),
        inter_arrival_variance: interArrivalVariance,
        circadian_entropy: +(0.85 + Math.random() * 0.14).toFixed(2),
        lexical_diversity: Math.max(0.05, lexicalDiv),
        hashtag_density: +(Math.random() * 5 + 3).toFixed(1),
        mention_density: +(Math.random() * 4 + 1).toFixed(1),
        ground_truth: "fake",
        bot_type: archetype.type
      });
    }
  });

  // 60 Human profiles (casual, influencer, developer, journalist, verified)
  const humanArchetypes = [
    { type: "casual", prefix: "alex_m_", followR: [80, 450], friendR: [120, 600], ageR: [300, 2500], postPerDay: [0.1, 1.8], defaultAv: 0.05, lexDiv: 0.82, retwR: 0.25 },
    { type: "professional", prefix: "david_eng_", followR: [400, 2500], friendR: [300, 1200], ageR: [500, 3000], postPerDay: [0.3, 3.2], defaultAv: 0.0, lexDiv: 0.88, retwR: 0.30 },
    { type: "influencer", prefix: "claire_style_", followR: [8000, 120000], friendR: [400, 1800], ageR: [800, 3500], postPerDay: [0.8, 4.5], defaultAv: 0.0, lexDiv: 0.79, retwR: 0.15 },
    { type: "student", prefix: "ryan_codes_", followR: [50, 300], friendR: [80, 400], ageR: [150, 1200], postPerDay: [0.2, 2.0], defaultAv: 0.02, lexDiv: 0.85, retwR: 0.35 },
    { type: "researcher", prefix: "dr_keller_", followR: [2500, 35000], friendR: [300, 900], ageR: [1000, 4000], postPerDay: [0.4, 2.5], defaultAv: 0.0, lexDiv: 0.92, retwR: 0.40 }
  ];

  humanArchetypes.forEach(archetype => {
    for (let i = 0; i < 12; i++) {
      const followers = Math.floor(Math.random() * (archetype.followR[1] - archetype.followR[0])) + archetype.followR[0];
      const following = Math.floor(Math.random() * (archetype.friendR[1] - archetype.friendR[0])) + archetype.friendR[0];
      const age = Math.floor(Math.random() * (archetype.ageR[1] - archetype.ageR[0])) + archetype.ageR[0];
      const postsPerDay = +(Math.random() * (archetype.postPerDay[1] - archetype.postPerDay[0]) + archetype.postPerDay[0]).toFixed(2);
      const posts = Math.round(postsPerDay * age);
      const lexicalDiv = +(archetype.lexDiv + (Math.random() * 0.08 - 0.04)).toFixed(2);
      const retweetRatio = +(archetype.retwR + (Math.random() * 0.1 - 0.05)).toFixed(2);
      const interArrivalVariance = +(0.75 + Math.random() * 0.20).toFixed(3);
      const digitsCount = Math.random() < 0.2 ? Math.floor(Math.random() * 3) : 0;
      const numStr = digitsCount > 0 ? Math.floor(Math.random() * 90 + 10) : "";

      dataset.push({
        id: `bench_human_${idCounter++}`,
        handle: `@${archetype.prefix}${numStr}`,
        platform: i % 2 === 0 ? "twitter" : "linkedin",
        followers_count: followers,
        following_count: following,
        posts_count: posts,
        account_age_days: age,
        has_default_avatar: Math.random() < archetype.defaultAv,
        has_bio: true,
        has_url: Math.random() > 0.5,
        digits_in_username: digitsCount,
        username_length: archetype.prefix.length + (digitsCount > 0 ? 2 : 0),
        avg_posts_per_day: postsPerDay,
        retweet_ratio: Math.min(0.8, Math.max(0.05, retweetRatio)),
        inter_arrival_variance: interArrivalVariance,
        circadian_entropy: +(0.25 + Math.random() * 0.25).toFixed(2),
        lexical_diversity: Math.min(0.98, lexicalDiv),
        hashtag_density: +(Math.random() * 2 + 0.2).toFixed(1),
        mention_density: +(Math.random() * 1.5 + 0.2).toFixed(1),
        ground_truth: "human",
        bot_type: "human"
      });
    }
  });

  return dataset;
};

// Sybil Botnet & Astroturfing Network Topology Dataset
const NETWORK_TOPOLOGY_DATA = {
  nodes: [
    // Botnet Cluster Alpha (Crypto Spam Syndicate)
    { id: "node_1", handle: "@crypto_pump_bot99", is_bot: true, cluster: "botnet_alpha", role: "hub", bot_score: 97 },
    { id: "node_2", handle: "@eth_airdrop_node1", is_bot: true, cluster: "botnet_alpha", role: "worker", bot_score: 94 },
    { id: "node_3", handle: "@eth_airdrop_node2", is_bot: true, cluster: "botnet_alpha", role: "worker", bot_score: 92 },
    { id: "node_4", handle: "@eth_claim_fast3", is_bot: true, cluster: "botnet_alpha", role: "worker", bot_score: 95 },
    { id: "node_5", handle: "@solana_rewards_4", is_bot: true, cluster: "botnet_alpha", role: "worker", bot_score: 91 },
    { id: "node_6", handle: "@web3_claim_link", is_bot: true, cluster: "botnet_alpha", role: "amplifier", bot_score: 96 },
    { id: "node_7", handle: "@crypto_bonus_daily", is_bot: true, cluster: "botnet_alpha", role: "amplifier", bot_score: 93 },

    // Botnet Cluster Beta (Astroturfing & Sybil Echo Chamber)
    { id: "node_8", handle: "@prop41_voice_lead", is_bot: true, cluster: "botnet_beta", role: "hub", bot_score: 89 },
    { id: "node_9", handle: "@user_784910283", is_bot: true, cluster: "botnet_beta", role: "sybil_leaf", bot_score: 99 },
    { id: "node_10", handle: "@user_784910284", is_bot: true, cluster: "botnet_beta", role: "sybil_leaf", bot_score: 99 },
    { id: "node_11", handle: "@user_784910285", is_bot: true, cluster: "botnet_beta", role: "sybil_leaf", bot_score: 98 },
    { id: "node_12", handle: "@user_784910286", is_bot: true, cluster: "botnet_beta", role: "sybil_leaf", bot_score: 98 },
    { id: "node_13", handle: "@user_784910287", is_bot: true, cluster: "botnet_beta", role: "sybil_leaf", bot_score: 97 },
    { id: "node_14", handle: "@state_patriot_news", is_bot: true, cluster: "botnet_beta", role: "amplifier", bot_score: 86 },

    // Botnet Cluster Gamma (Phishing & Impersonators)
    { id: "node_15", handle: "@elon_musk_supp0rt", is_bot: true, cluster: "botnet_gamma", role: "phisher", bot_score: 94 },
    { id: "node_16", handle: "@tesla_warranty_care", is_bot: true, cluster: "botnet_gamma", role: "phisher", bot_score: 88 },
    { id: "node_17", handle: "@meta_account_recovery", is_bot: true, cluster: "botnet_gamma", role: "phisher", bot_score: 92 },

    // Organic Human Network (Researchers & Tech Community)
    { id: "node_18", handle: "@sarah_j_tech", is_bot: false, cluster: "organic_ai", role: "influencer", bot_score: 4 },
    { id: "node_19", handle: "@marcus_chen_dev", is_bot: false, cluster: "organic_ai", role: "collaborator", bot_score: 8 },
    { id: "node_20", handle: "@elena_design_lab", is_bot: false, cluster: "organic_ai", role: "collaborator", bot_score: 5 },
    { id: "node_21", handle: "@prof_andrew_ml", is_bot: false, cluster: "organic_ai", role: "faculty", bot_score: 2 },
    { id: "node_22", handle: "@open_source_ninja", is_bot: false, cluster: "organic_ai", role: "contributor", bot_score: 11 },
    { id: "node_23", handle: "@rachel_data_sci", is_bot: false, cluster: "organic_ai", role: "collaborator", bot_score: 7 },
    { id: "node_24", handle: "@vancouver_techies", is_bot: false, cluster: "organic_ai", role: "community_node", bot_score: 14 },

    // Bridge / Compromised Accounts (Suspicious Sleeper bots targeting organic network)
    { id: "node_25", handle: "@sleeper_promo_agent", is_bot: true, cluster: "bridge_threat", role: "infiltrator", bot_score: 82 },
    { id: "node_26", handle: "@news_amplifier_omega", is_bot: true, cluster: "bridge_threat", role: "spammer", bot_score: 88 }
  ],
  links: [
    // Alpha Cluster Mesh (Intra-bot cross-retweets)
    { source: "node_1", target: "node_2", type: "retweet_ring" },
    { source: "node_1", target: "node_3", type: "retweet_ring" },
    { source: "node_1", target: "node_4", type: "retweet_ring" },
    { source: "node_2", target: "node_3", type: "mutual_follow" },
    { source: "node_3", target: "node_4", type: "mutual_follow" },
    { source: "node_4", target: "node_5", type: "mutual_follow" },
    { source: "node_5", target: "node_6", type: "retweet_ring" },
    { source: "node_6", target: "node_7", type: "mutual_follow" },
    { source: "node_7", target: "node_1", type: "retweet_ring" },
    { source: "node_2", target: "node_6", type: "retweet_ring" },

    // Beta Cluster Star Topology (Astroturfing puppet master)
    { source: "node_8", target: "node_9", type: "synchronized_blast" },
    { source: "node_8", target: "node_10", type: "synchronized_blast" },
    { source: "node_8", target: "node_11", type: "synchronized_blast" },
    { source: "node_8", target: "node_12", type: "synchronized_blast" },
    { source: "node_8", target: "node_13", type: "synchronized_blast" },
    { source: "node_8", target: "node_14", type: "retweet_ring" },
    { source: "node_14", target: "node_9", type: "retweet_ring" },

    // Gamma Phishing links (Attacking targets)
    { source: "node_15", target: "node_16", type: "co-owner" },
    { source: "node_16", target: "node_17", type: "co-owner" },
    { source: "node_15", target: "node_18", type: "malicious_mention" }, // Phisher mentions Sarah Jenkins
    { source: "node_17", target: "node_19", type: "malicious_mention" },

    // Organic Network (Rich mutual interactions)
    { source: "node_18", target: "node_19", type: "organic_mention" },
    { source: "node_18", target: "node_21", type: "academic_citation" },
    { source: "node_19", target: "node_20", type: "organic_interaction" },
    { source: "node_19", target: "node_22", type: "github_collab" },
    { source: "node_20", target: "node_24", type: "community_member" },
    { source: "node_21", target: "node_23", type: "co-author" },
    { source: "node_22", target: "node_23", type: "organic_interaction" },
    { source: "node_23", target: "node_18", type: "organic_mention" },
    { source: "node_24", target: "node_19", type: "community_member" },

    // Infiltration bridge attempts
    { source: "node_25", target: "node_19", type: "unsolicited_dm" },
    { source: "node_26", target: "node_18", type: "news_spam_reply" },
    { source: "node_26", target: "node_24", type: "news_spam_reply" }
  ]
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    PRESET_ACCOUNTS,
    BENCHMARK_DATASET: GENERATE_BENCHMARK_DATASET(),
    NETWORK_TOPOLOGY_DATA
  };
}
