#!/usr/bin/env python3
"""
Fake Social Media Account Detection - Analytical & Machine Learning Pipeline
Analyzes user behavioral vectors, profile metadata, and circadian temporal patterns
to classify accounts as authentic humans or automated bots.
"""

import sys
import os
import math
import json
import csv
from collections import Counter

def calculate_shannon_entropy(text):
    """Calculates Shannon entropy of character distribution in text/username."""
    if not text:
        return 0.0
    counter = Counter(text)
    length = len(text)
    return -sum((count / length) * math.log2(count / length) for count in counter.values())

def extract_features(profile):
    """
    Extracts normalized analytical features from an account profile dictionary.
    Features:
      1. reputation_score: followers / (followers + following)
      2. posts_velocity: avg posts per day (normalized)
      3. username_entropy: Shannon entropy of handle characters
      4. digit_ratio: proportion of digits in handle
      5. default_avatar_penalty: 1 if default avatar, else 0
      6. temporal_variance: inter-arrival posting variance (low = automated cron)
      7. circadian_entropy: continuous 24/7 posting without circadian rest
      8. lexical_diversity: type-token ratio of post text
      9. retweet_ratio: proportion of retweets vs original posts
    """
    followers = float(profile.get('followers_count', 0))
    following = float(profile.get('following_count', 0))
    posts = float(profile.get('posts_count', 0))
    age_days = max(1.0, float(profile.get('account_age_days', 1)))
    
    # 1. Reputation score (0 = bot with 0 followers, 0.5 = balanced, 1.0 = celebrity)
    reputation = followers / (followers + following + 1e-5)
    
    # 2. Velocity
    posts_per_day = float(profile.get('avg_posts_per_day', posts / age_days))
    norm_velocity = min(1.0, posts_per_day / 150.0)
    
    # 3. Handle analysis
    handle = profile.get('handle', '').lstrip('@')
    entropy = calculate_shannon_entropy(handle) / 4.5 # Normalized by max expected entropy
    digits = sum(c.isdigit() for c in handle)
    digit_ratio = digits / max(1, len(handle))
    
    # 4. Avatar & Bio
    default_avatar = 1.0 if profile.get('has_default_avatar', False) in (True, '1', 1) else 0.0
    has_bio = 1.0 if profile.get('has_bio', True) in (True, '1', 1) else 0.0
    
    # 5. Behavioral vectors
    temporal_variance = float(profile.get('inter_arrival_variance', 0.5))
    circadian_entropy = float(profile.get('circadian_entropy', 0.5))
    lexical_diversity = float(profile.get('lexical_diversity', 0.7))
    retweet_ratio = float(profile.get('retweet_ratio', 0.3))
    
    return {
        'reputation': reputation,
        'norm_velocity': norm_velocity,
        'username_entropy': entropy,
        'digit_ratio': digit_ratio,
        'default_avatar': default_avatar,
        'has_bio': has_bio,
        'temporal_variance': temporal_variance, # Low is bot-like
        'circadian_entropy': circadian_entropy, # High is bot-like (posts 24/7)
        'lexical_diversity': lexical_diversity, # Low is bot-like
        'retweet_ratio': retweet_ratio         # High is amplifier-like
    }

