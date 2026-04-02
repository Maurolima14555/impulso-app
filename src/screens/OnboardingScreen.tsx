import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  onComplete: () => void;
};

export default function OnboardingScreen({ onComplete }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>IMPULSO</Text>
          <View style={styles.accent} />
        </View>

        <View style={styles.body}>
          <Text style={styles.headline}>
            Não perdeste o dia.{'\n'}Ainda há tempo{'\n'}para crescer.
          </Text>
          <Text style={styles.description}>
            O IMPULSO transforma os minutos que passas nas redes sociais em
            oportunidades de crescimento real. Leitura, exercício, meditação —
            tu escolhes.
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={onComplete} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Começar agora</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  header: { marginTop: 32 },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#22c55e',
    letterSpacing: 6,
  },
  accent: {
    marginTop: 8,
    width: 32,
    height: 3,
    backgroundColor: '#22c55e',
    borderRadius: 2,
  },
  body: { flex: 1, justifyContent: 'center' },
  headline: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 46,
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#9ca3af',
    lineHeight: 26,
  },
  button: {
    backgroundColor: '#22c55e',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#0f0f0f',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
