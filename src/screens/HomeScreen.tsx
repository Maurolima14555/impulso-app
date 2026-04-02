import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>IMPULSO</Text>
          <View style={styles.accent} />
        </View>

        <View style={styles.body}>
          <Text style={styles.motivational}>
            Hoje ainda tens tempo para crescer 🌱
          </Text>
          <Text style={styles.subtitle}>
            Cada minuto que escolhes bem é um passo em frente.
          </Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.button} activeOpacity={0.85}>
            <Text style={styles.buttonText}>Adicionar actividade</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 32,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 6,
  },
  accent: {
    marginTop: 8,
    width: 48,
    height: 4,
    backgroundColor: '#22c55e',
    borderRadius: 2,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  motivational: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: 38,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  footer: {
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#22c55e',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#0f0f0f',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