def score_account(profile, custom_weights=None):
    """
    Computes calibrated Bot Risk Score (0 - 100%) and Explainability Attribution.
    Uses multi-criteria analytical decision model with calibrated logistic sigmoid mapping.
    """
    feats = extract_features(profile)
    
    # Calibrated Feature Risk Weights
    # Positive weights increase Bot Probability; Negative weights decrease it.
    weights = {
        'low_reputation': 18.0,      # Following thousands, followed by few
        'high_velocity': 22.0,       # Spamming hundreds of posts/day
        'clockwork_timing': 24.0,    # Low temporal variance (cron schedule)
        'circadian_anomaly': 16.0,   # Never sleeps (flat 24/7 activity)
        'repetitive_lexicon': 15.0,  # Same repeated promotional phrase
        'high_retweet': 14.0,        # Astroturfing echo chamber
        'digit_handle': 12.0,        # user_984712984 pattern
        'default_avatar': 10.0,      # No profile photo
        'has_rich_bio': -12.0,       # Quality bio reduces risk
        'natural_burstiness': -20.0  # High human burstiness variance reduces risk
    }
    
    if custom_weights:
        weights.update(custom_weights)
        
    explanations = []
    total_risk_score = 0.0
    
    # Evaluate Reputation Signal
    if feats['reputation'] < 0.05:
        contrib = weights['low_reputation']
        total_risk_score += contrib
        explanations.append({'signal': 'Asymmetric Reputation', 'delta': contrib, 'type': 'danger', 'detail': f"Extreme follower/following asymmetry (Reputation Index: {feats['reputation']:.2f})"})
    elif feats['reputation'] > 0.40:
        contrib = -10.0
        total_risk_score += contrib
        explanations.append({'signal': 'Healthy Reputation Ratio', 'delta': contrib, 'type': 'safe', 'detail': f"Balanced community engagement ratio ({feats['reputation']:.2f})"})
        
    # Evaluate Posting Velocity
    if feats['norm_velocity'] > 0.4:
        contrib = weights['high_velocity'] * feats['norm_velocity']
        total_risk_score += contrib
        explanations.append({'signal': 'Abnormal Post Velocity', 'delta': contrib, 'type': 'danger', 'detail': f"Posting volume exceeds human baseline ({profile.get('avg_posts_per_day', 0)} posts/day)"})
        
    # Evaluate Temporal Uniformity (Cron-like behavior)
    if feats['temporal_variance'] < 0.20:
        contrib = weights['clockwork_timing'] * (1.0 - feats['temporal_variance'])
        total_risk_score += contrib
        explanations.append({'signal': 'Clockwork Inter-Arrival Timing', 'delta': contrib, 'type': 'danger', 'detail': f"Inter-arrival variance {feats['temporal_variance']:.3f} indicates automated API scheduling"})
    elif feats['temporal_variance'] > 0.65:
        contrib = weights['natural_burstiness']
        total_risk_score += contrib
        explanations.append({'signal': 'Natural Human Burstiness', 'delta': contrib, 'type': 'safe', 'detail': f"Irregular posting intervals characteristic of organic human behavior ({feats['temporal_variance']:.2f})"})

    # Evaluate Circadian 24/7 Entropy
    if feats['circadian_entropy'] > 0.75:
        contrib = weights['circadian_anomaly'] * feats['circadian_entropy']
        total_risk_score += contrib
        explanations.append({'signal': 'Circadian Rhythm Absence', 'delta': contrib, 'type': 'danger', 'detail': f"Active 24/7 across normal human sleep windows (Entropy: {feats['circadian_entropy']:.2f})"})
        
    # Evaluate Lexical Repetition
    if feats['lexical_diversity'] < 0.35:
        contrib = weights['repetitive_lexicon'] * (1.0 - feats['lexical_diversity'])
        total_risk_score += contrib
        explanations.append({'signal': 'Lexical Homogeneity / Repetition', 'delta': contrib, 'type': 'warning', 'detail': f"Vocabulary Type-Token Ratio {feats['lexical_diversity']:.2f} shows templated promotional text"})
        
    # Evaluate Retweet / Amplification Ratio
    if feats['retweet_ratio'] > 0.80:
        contrib = weights['high_retweet'] * feats['retweet_ratio']
        total_risk_score += contrib
        explanations.append({'signal': 'Astroturfing Amplification', 'delta': contrib, 'type': 'warning', 'detail': f"{feats['retweet_ratio']*100:.0f}% of feed consists of retweets/echo-chamber reposts"})
        
    # Evaluate Handle Randomness
    if feats['digit_ratio'] > 0.30:
        contrib = weights['digit_handle'] * feats['digit_ratio']
        total_risk_score += contrib
        explanations.append({'signal': 'Algorithmic Handle Synthesis', 'delta': contrib, 'type': 'warning', 'detail': f"{feats['digit_ratio']*100:.0f}% digits in username indicating batch bot generation"})

    if feats['default_avatar'] > 0.5:
        contrib = weights['default_avatar']
        total_risk_score += contrib
        explanations.append({'signal': 'Default System Avatar', 'delta': contrib, 'type': 'warning', 'detail': 'Missing personalized profile picture'})

    if feats['has_bio'] > 0.5:
        contrib = weights['has_rich_bio']
        total_risk_score += contrib

    # Apply logistic scaling into calibrated probability [0, 100]
    # Center risk score around baseline 15
    calibrated_prob = 1.0 / (1.0 + math.exp(-0.065 * (total_risk_score - 15.0)))
    risk_percentage = round(calibrated_prob * 100, 1)

    if risk_percentage >= 75.0:
        verdict = "High Risk (Automated Bot / Sybil)"
        badge = "danger"
    elif risk_percentage >= 45.0:
        verdict = "Suspicious (Needs Review)"
        badge = "warning"
    else:
        verdict = "Authentic (Likely Human)"
        badge = "safe"

    return {
        'risk_score': risk_percentage,
        'verdict': verdict,
        'badge': badge,
        'features': feats,
        'explanations': explanations
    }

