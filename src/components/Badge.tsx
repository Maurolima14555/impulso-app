import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, radius, spacing } from '../theme';

export type BadgeData = {
  id: string;
  icon: string;
  title: string;
  description: string;
  threshold: number; // streak days needed
  gradient: readonly [string, string];
  unlocked: boolean;
};

export const ALL_BADGES: Omit<BadgeData, 'unlocked'>[] = [
  {
    id: 'first-step',
    icon: '🌱',
    title: 'Primeiro Passo',
    description: 'Completa a tua primeira atividade',
    threshold: 1,
    gradient: ['#065f46', '#10b981'] as const,
  },
  {
    id: 'three-day',
    icon: '✨',
    title: '3 Dias',
    description: '3 dias seguidos de crescimento',
    threshold: 3,
    gradient: ['#1e3a8a', '#3b82f6'] as const,
  },
  {
    id: 'week-streak',
    icon: '🔥',
    title: 'Sequencia',
    description: '7 dias seguidos. Estas no ritmo!',
    threshold: 7,
    gradient: ['#9a3412', '#f97316'] as const,
  },
  {
    id: 'two-weeks',
    icon: '⚡',
    title: 'Imparavel',
    description: '14 dias de pura disciplina',
    threshold: 14,
    gradient: ['#581c87', '#a855f7'] as const,
  },
  {
    id: 'month',
    icon: '⛰️',
    title: 'Disciplina',
    description: '30 dias. Transformacao real.',
    threshold: 30,
    gradient: ['#831843', '#ec4899'] as const,
  },
  {
    id: 'legend',
    icon: '👑',
    title: 'Lenda',
    description: '100 dias. Es uma lenda viva.',
    threshold: 100,
    gradient: ['#713f12', '#facc15'] as const,
  },
];

export function getBadgeStatus(streak: number): BadgeData[] {
  return ALL_BADGES.map((b) => ({ ...b, unlocked: streak >= b.threshold }));
}

type Props = {
  badge: BadgeData;
};

export default function Badge({ badge }: Props) {
  if (badge.unlocked) {
    return (
      <View style={styles.wrapper}>
        <LinearGradient
          colors={badge.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.unlockedCard}
        >
          <Text style={styles.icon}>{badge.icon}</Text>
        </LinearGradient>
        <Text style={styles.title} numberOfLines={1}>{badge.title}</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.lockedCard}>
        <Text style={styles.lockedIcon}>{badge.icon}</Text>
        <Text style={styles.lockBadge}>🔒</Text>
      </View>
      <Text style={styles.lockedTitle} numberOfLines={1}>{badge.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    width: 90,
  },
  unlockedCard: {
    width: 72,
    height: 72,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  lockedCard: {
    width: 72,
    height: 72,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    backgroundColor: colors.bg.elevated,
    borderWidth: 1,
    borderColor: colors.border.default,
    position: 'relative',
  },
  icon: {
    fontSize: 36,
  },
  lockedIcon: {
    fontSize: 32,
    opacity: 0.25,
  },
  lockBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    fontSize: 12,
  },
  title: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    textAlign: 'center',
  },
  lockedTitle: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});
