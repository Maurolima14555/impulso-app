import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Activity, SessionFeeling } from '../types';
import { colors, typography, spacing, radius, getCategoryColor } from '../theme';

export default function SessionReflectionScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const activity: Activity = route.params.activity;
  const duration: number = route.params.duration;
  const cat = getCategoryColor(activity.category);
  const [feeling, setFeeling] = useState<SessionFeeling | null>(null);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Celebration animation on mount
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleFinish = () => {
    // Go back to home (pop back to root)
    navigation.popToTop();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg.base} />
      <LinearGradient
        colors={[cat.glow, colors.bg.base]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.5 }}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Celebration */}
          <Animated.View
            style={[
              styles.celebration,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View
              style={[
                styles.checkBubble,
                { backgroundColor: cat.primary + '30', borderColor: cat.primary },
              ]}
            >
              <Text style={styles.checkIcon}>✓</Text>
            </View>
            <Text style={styles.eyebrow}>SESSAO COMPLETA</Text>
            <Text style={styles.title}>{activity.title}</Text>
            <Text style={styles.duration}>
              {duration} {duration === 1 ? 'minuto' : 'minutos'} de crescimento
            </Text>
          </Animated.View>

          {/* Feeling selector */}
          <View style={styles.feelingSection}>
            <Text style={styles.feelingPrompt}>Como correu?</Text>
            <View style={styles.feelingRow}>
              <FeelingButton
                emoji="😊"
                label="Bem"
                isSelected={feeling === 'great'}
                onPress={() => setFeeling('great')}
                color="#22c55e"
              />
              <FeelingButton
                emoji="😐"
                label="Assim-assim"
                isSelected={feeling === 'ok'}
                onPress={() => setFeeling('ok')}
                color="#f59e0b"
              />
              <FeelingButton
                emoji="😤"
                label="Dificil"
                isSelected={feeling === 'hard'}
                onPress={() => setFeeling('hard')}
                color="#ef4444"
              />
            </View>
          </View>

          {/* Encouraging message based on feeling */}
          {feeling && (
            <View style={styles.messageCard}>
              <Text style={styles.messageText}>
                {getMessageForFeeling(feeling)}
              </Text>
            </View>
          )}
        </View>

        {/* Finish button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.finishButton,
              { backgroundColor: feeling ? cat.primary : colors.bg.elevated },
            ]}
            onPress={handleFinish}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.finishButtonText,
                { color: feeling ? '#ffffff' : colors.text.tertiary },
              ]}
            >
              {feeling ? 'Continuar ✨' : 'Saltar'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

function FeelingButton({
  emoji,
  label,
  isSelected,
  onPress,
  color,
}: {
  emoji: string;
  label: string;
  isSelected: boolean;
  onPress: () => void;
  color: string;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.feelingButton,
        isSelected && { borderColor: color, backgroundColor: color + '15' },
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={styles.feelingEmoji}>{emoji}</Text>
      <Text
        style={[
          styles.feelingLabel,
          isSelected && { color: color, fontWeight: typography.weight.bold },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function getMessageForFeeling(feeling: SessionFeeling): string {
  switch (feeling) {
    case 'great':
      return 'Boa! Estes momentos vao-se acumulando. Cada um e um passo.';
    case 'ok':
      return 'Ja fizeste. Contado. Nem todos os dias sao espetaculares, e esta bem.';
    case 'hard':
      return 'Mesmo dificil, escolheste estar aqui. Isso ja e vitoria. Descansa.';
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.base },
  safeArea: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    justifyContent: 'center',
  },

  // Celebration
  celebration: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  checkBubble: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    marginBottom: spacing.lg,
  },
  checkIcon: {
    fontSize: 64,
    color: '#ffffff',
    fontWeight: '900',
  },
  eyebrow: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.brand.primary,
    letterSpacing: typography.letterSpacing.wider,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.heavy,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  duration: {
    fontSize: typography.size.base,
    color: colors.text.tertiary,
  },

  // Feeling
  feelingSection: {
    marginBottom: spacing.lg,
  },
  feelingPrompt: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  feelingRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  feelingButton: {
    flex: 1,
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border.subtle,
  },
  feelingEmoji: {
    fontSize: 36,
    marginBottom: spacing.xs,
  },
  feelingLabel: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    fontWeight: typography.weight.semibold,
  },

  // Message
  messageCard: {
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  messageText: {
    fontSize: typography.size.base,
    color: colors.text.primary,
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic',
  },

  // Footer
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.base,
  },
  finishButton: {
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  finishButtonText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    letterSpacing: 0.3,
  },
});