def run_benchmark_evaluation(csv_path):
    """Evaluates detection model across the full CSV benchmark dataset."""
    if not os.path.exists(csv_path):
        print(f"Error: Dataset not found at {csv_path}")
        return

    print("=" * 68)
    print(" 🛡️  Fake Social Media Account Detection - Benchmark Evaluation")
    print("=" * 68)
    print(f"Reading dataset: {csv_path}")

    records = []
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            records.append(row)

    print(f"Loaded {len(records)} benchmark account records.\n")

    tp = fp = tn = fn = 0
    predictions = []

    for r in records:
        scored = score_account(r)
        is_pred_fake = scored['risk_score'] >= 50.0
        is_true_fake = r['ground_truth'].lower() == 'fake'

        if is_pred_fake and is_true_fake:
            tp += 1
        elif is_pred_fake and not is_true_fake:
            fp += 1
        elif not is_pred_fake and not is_true_fake:
            tn += 1
        else:
            fn += 1

        predictions.append({
            'handle': r['handle'],
            'ground_truth': r['ground_truth'],
            'predicted_score': scored['risk_score'],
            'predicted_verdict': scored['verdict']
        })

    total = len(records)
    accuracy = (tp + tn) / total
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0
    f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0

    print("📊 CLASSIFICATION PERFORMANCE METRICS:")
    print("-" * 45)
    print(f" Total Evaluated Accounts : {total}")
    print(f" True Positives (Bots)    : {tp}")
    print(f" False Positives (Humans) : {fp}")
    print(f" True Negatives (Humans)  : {tn}")
    print(f" False Negatives (Bots)   : {fn}")
    print("-" * 45)
    print(f" Accuracy                 : {accuracy * 100:.2f}%")
    print(f" Precision                : {precision * 100:.2f}%")
    print(f" Recall (Detection Rate)  : {recall * 100:.2f}%")
    print(f" F1-Score                 : {f1 * 100:.2f}%")
    print("=" * 68)
    print("✅ Benchmark evaluation completed successfully.\n")

if __name__ == '__main__':
    default_csv = os.path.join(os.path.dirname(__file__), '..', 'data', 'social_accounts_dataset.csv')
    if len(sys.argv) > 1 and sys.argv[1] == '--eval':
        path = sys.argv[2] if len(sys.argv) > 2 else default_csv
        run_benchmark_evaluation(path)
    elif len(sys.argv) > 1 and sys.argv[1] == '--sample':
        sample_bot = {
            'handle': '@airdrop_eth_bot7',
            'followers_count': 12,
            'following_count': 4200,
            'posts_count': 9400,
            'account_age_days': 14,
            'has_default_avatar': False,
            'has_bio': True,
            'avg_posts_per_day': 160.0,
            'inter_arrival_variance': 0.04,
            'circadian_entropy': 0.95,
            'lexical_diversity': 0.15,
            'retweet_ratio': 0.88
        }
        res = score_account(sample_bot)
        print(json.dumps(res, indent=2))
    else:
        run_benchmark_evaluation(default_csv)
