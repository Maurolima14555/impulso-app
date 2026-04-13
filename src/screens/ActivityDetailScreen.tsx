import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Activity } from '../types';
import { colors, typography, spacing, radius, getCategoryColor } from '../theme';

export default function ActivityDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const activity: Activity = route.params.activity;
  const cat = getCategoryColor(activity.category);

  const handleStart = () => {
    navigation.replace('ActivitySession', { activity });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg.base} />
      {/* Hero gradient */}
      <LinearGradient
        colors={[cat.glow, colors.bg.base, colors.bg.base]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.5 }}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <Text style={[styles.categoryLabel, { color: cat.primary }]}>
            {activity.category.toUpperCase()}
          </Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <View style={styles.hero}>
            <View
              style={[
                styles.iconBubble,
                { backgroundColor: cat.glow, borderColor: cat.primary + '60' },
              ]}
            >
              <Text style={styles.icon}>{activity.icon}</Text>
            </View>
            <Text style={styles.title}>{activity.title}</Text>
            <View style={styles.durationChip}>
              <View style={[styles.durationDot, { backgroundColor: cat.primary }]} />
              <Text style={[styles.durationText, { color: cat.primary }]}>
                {activity.duration} minutos
              </Text>
            </View>
          </View>

          {/* Long description */}
          {activity.longDescription && (
            <Text style={styles.longDescription}>{activity.longDescription}</Text>
          )}

          {/* Quote (optional) */}
          {activity.quote && (
            <View style={[styles.quoteCard, { borderLeftColor: cat.primary }]}>
              <Text style={styles.quoteText}>"{activity.quote}"</Text>
            </View>
          )}

          {/* Benefit */}
          {activity.benefit && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>PORQUE FAZER ISTO</Text>
              <View style={styles.benefitCard}>
                <Text style={styles.benefitIcon}>💡</Text>
                <Text style={styles.benefitText}>{activity.benefit}</Text>
              </View>
            </View>
          )}

          {/* Steps */}
          {activity.steps && activity.steps.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>PASSO A PASSO</Text>
              <View style={styles.stepsCard}>
                {activity.steps.map((step, i) => (
                  <View key={i} style={styles.stepRow}>
                    <View
                      style={[
                        styles.stepNumber,
                        { backgroundColor: cat.glow, borderColor: cat.primary },
                      ]}
                    >
                      <Text style={[styles.stepNumberText, { color: cat.primary }]}>
                        {i + 1}
                      </Text>
                    </View>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Tip */}
          {activity.tip && (
            <View style={styles.tipCard}>
              <Text style={styles.tipLabel}>🔥 DICA</Text>
              <Text style={styles.tipText}>{activity.tip}</Text>
            </View>
          )}
        </ScrollView>

        {/* Start button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.startButton, { backgroundColor: cat.primary }]}
            onPress={handleStart}
            activeOpacity={0.85}
          >
            <Text style={styles.startButtonText}>▶  Comecar agora</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.base },
  safeArea: { flex: 1 },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bg.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  backText: {
    fontSize: 24,
    color: colors.text.primary,
    marginTop: -2,
  },
  categoryLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    letterSpacing: typography.letterSpacing.wider,
  },
  placeholder: { width: 40, height: 40 },

  // Scroll
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },

  // Hero
  hero: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  iconBubble: {
    width: 104,
    height: 104,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginBottom: spacing.lg,
  },
  icon: { fontSize: 52 },
  title: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.heavy,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  durationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.bg.elevated,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  durationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  durationText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },

  // Long description
  longDescription: {
    fontSize: typography.size.base,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },

  // Quote
  quoteCard: {
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderLeftWidth: 4,
    marginBottom: spacing.xl,
  },
  quoteText: {
    fontSize: typography.size.base,
    color: colors.text.primary,
    fontStyle: 'italic',
    lineHeight: 22,
  },

  // Sections
  section: {
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.text.tertiary,
    letterSpacing: typography.letterSpacing.wider,
    marginBottom: spacing.md,
  },

  // Benefit card
  benefitCard: {
    flexDirection: 'row',
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  benefitIcon: {
    fontSize: 22,
    marginRight: spacing.md,
  },
  benefitText: {
    flex: 1,
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    lineHeight: 21,
  },

  // Steps card
  stepsCard: {
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    gap: spacing.md,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginRight: spacing.md,
    marginTop: 1,
  },
  stepNumberText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
  },
  stepText: {
    flex: 1,
    fontSize: typography.size.sm,
    color: colors.text.primary,
    lineHeight: 21,
  },

  // Tip
  tipCard: {
    backgroundColor: '#1c1917',
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    marginBottom: spacing.lg,
  },
  tipLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.warning,
    letterSpacing: typography.letterSpacing.wider,
    marginBottom: spacing.xs,
  },
  tipText: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    lineHeight: 21,
  },

  // Footer
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.base,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    backgroundColor: colors.bg.base,
  },
  startButton: {
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    letterSpacing: 0.3,
  },
});
