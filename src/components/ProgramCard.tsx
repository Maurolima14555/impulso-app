import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Program } from '../types';
import { colors, typography, spacing, radius } from '../theme';

type Props = {
  program: Program;
  onPress: () => void;
  progress?: number; // current day (1-based)
};

export default function ProgramCard({ program, onPress, progress }: Props) {
  const percentage = progress ? Math.min(100, ((progress - 1) / program.totalDays) * 100) : 0;

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.wrapper}>
      <LinearGradient
        colors={program.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.header}>
          <Text style={styles.icon}>{program.icon}</Text>
          {program.isPro && (
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeText}>PRO</Text>
            </View>
          )}
        </View>

        <Text style={styles.title}>{program.title}</Text>
        <Text style={styles.subtitle}>{program.subtitle}</Text>

        <View style={styles.footer}>
          {progress ? (
            <>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${percentage}%` }]} />
              </View>
              <Text style={styles.progressText}>
                Dia {progress} de {program.totalDays}
              </Text>
            </>
          ) : (
            <View style={styles.ctaRow}>
              <Text style={styles.ctaText}>{program.totalDays} dias</Text>
              <Text style={styles.ctaArrow}>→</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 260,
  },
  card: {
    borderRadius: radius.xl,
    padding: spacing.lg,
    minHeight: 180,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    fontSize: 44,
  },
  proBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  proBadgeText: {
    fontSize: 10,
    fontWeight: typography.weight.black,
    color: '#ffffff',
    letterSpacing: 1.5,
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.heavy,
    color: '#ffffff',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.size.sm,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: spacing.md,
  },
  footer: {
    marginTop: spacing.sm,
  },
  progressBar: {
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2.5,
    marginBottom: spacing.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: 5,
    backgroundColor: '#ffffff',
    borderRadius: 2.5,
  },
  progressText: {
    fontSize: typography.size.xs,
    color: '#ffffff',
    opacity: 0.9,
    fontWeight: typography.weight.semibold,
  },
  ctaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ctaText: {
    fontSize: typography.size.sm,
    color: '#ffffff',
    fontWeight: typography.weight.bold,
  },
  ctaArrow: {
    fontSize: 22,
    color: '#ffffff',
  },
});
