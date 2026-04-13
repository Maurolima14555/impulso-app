import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getTodayIntention } from '../data/intentions';
import { colors, typography, spacing, radius } from '../theme';

const THEME_GRADIENTS = {
  focus: ['#1e3a8a', '#3b82f6'] as const,
  calm: ['#581c87', '#a855f7'] as const,
  action: ['#9a3412', '#f97316'] as const,
  growth: ['#065f46', '#10b981'] as const,
};

export default function DailyIntentionCard() {
  const intention = getTodayIntention();
  const gradient = THEME_GRADIENTS[intention.theme];

  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <Text style={styles.eyebrow}>INTENCAO DE HOJE</Text>
      <Text style={styles.quote}>"{intention.quote}"</Text>
      {intention.author && <Text style={styles.author}>— {intention.author}</Text>}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  eyebrow: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: '#ffffff',
    opacity: 0.8,
    letterSpacing: typography.letterSpacing.wider,
    marginBottom: spacing.sm,
  },
  quote: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: '#ffffff',
    lineHeight: 28,
    marginBottom: spacing.sm,
  },
  author: {
    fontSize: typography.size.sm,
    color: '#ffffff',
    opacity: 0.85,
    fontStyle: 'italic',
  },
});
