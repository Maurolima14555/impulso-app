import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    icon: '📱',
    title: 'Chega de scroll\nsem sentido',
    description:
      'O IMPULSO detecta quando passas demasiado tempo nas redes sociais e transforma esses minutos em crescimento real.',
  },
  {
    icon: '🚀',
    title: 'Redireciona\na tua energia',
    description:
      'Em vez de bloquear (e tu desbloquear 5 min depois), sugerimos atividades que realmente te fazem evoluir.',
  },
  {
    icon: '📊',
    title: 'Vê o teu\nprogresso',
    description:
      'Streak diário, minutos investidos em ti, atividades completadas. Dados reais do teu crescimento.',
  },
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const { completeOnboarding } = useApp();
  const slide = SLIDES[step];
  const isLast = step === SLIDES.length - 1;

  const handleNext = async () => {
    if (isLast) {
      await completeOnboarding();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>IMPULSO</Text>
          <View style={styles.accent} />
        </View>

        <View style={styles.body}>
          <Text style={styles.icon}>{slide.icon}</Text>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.description}>{slide.description}</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.dots}>
            {SLIDES.map((_, i) => (
              <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
            ))}
          </View>
          <TouchableOpacity style={styles.button} onPress={handleNext} activeOpacity={0.85}>
            <Text style={styles.buttonText}>{isLast ? 'Comecar agora' : 'Proximo'}</Text>
          </TouchableOpacity>
          {!isLast && (
            <TouchableOpacity onPress={completeOnboarding} style={styles.skipButton}>
              <Text style={styles.skipText}>Pular</Text>
            </TouchableOpacity>
          )}
        </View>
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
  logo: {
    fontSize: 28,
    fontWeight: '900',
    color: '#22c55e',
    letterSpacing: 6,
  },
  accent: {
    marginTop: 6,
    width: 28,
    height: 3,
    backgroundColor: '#22c55e',
    borderRadius: 2,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  icon: {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 44,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#9ca3af',
    lineHeight: 26,
  },
  footer: {
    marginBottom: 16,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#374151',
  },
  dotActive: {
    backgroundColor: '#22c55e',
    width: 24,
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
  skipButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  skipText: {
    color: '#6b7280',
    fontSize: 15,
  },
});
