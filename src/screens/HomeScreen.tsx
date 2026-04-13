import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { getTodayUsageStats } from '../lib/screentime';
import PaywallScreen from './PaywallScreen';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import Button from '../components/Button';

const QUICK_ACTIVITIES = [
  { id: 'read', icon: '📖', title: 'Ler', minutes: 10, category: 'reading' },
  { id: 'meditate', icon: '🧘', title: 'Meditar', minutes: 5, category: 'meditation' },
  { id: 'exercise', icon: '💪', title: 'Treinar', minutes: 15, category: 'exercise' },
  { id: 'journal', icon: '✍️', title: 'Escrever', minutes: 10, category: 'journaling' },
];

const QUOTES = [
  'Não perdeste o dia.\nAinda há tempo para crescer.',
  'Cada minuto investido\nem ti é capital para o futuro.',
  'O scroll passa.\nO que aprendes fica.',
  'Um passo de cada vez.\nMas nunca parar.',
  'A diferença está naquilo\nque fazes quando ninguém vê.',
];

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

function getTimeString(): string {
  return new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
}

function useFadeIn(delay = 0) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 400, delay, useNativeDriver: true }),
    ]).start();
  }, []);
  return { opacity, translateY };
}

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { streak, todayMinutes, todayCount, canDoActivity, isPro, refreshProStatus } = useApp();
  const [minutesAway, setMinutesAway] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [time, setTime] = useState(getTimeString());
  const quote = QUOTES[new Date().getDay() % QUOTES.length];

  const header = useFadeIn(0);
  const quoteAnim = useFadeIn(80);
  const statsAnim = useFadeIn(160);
  const gridAnim = useFadeIn(240);

  useEffect(() => {
    const tick = setInterval(() => setTime(getTimeString()), 30000);
    getTodayUsageStats().then((s) => setMinutesAway(s.minutesAway)).catch(() => {});
    return () => clearInterval(tick);
  }, []);

  const handleQuickActivity = (act: typeof QUICK_ACTIVITIES[0]) => {
    if (!canDoActivity()) { setShowPaywall(true); return; }
    navigation.navigate('ActivitySession', {
      activity: { id: act.id, title: act.title, duration: act.minutes, icon: act.icon, category: act.category },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Animated.View style={[styles.header, { opacity: header.opacity, transform: [{ translateY: header.translateY }] }]}>
          <Text style={styles.logoText}>IMPULSO</Text>
          <View style={styles.timeBox}>
            <Text style={styles.timeText}>{time}</Text>
            <Text style={styles.greetingText}>{getGreeting()}</Text>
          </View>
        </Animated.View>

        {/* Quote card */}
        <Animated.View style={{ opacity: quoteAnim.opacity, transform: [{ translateY: quoteAnim.translateY }] }}>
          <View style={styles.quoteCard}>
            <View style={styles.quoteBorder} />
            <View style={{ flex: 1 }}>
              <Text style={styles.quoteText}>{quote}</Text>
              {minutesAway > 20 && (
                <View style={styles.nudgePill}>
                  <Ionicons name="phone-portrait-outline" size={12} color={Colors.warning} />
                  <Text style={styles.nudgeText}>{minutesAway} min fora do IMPULSO hoje</Text>
                </View>
              )}
            </View>
          </View>
        </Animated.View>

        {/* Stats */}
        <Animated.View style={[styles.statsRow, { opacity: statsAnim.opacity, transform: [{ translateY: statsAnim.translateY }] }]}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>streak 🔥</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{todayMinutes}</Text>
            <Text style={styles.statLabel}>min hoje</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{todayCount}</Text>
            <Text style={styles.statLabel}>actividades</Text>
          </View>
        </Animated.View>

        {/* Quick actions */}
        <Animated.View style={{ opacity: gridAnim.opacity, transform: [{ translateY: gridAnim.translateY }] }}>
          <Text style={styles.sectionLabel}>ACÇÃO RÁPIDA</Text>
          <View style={styles.grid}>
            {QUICK_ACTIVITIES.map((act) => (
              <TouchableOpacity key={act.id} style={styles.gridCard} onPress={() => handleQuickActivity(act)} activeOpacity={0.7}>
                <View style={styles.gridIconBox}>
                  <Text style={styles.gridIcon}>{act.icon}</Text>
                </View>
                <Text style={styles.gridTitle}>{act.title}</Text>
                <Text style={styles.gridDuration}>{act.minutes} min</Text>
              </TouchableOpacity>
            ))}
          </View>

          {!isPro && todayCount >= 2 && (
            <TouchableOpacity style={styles.proNudge} onPress={() => setShowPaywall(true)} activeOpacity={0.8}>
              <Ionicons name="infinite-outline" size={15} color={Colors.accent} />
              <Text style={styles.proNudgeText}>Desbloqueia actividades ilimitadas com PRO</Text>
              <Ionicons name="chevron-forward" size={14} color={Colors.accent} />
            </TouchableOpacity>
          )}

          <Button
            label="Ver todas as actividades"
            variant="primary"
            size="lg"
            style={styles.cta}
            onPress={() => navigation.navigate('Activities')}
          />

          {isPro && (
            <View style={styles.proBadgeRow}>
              <Ionicons name="checkmark-circle" size={13} color={Colors.accent} />
              <Text style={styles.proBadgeText}>IMPULSO PRO activo</Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      <Modal visible={showPaywall} animationType="slide">
        <PaywallScreen
          onClose={() => setShowPaywall(false)}
          onPurchased={() => { setShowPaywall(false); refreshProStatus(); }}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 40 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 16,
    marginBottom: 28,
  },
  logoText: { ...Typography.appTitleSmall },
  timeBox: { alignItems: 'flex-end' },
  timeText: { fontSize: 20, fontWeight: '300', color: Colors.textSecondary, letterSpacing: 1 },
  greetingText: { fontSize: 12, color: Colors.textMuted, marginTop: 2, letterSpacing: 0.5 },

  quoteCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 28,
    marginBottom: 20,
    flexDirection: 'row',
    gap: 20,
  },
  quoteBorder: { width: 3, borderRadius: 2, backgroundColor: Colors.accent },
  quoteText: { fontSize: 20, fontWeight: '300', letterSpacing: 0.3, lineHeight: 30, color: Colors.textPrimary },
  nudgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 16,
    backgroundColor: Colors.warningSubtle,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  nudgeText: { fontSize: 11, color: Colors.warning, fontWeight: '600' },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 20,
    marginBottom: 32,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 26, fontWeight: '800', color: Colors.accent, marginBottom: 4 },
  statLabel: { fontSize: 11, color: Colors.textMuted, letterSpacing: 0.5 },
  statDivider: { width: 1, backgroundColor: Colors.border, marginVertical: 4 },

  sectionLabel: { ...Typography.label, letterSpacing: 2, marginBottom: 16 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  gridCard: {
    width: '47.5%',
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    alignItems: 'flex-start',
  },
  gridIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.accentSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  gridIcon: { fontSize: 24 },
  gridTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  gridDuration: { fontSize: 12, color: Colors.accent, fontWeight: '600' },

  proNudge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.accentSubtle,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.accentMid,
  },
  proNudgeText: { flex: 1, fontSize: 13, color: Colors.accent, fontWeight: '500' },

  cta: { width: '100%', marginTop: 4, marginBottom: 12 },

  proBadgeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 4 },
  proBadgeText: { fontSize: 12, color: Colors.accent, fontWeight: '600', letterSpacing: 0.5 },
});
