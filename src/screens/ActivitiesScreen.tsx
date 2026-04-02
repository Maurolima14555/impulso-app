import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ACTIVITIES = [
  { id: '1', title: 'Leitura', duration: '10 min', icon: '📖' },
  { id: '2', title: 'Meditação', duration: '5 min', icon: '🧘' },
  { id: '3', title: 'Exercício', duration: '15 min', icon: '💪' },
  { id: '4', title: 'Journaling', duration: '10 min', icon: '✍️' },
  { id: '5', title: 'Aprender algo novo', duration: '20 min', icon: '🧠' },
];

export default function ActivitiesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />
      <View style={styles.header}>
        <Text style={styles.title}>Actividades</Text>
        <Text style={styles.subtitle}>Escolhe o teu próximo passo</Text>
      </View>
      <FlatList
        data={ACTIVITIES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.8}>
            <Text style={styles.icon}>{item.icon}</Text>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDuration}>{item.duration}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  header: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 16 },
  title: { fontSize: 32, fontWeight: '800', color: '#ffffff', marginBottom: 4 },
  subtitle: { fontSize: 15, color: '#6b7280' },
  list: { paddingHorizontal: 24, paddingBottom: 32 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
  },
  icon: { fontSize: 28, marginRight: 16 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: '600', color: '#ffffff', marginBottom: 2 },
  cardDuration: { fontSize: 13, color: '#22c55e' },
  arrow: { fontSize: 24, color: '#4b5563' },
});
