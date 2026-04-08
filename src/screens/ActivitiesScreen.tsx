import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import PaywallScreen from './PaywallScreen';
import { Activity } from '../types';

const ACTIVITIES: Activity[] = [
  { id: 'read-10', title: 'Leitura', duration: 10, icon: '📖', category: 'reading', description: 'Ler um capitulo de livro ou artigo' },
  { id: 'read-20', title: 'Leitura profunda', duration: 20, icon: '📚', category: 'reading', description: 'Sessao focada de leitura' },
  { id: 'meditate-5', title: 'Meditacao', duration: 5, icon: '🧘', category: 'meditation', description: '5 minutos de presenca e respiracao' },
  { id: 'meditate-10', title: 'Meditacao guiada', duration: 10, icon: '🧘‍♂️', category: 'meditation', description: 'Sessao mais longa de meditacao' },
  { id: 'exercise-15', title: 'Exercicio', duration: 15, icon: '💪', category: 'exercise', description: 'Treino rapido ou caminhada' },
  { id: 'exercise-30', title: 'Treino completo', duration: 30, icon: '🏋️', category: 'exercise', description: 'Sessao completa de exercicio' },
  { id: 'journal-10', title: 'Journaling', duration: 10, icon: '✍️', category: 'journaling', description: 'Escrever pensamentos e reflexoes' },
  { id: 'journal-gratitude', title: 'Gratidao', duration: 5, icon: '🙏', category: 'journaling', description: '3 coisas pelas quais es grato' },
  { id: 'learn-20', title: 'Aprender', duration: 20, icon: '🧠', category: 'learning', description: 'Estudar algo novo ou praticar uma skill' },
  { id: 'learn-podcast', title: 'Podcast educativo', duration: 15, icon: '🎧', category: 'learning', description: 'Ouvir um episodio de podcast' },
  { id: 'stretch', title: 'Alongamento', duration: 10, icon: '🤸', category: 'exercise', description: 'Alongar o corpo e aliviar tensao' },
  { id: 'breathe', title: 'Respiracao', duration: 3, icon: '🌬️', category: 'meditation', description: '3 minutos de respiracao controlada' },
];

export default function ActivitiesScreen() {
  const navigation = useNavigation<any>();
  const { canDoActivity, isPro, todayCount, refreshProStatus } = useApp();
  const [showPaywall, setShowPaywall] = useState(false);

  const handleActivityPress = (activity: Activity) => {
    if (!canDoActivity()) {
      setShowPaywall(true);
      return;
    }
    navigation.navigate('ActivitySession', { activity });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />
      <View style={styles.header}>
        <Text style={styles.title}>Atividades</Text>
        <Text style={styles.subtitle}>Escolhe o teu proximo passo</Text>
        {!isPro && (
          <View style={styles.limitBadge}>
            <Text style={styles.limitText}>
              {todayCount}/3 gratis hoje{' '}
              <Text style={styles.limitPro} onPress={() => setShowPaywall(true)}>
                Desbloquear PRO
              </Text>
            </Text>
          </View>
        )}
      </View>
      <FlatList
        data={ACTIVITIES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => handleActivityPress(item)}
          >
            <Text style={styles.icon}>{item.icon}</Text>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
              <Text style={styles.cardDuration}>{item.duration} min</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        )}
      />

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
  header: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 16 },
  title: { fontSize: 32, fontWeight: '800', color: '#ffffff', marginBottom: 4 },
  subtitle: { fontSize: 15, color: '#6b7280' },
  limitBadge: {
    marginTop: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  limitText: { fontSize: 13, color: '#6b7280' },
  limitPro: { color: '#22c55e', fontWeight: '700' },
  list: { paddingHorizontal: 24, paddingBottom: 32 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
  },
  icon: { fontSize: 32, marginRight: 16 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: '600', color: '#ffffff', marginBottom: 2 },
  cardDesc: { fontSize: 13, color: '#6b7280', marginBottom: 4 },
  cardDuration: { fontSize: 13, fontWeight: '600', color: '#22c55e' },
  arrow: { fontSize: 24, color: '#4b5563' },
});
