import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';

const DAYS_OF_WEEK = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];

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
  const { streak, todayMinutes, todayCount, completedActivities, getWeekStats } = useApp();
  const week = getWeekStats();
  const weekDays = getWeekDayActivity(completedActivities);
  const categories = getCategoryBreakdown(completedActivities);
  const totalMinutes = completedActivities.reduce((sum, a) => sum + a.duration, 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Progresso</Text>
        <Text style={styles.subtitle}>O teu crescimento, em numeros</Text>

        {/* Big streak */}
        <View style={styles.streakCard}>
          <Text style={styles.streakValue}>{streak}</Text>
          <Text style={styles.streakLabel}>dias de streak 🔥</Text>
        </View>

        {/* Week view */}
        <View style={styles.weekCard}>
          <Text style={styles.cardTitle}>Esta semana</Text>
          <View style={styles.weekRow}>
            {DAYS_OF_WEEK.map((day, i) => (
              <View key={day} style={styles.weekDay}>
                <View style={[styles.weekDot, weekDays[i] && styles.weekDotActive]} />
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

        {/* All time */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total acumulado</Text>
          <View style={styles.totalRow}>
            <View style={styles.totalItem}>
              <Text style={styles.totalValue}>{totalMinutes}</Text>
              <Text style={styles.totalLabel}>minutos investidos</Text>
            </View>
            <View style={styles.totalItem}>
              <Text style={styles.totalValue}>{completedActivities.length}</Text>
              <Text style={styles.totalLabel}>atividades feitas</Text>
            </View>
          </View>
        </View>

        {/* Category breakdown */}
        {categories.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Por categoria</Text>
            {categories.map((cat) => (
              <View key={cat.category} style={styles.catRow}>
                <Text style={styles.catIcon}>{cat.icon}</Text>
                <View style={styles.catInfo}>
                  <Text style={styles.catName}>{cat.category}</Text>
                  <Text style={styles.catDetail}>
                    {cat.count}x - {cat.minutes} min
                  </Text>
                </View>
                <View style={styles.catBar}>
                  <View
                    style={[
                      styles.catBarFill,
                      {
                        width: `${Math.min(100, (cat.minutes / Math.max(totalMinutes, 1)) * 100)}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        {completedActivities.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🌱</Text>
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
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  scroll: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 32 },
  title: { fontSize: 32, fontWeight: '800', color: '#ffffff', marginBottom: 4 },
  subtitle: { fontSize: 15, color: '#6b7280', marginBottom: 24 },
  streakCard: {
    backgroundColor: '#052e16',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  streakValue: { fontSize: 64, fontWeight: '900', color: '#22c55e' },
  streakLabel: { fontSize: 16, color: '#4ade80', marginTop: 4 },
  weekCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  weekDay: { alignItems: 'center', gap: 6 },
  weekDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2a2a2a',
  },
  weekDotActive: { backgroundColor: '#22c55e' },
  weekDayLabel: { fontSize: 11, color: '#6b7280' },
  weekStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  weekStat: { alignItems: 'center' },
  weekStatValue: { fontSize: 22, fontWeight: '800', color: '#ffffff' },
  weekStatLabel: { fontSize: 11, color: '#6b7280', marginTop: 2 },
  weekStatDivider: { width: 1, backgroundColor: '#2a2a2a' },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  totalRow: {
    flexDirection: 'row',
    gap: 16,
  },
  totalItem: { flex: 1, alignItems: 'center' },
  totalValue: { fontSize: 28, fontWeight: '800', color: '#22c55e', marginBottom: 4 },
  totalLabel: { fontSize: 12, color: '#6b7280', textAlign: 'center' },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  catIcon: { fontSize: 24, marginRight: 12 },
  catInfo: { flex: 1 },
  catName: { fontSize: 14, fontWeight: '600', color: '#ffffff', textTransform: 'capitalize' },
  catDetail: { fontSize: 12, color: '#6b7280' },
  catBar: {
    width: 60,
    height: 6,
    backgroundColor: '#2a2a2a',
    borderRadius: 3,
    marginLeft: 12,
  },
  catBarFill: {
    height: 6,
    backgroundColor: '#22c55e',
    borderRadius: 3,
  },
  emptyCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    marginTop: 16,
  },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyText: { fontSize: 15, color: '#6b7280', textAlign: 'center', lineHeight: 22 },
});
