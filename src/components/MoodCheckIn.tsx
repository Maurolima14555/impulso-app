import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MOODS, Mood } from '../types';
import { colors, typography, spacing, radius } from '../theme';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (mood: Mood) => void;
  userName?: string;
};

export default function MoodCheckIn({ visible, onClose, onSelect, userName }: Props) {
  const [selected, setSelected] = useState<Mood | null>(null);

  const handleConfirm = () => {
    if (selected) {
      onSelect(selected);
      setSelected(null);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg.base} />
        <View style={styles.content}>
          {/* Close */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Title */}
          <View style={styles.header}>
            <Text style={styles.eyebrow}>CHECK-IN DIARIO</Text>
            <Text style={styles.title}>
              {userName ? `Como te sentes,\n${userName}?` : 'Como te\nsentes hoje?'}
            </Text>
            <Text style={styles.subtitle}>
              Vamos sugerir-te a atividade certa para o teu mood
            </Text>
          </View>

          {/* Mood grid */}
          <View style={styles.grid}>
            {MOODS.map((mood) => {
              const isSelected = selected === mood.id;
              return (
                <TouchableOpacity
                  key={mood.id}
                  onPress={() => setSelected(mood.id)}
                  activeOpacity={0.85}
                  style={styles.moodCardWrapper}
                >
                  {isSelected ? (
                    <LinearGradient
                      colors={[mood.color + '40', mood.color + '15']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={[
                        styles.moodCard,
                        { borderColor: mood.color, borderWidth: 2 },
                      ]}
                    >
                      <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                      <Text style={[styles.moodLabel, { color: mood.color }]}>
                        {mood.label}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.moodCard}>
                      <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                      <Text style={styles.moodLabel}>{mood.label}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Confirm button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, !selected && styles.buttonDisabled]}
              onPress={handleConfirm}
              disabled={!selected}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.skipButton}>
              <Text style={styles.skipText}>Agora nao</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.base },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bg.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  closeText: {
    fontSize: 18,
    color: colors.text.secondary,
  },
  header: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
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
    lineHeight: 38,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.size.base,
    color: colors.text.tertiary,
    lineHeight: 22,
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  moodCardWrapper: {
    width: '47%',
  },
  moodCard: {
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  moodEmoji: {
    fontSize: 44,
    marginBottom: spacing.sm,
  },
  moodLabel: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  footer: {
    paddingTop: spacing.lg,
  },
  button: {
    backgroundColor: colors.brand.primary,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.bg.overlay,
  },
  buttonText: {
    color: colors.text.inverse,
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: spacing.base,
  },
  skipText: {
    color: colors.text.tertiary,
    fontSize: typography.size.base,
  },
});
