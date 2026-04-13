import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Modal,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import PaywallScreen from './PaywallScreen';
import { Activity, ActivityCategory } from '../types';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

const CATEGORY_LABELS: Record<ActivityCategory, string> = {
  reading: 'LEITURA',
  exercise: 'MOVIMENTO',
  meditation: 'SERENIDADE',
  journaling: 'CRIAÇÃO',
  learning: 'CONHECIMENTO',
  other: 'OUTRO',
};

const ACTIVITIES: Activity[] = [
  { id: 'read-10', title: 'Leitura', duration: 10, icon: '📖', category: 'reading', description: 'Ler um capítulo ou artigo de valor' },
  { id: 'read-20', title: 'Leitura profunda', duration: 20, icon: '📚', category: 'reading', description: 'Sessão focada sem interrupções' },
  { id: 'meditate-5', title: 'Meditação', duration: 5, icon: '🧘', category: 'meditation', description: '5 minutos de presença e respiração' },
  { id: 'meditate-10', title: 'Meditação guiada', duration: 10, icon: '🧘‍♂️', category: 'meditation', description: 'Sessão mais longa com intenção' },
  { id: 'exercise-15', title: 'Exercício', duration: 15, icon: '💪', category: 'exercise', description: 'Treino rápido ou caminhada' },
  { id: 'exercise-30', title: 'Treino completo', duration: 30, icon: '🏋️', category: 'exercise', description: 'Sessão completa de movimento' },
  { id: 'journal-10', title: 'Journaling', duration: 10, icon: '✍️', category: 'journaling', description: 'Escrever pensamentos e reflexões' },
  { id: 'journal-gratitude', title: 'Gratidão', duration: 5, icon: '🙏', category: 'journaling', description: '3 coisas pelas quais és grato' },
  { id: 'learn-20', title: 'Aprender', duration: 20, icon: '🧠', category: 'learning', description: 'Estudar algo novo ou praticar' },
  { id: 'learn-podcast', title: 'Podcast educativo', duration: 15, icon: '🎧', category: 'learning', description: 'Ouvir um episódio de podcast' },
  { id: 'stretch', title: 'Alongamento', duration: 10, icon: '🤸', category: 'exercise', description: 'Aliviar tensão e cuidar do corpo' },
  { id: 'breathe', title: 'Respiração', duration: 3, icon: '🌬️', category: 'meditation', description: '3 minutos de respiração controlada' },
];

const ALL_FILTER = 'all';
type Filter = ActivityCategory | typeof ALL_FILTER;

const FILTERS: { id: Filter; label: string }[] = [
  { id: ALL_FILTER, label: 'Todas' },
  { id: 'reading', label: 'Leitura' },
  { id: 'meditation', label: 'Serenidade' },
  { id: 'exercise', label: 'Movimento' },
  { id: 'journaling', label: 'Criação' },
  { id: 'learning', label: 'Conhecimento' },
];

function ActivityCard({ item, onPress }: { item: Activity; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 4 }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={styles.cardIconBox}>
          <Text style={styles.cardIcon}>{item.icon}</Text>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardCategory}>{CATEGORY_LABELS[item.category]}</Text>
          <Text style={styles.cardTitle}>{item.title}</Text>
          {item.description && <Text style={styles.cardDesc}>{item.description}</Text>}
        </View>
        <View style={styles.cardRight}>
          <Text style={styles.cardDuration}>{item.duration}</Text>
          <Text style={styles.cardDurationLabel}>min</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function ActivitiesScreen() {
  const navigation = useNavigation<any>();
  const { canDoActivity, isPro, todayCount, refreshProStatus } = useApp();
  const [showPaywall, setShowPaywall] = useState(false);
  const [activeFilter, setActiveFilter] = useState<Filter>(ALL_FILTER);

  const filtered = activeFilter === ALL_FILTER
    ? ACTIVITIES
    : ACTIVITIES.filter((a) => a.category === activeFilter);

  const handleActivityPress = (activity: Activity) => {
    if (!canDoActivity()) { setShowPaywall(true); return; }
    navigation.navigate('ActivitySession', { activity });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Actividades</Text>
          <Text style={styles.subtitle}>Escolhe o teu próximo passo</Text>
        </View>
        {!isPro && (
          <TouchableOpacity style={styles.limitBadge} onPress={() => setShowPaywall(true)} activeOpacity={0.8}>
            <Text style={styles.limitText}>{todayCount}/3</Text>
            <Ionicons name="infinite-outline" size={14} color={Colors.accent} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <FlatList
        data={FILTERS}
        keyExtractor={(f) => f.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
        renderItem={({ item: f }) => (
          <TouchableOpacity
            style={[styles.filterChip, activeFilter === f.id && styles.filterChipActive]}
            onPress={() => setActiveFilter(f.id)}
            activeOpacity={0.75}
          >
            <Text style={[styles.filterLabel, activeFilter === f.id && styles.filterLabelActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Activity list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ActivityCard item={item} onPress={() => handleActivityPress(item)} />
        )}
      />

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

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 4,
  },
  title: { ...Typography.h1 },
  subtitle: { ...Typography.bodySmall, marginTop: 4 },

  limitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.accentSubtle,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: Colors.accentMid,
    marginTop: 6,
  },
  limitText: { fontSize: 13, fontWeight: '700', color: Colors.accent },

  // Filters
  filters: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.bgCard,
  },
  filterChipActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accentSubtle,
  },
  filterLabel: { fontSize: 13, fontWeight: '500', color: Colors.textSecondary },
  filterLabelActive: { color: Colors.accent, fontWeight: '700' },

  // List
  list: { paddingHorizontal: 24, paddingBottom: 32 },

  // Card
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 10,
    gap: 16,
  },
  cardIconBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: Colors.accentSubtle,
    borderWidth: 1,
    borderColor: Colors.accentMid,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIcon: { fontSize: 28 },
  cardBody: { flex: 1 },
  cardCategory: {
    ...Typography.label,
    fontSize: 10,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 3 },
  cardDesc: { fontSize: 12, color: Colors.textSecondary, lineHeight: 18 },
  cardRight: { alignItems: 'center', minWidth: 36 },
  cardDuration: { fontSize: 20, fontWeight: '800', color: Colors.accent },
  cardDurationLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '600', letterSpacing: 0.5 },
});
