import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { getTodayUsageStats } from '../lib/screentime';
import PaywallScreen from './PaywallScreen';

const QUICK_ACTIVITIES = [
  { id: 'read', icon: '📖', title: 'Ler', minutes: 10 },
  { id: 'meditate', icon: '🧘', title: 'Meditar', minutes: 5 },
  { id: 'exercise', icon: '💪', title: 'Treinar', minutes: 15 },
  { id: 'journal', icon: '✍️', title: 'Escrever', minutes: 10 },
];

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

function getMotivation(streak: number, todayCount: number): string {
  if (todayCount === 0) return 'Hoje ainda tens tempo para crescer 🌱';
  if (todayCount === 1) return 'Primeiro passo dado! Continua 💪';
  if (todayCount >= 3) return 'Dia incrivel! Estas imparavel 🔥';
  return 'Otimo ritmo! Mais uma? 🚀';
}

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { streak, todayMinutes, todayCount, canDoActivity, isPro, refreshProStatus } = useApp();
  const [minutesAway, setMinutesAway] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    loadUsageStats();
  }, []);

  const loadUsageStats = async () => {
    try {
      const stats = await getTodayUsageStats();
      setMinutesAway(stats.minutesAway);
    } catch {
      // Not available
    }
  };

  const handleQuickActivity = (act: typeof QUICK_ACTIVITIES[0]) => {
    if (!canDoActivity()) {
      setShowPaywall(true);
      return;
    }
    navigation.navigate('ActivitySession', {
      activity: {
        id: act.id,
        title: act.title,
        duration: act.minutes,
        icon: act.icon,
        category: act.id === 'read' ? 'reading'
          : act.id === 'meditate' ? 'meditation'
          : act.id === 'exercise' ? 'exercise'
          : 'journaling',
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.title}>IMPULSO</Text>
            </View>
            {isPro && (
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>PRO</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.motivationCard}>
          <Text style={styles.motivationText}>
            {getMotivation(streak, todayCount)}
          </Text>
        </View>

        {/* Screen time awareness */}
        {minutesAway > 15 && (
          <View style={styles.screenTimeCard}>
            <Text style={styles.screenTimeIcon}>📱</Text>
            <View style={styles.screenTimeInfo}>
              <Text style={styles.screenTimeTitle}>
                {minutesAway} min fora do IMPULSO hoje
              </Text>
              <Text style={styles.screenTimeDesc}>
                Que tal transformar esse tempo em crescimento?
              </Text>
            </View>
          </View>
        )}

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>Dias seguidos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{todayMinutes}</Text>
            <Text style={styles.statLabel}>Min hoje</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{todayCount}</Text>
            <Text style={styles.statLabel}>Atividades</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acao rapida</Text>
          <View style={styles.quickGrid}>
            {QUICK_ACTIVITIES.map((act) => (
              <TouchableOpacity
                key={act.id}
                style={styles.quickCard}
                activeOpacity={0.8}
                onPress={() => handleQuickActivity(act)}
              >
                <Text style={styles.quickIcon}>{act.icon}</Text>
                <Text style={styles.quickTitle}>{act.title}</Text>
                <Text style={styles.quickDuration}>{act.minutes} min</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {!isPro && todayCount >= 2 && (
          <TouchableOpacity
            style={styles.proPrompt}
            activeOpacity={0.85}
            onPress={() => setShowPaywall(true)}
          >
            <Text style={styles.proPromptText}>
              Estas a gostar? Desbloqueia atividades ilimitadas com PRO
            </Text>
            <Text style={styles.proPromptArrow}>→</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.allActivitiesButton}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Activities')}
        >
          <Text style={styles.allActivitiesText}>Ver todas as atividades</Text>
          <Text style={styles.allActivitiesArrow}>→</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={showPaywall} animationType="slide">
        <PaywallScreen
          onClose={() => setShowPaywall(false)}
          onPurchased={() => {
            setShowPaywall(false);
            refreshProStatus();
          }}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  scroll: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 },
  header: { marginTop: 16, marginBottom: 24 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting: { fontSize: 16, color: '#6b7280', marginBottom: 4 },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 4,
  },
  proBadge: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
  },
  proBadgeText: { fontSize: 12, fontWeight: '900', color: '#0f0f0f', letterSpacing: 2 },
  motivationCard: {
    backgroundColor: '#052e16',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#22c55e',
  },
  motivationText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4ade80',
    lineHeight: 26,
  },
  screenTimeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1917',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  screenTimeIcon: { fontSize: 28, marginRight: 14 },
  screenTimeInfo: { flex: 1 },
  screenTimeTitle: { fontSize: 15, fontWeight: '700', color: '#fbbf24', marginBottom: 2 },
  screenTimeDesc: { fontSize: 13, color: '#92400e' },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#22c55e',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickCard: {
    width: '47%',
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
  },
  quickIcon: { fontSize: 36, marginBottom: 8 },
  quickTitle: { fontSize: 16, fontWeight: '700', color: '#ffffff', marginBottom: 4 },
  quickDuration: { fontSize: 13, color: '#22c55e' },
  proPrompt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#052e16',
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  proPromptText: { fontSize: 14, color: '#4ade80', fontWeight: '600', flex: 1, marginRight: 8 },
  proPromptArrow: { fontSize: 20, color: '#22c55e' },
  allActivitiesButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    padding: 18,
  },
  allActivitiesText: { fontSize: 16, fontWeight: '600', color: '#ffffff' },
  allActivitiesArrow: { fontSize: 20, color: '#22c55e' },
});
