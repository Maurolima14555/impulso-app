import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import Badge, { getBadgeStatus } from '../components/Badge';
import { MOODS } from '../types';
import { colors, typography, spacing, radius, getCategoryColor } from '../theme';

const DAYS_OF_WEEK = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

function getWeekDayActivity(completedActivities: any[]): boolean[] {
  const today = new Date();
  const result: boolean[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    result.push(completedActivities.some((a) => a.completedAt.startsWith(dateStr)));
  }
  return result;
}

function getCategoryBreakdown(completedActivities: any[]) {
  const cats: Record<string, { count: number; minutes: number; icon: string }> = {};
  const icons: Record<string, string> = {
    reading: '📖',
    meditation: '🧘',
    exercise: '💪',
    journaling: '✍️',
    learning: '🧠',
    other: '🎯',
  };
  for (const a of completedActivities) {
    if (!cats[a.category]) {
      cats[a.category] = { count: 0, minutes: 0, icon: icons[a.category] || '🎯' };
    }
    cats[a.category].count++;
    cats[a.category].minutes += a.duration;
  }
  return Object.entries(cats)
    .map(([key, val]) => ({ category: key, ...val }))
    .sort((a, b) => b.minutes - a.minutes);
}

export default function StatsScreen() {
  const { streak, completedActivities, getWeekStats, getFocusScore, getWeekMoods } = useApp();
  const week = getWeekStats();
  const weekDays = getWeekDayActivity(completedActivities);
  const weekMoods = getWeekMoods();
  const categories = getCategoryBreakdown(completedActivities);
  const totalMinutes = completedActivities.reduce((sum, a) => sum + a.duration, 0);
  const score = getFocusScore();
  const badges = getBadgeStatus(streak);
  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const hasAnyMood = weekMoods.some((m) => m !== null);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg.base} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Progresso</Text>
          <Text style={styles.subtitle}>O teu crescimento, em numeros</Text>
        </View>

        {/* Hero: Streak with gradient background */}
        <LinearGradient
          colors={['#9a3412', '#f97316']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.streakHero}
        >
          <View style={styles.streakHeroContent}>
            <Text style={styles.streakIcon}>🔥</Text>
            <Text style={styles.streakValue}>{streak}</Text>
            <Text style={styles.streakLabel}>{streak === 1 ? 'dia de streak' : 'dias de streak'}</Text>
          </View>
          <View style={styles.streakHeroFooter}>
            <Text style={styles.streakHeroFooterText}>
              Score atual: <Text style={styles.streakHeroFooterBold}>{score}/100</Text>
            </Text>
          </View>
        </LinearGradient>

        {/* Mood tracker - only show if user has logged at least one mood */}
        {hasAnyMood && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>O TEU MOOD ESTA SEMANA</Text>
            <View style={styles.moodCard}>
              <View style={styles.moodRow}>
                {weekMoods.map((entry, i) => {
                  const mood = entry ? MOODS.find((m) => m.id === entry.mood) : null;
                  const dayLabel = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'][i];
                  return (
                    <View key={i} style={styles.moodDay}>
                      {mood ? (
                        <View
                          style={[
                            styles.moodEmojiBubble,
                            { backgroundColor: mood.color + '20', borderColor: mood.color + '60' },
                          ]}
                        >
                          <Text style={styles.moodDayEmoji}>{mood.emoji}</Text>
                        </View>
                      ) : (
                        <View style={styles.moodEmojiEmpty}>
                          <Text style={styles.moodDayDash}>—</Text>
                        </View>
                      )}
                      <Text style={styles.moodDayLabel}>{dayLabel}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {/* Badges */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>CONQUISTAS</Text>
            <Text style={styles.sectionCount}>{unlockedCount}/{badges.length}</Text>
          </View>
          <View style={styles.badgesGrid}>
            {badges.map((badge) => (
              <Badge key={badge.id} badge={badge} />
            ))}
          </View>
        </View>

        {/* Week view */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ESTA SEMANA</Text>
          <View style={styles.weekCard}>
            <View style={styles.weekRow}>
              {DAYS_OF_WEEK.map((day, i) => (
                <View key={i} style={styles.weekDay}>
                  <View style={[styles.weekDot, weekDays[i] && styles.weekDotActive]}>
                    {weekDays[i] && <Text style={styles.weekDotCheck}>✓</Text>}
                  </View>
                  <Text style={styles.weekDayLabel}>{day}</Text>
                </View>
              ))}
            </View>
            <View style={styles.weekStats}>
              <View style={styles.weekStat}>
                <Text style={styles.weekStatValue}>{week.minutes}</Text>
                <Text style={styles.weekStatLabel}>min</Text>
              </View>
              <View style={styles.weekStatDivider} />
              <View style={styles.weekStat}>
                <Text style={styles.weekStatValue}>{week.count}</Text>
                <Text style={styles.weekStatLabel}>atividades</Text>
              </View>
              <View style={styles.weekStatDivider} />
              <View style={styles.weekStat}>
                <Text style={styles.weekStatValue}>{week.days}/7</Text>
                <Text style={styles.weekStatLabel}>dias ativos</Text>
              </View>
            </View>
          </View>
        </View>

        {/* All time totals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TOTAL ACUMULADO</Text>
          <View style={styles.totalCard}>
            <View style={styles.totalItem}>
              <Text style={styles.totalValue}>{totalMinutes}</Text>
              <Text style={styles.totalLabel}>minutos investidos</Text>
            </View>
            <View style={styles.totalDivider} />
            <View style={styles.totalItem}>
              <Text style={styles.totalValue}>{completedActivities.length}</Text>
              <Text style={styles.totalLabel}>atividades feitas</Text>
            </View>
          </View>
        </View>

        {/* Category breakdown */}
        {categories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>POR CATEGORIA</Text>
            <View style={styles.categoryCard}>
              {categories.map((cat) => {
                const catColor = getCategoryColor(cat.category);
                const percentage = Math.min(100, (cat.minutes / Math.max(totalMinutes, 1)) * 100);
                return (
                  <View key={cat.category} style={styles.catRow}>
                    <View style={[styles.catIconBubble, { backgroundColor: catColor.glow }]}>
                      <Text style={styles.catIcon}>{cat.icon}</Text>
                    </View>
                    <View style={styles.catInfo}>
                      <Text style={styles.catName}>{cat.category}</Text>
                      <Text style={styles.catDetail}>
                        {cat.count}x · {cat.minutes} min
                      </Text>
                    </View>
                    <View style={styles.catBarContainer}>
                      <View style={styles.catBar}>
                        <View
                          style={[
                            styles.catBarFill,
                            {
                              width: `${percentage}%`,
                              backgroundColor: catColor.primary,
                            },
                          ]}
                        />
                      </View>
                      <Text style={[styles.catPercent, { color: catColor.primary }]}>
                        {Math.round(percentage)}%
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {completedActivities.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🌱</Text>
            <Text style={styles.emptyTitle}>Comeca a tua jornada</Text>
            <Text style={styles.emptyText}>
              Completa a tua primeira atividade para ver as estatisticas aqui
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.base },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxxl,
  },

  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.heavy,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.size.base,
    color: colors.text.tertiary,
  },

  // Streak hero
  streakHero: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    overflow: 'hidden',
  },
  streakHeroContent: {
    alignItems: 'center',
  },
  streakIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  streakValue: {
    fontSize: 80,
    fontWeight: typography.weight.black,
    color: '#ffffff',
    fontVariant: ['tabular-nums'],
    lineHeight: 88,
  },
  streakLabel: {
    fontSize: typography.size.md,
    color: '#ffffff',
    opacity: 0.9,
    fontWeight: typography.weight.semibold,
    marginTop: spacing.xs,
  },
  streakHeroFooter: {
    marginTop: spacing.lg,
    paddingTop: spacing.base,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  streakHeroFooterText: {
    fontSize: typography.size.sm,
    color: '#ffffff',
    opacity: 0.9,
  },
  streakHeroFooterBold: {
    fontWeight: typography.weight.bold,
  },

  // Section
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  sectionTitle: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.text.tertiary,
    letterSpacing: typography.letterSpacing.wider,
    marginBottom: spacing.base,
  },
  sectionCount: {
    fontSize: typography.size.sm,
    color: colors.brand.primary,
    fontWeight: typography.weight.semibold,
  },

  // Mood tracker
  moodCard: {
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodDay: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  moodEmojiBubble: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  moodEmojiEmpty: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg.overlay,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  moodDayEmoji: {
    fontSize: 22,
  },
  moodDayDash: {
    fontSize: 14,
    color: colors.text.disabled,
  },
  moodDayLabel: {
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
    fontWeight: typography.weight.medium,
  },

  // Badges
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.lg,
  },

  // Week
  weekCard: {
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  weekDay: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  weekDot: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colors.bg.overlay,
    borderWidth: 1,
    borderColor: colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekDotActive: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  weekDotCheck: {
    fontSize: 14,
    color: colors.text.inverse,
    fontWeight: typography.weight.bold,
  },
  weekDayLabel: {
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
    fontWeight: typography.weight.medium,
  },
  weekStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.base,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
  },
  weekStat: {
    alignItems: 'center',
  },
  weekStatValue: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.heavy,
    color: colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  weekStatLabel: {
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  weekStatDivider: {
    width: 1,
    backgroundColor: colors.border.subtle,
  },

  // Total
  totalCard: {
    flexDirection: 'row',
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  totalItem: {
    flex: 1,
    alignItems: 'center',
  },
  totalValue: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.heavy,
    color: colors.brand.primary,
    fontVariant: ['tabular-nums'],
    marginBottom: spacing.xs,
  },
  totalLabel: {
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  totalDivider: {
    width: 1,
    backgroundColor: colors.border.subtle,
  },

  // Category
  categoryCard: {
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    gap: spacing.base,
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  catIconBubble: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  catIcon: {
    fontSize: 22,
  },
  catInfo: {
    flex: 1,
  },
  catName: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    textTransform: 'capitalize',
  },
  catDetail: {
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  catBarContainer: {
    width: 80,
    alignItems: 'flex-end',
  },
  catBar: {
    width: 70,
    height: 6,
    backgroundColor: colors.bg.overlay,
    borderRadius: 3,
    marginBottom: 4,
  },
  catBarFill: {
    height: 6,
    borderRadius: 3,
  },
  catPercent: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
  },

  // Empty
  emptyCard: {
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.lg,
    padding: spacing.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: spacing.base,
  },
  emptyTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
