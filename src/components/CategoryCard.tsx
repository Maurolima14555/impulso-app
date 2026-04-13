import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, radius, spacing, getCategoryColor } from '../theme';

type Props = {
  icon: string;
  title: string;
  duration: number;
  category: string;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
};

export default function CategoryCard({ icon, title, duration, category, onPress, size = 'md' }: Props) {
  const cat = getCategoryColor(category);

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.wrapper}>
      <LinearGradient
        colors={[cat.glow, colors.bg.elevated]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.card,
          { borderColor: cat.primary + '30' },
        ]}
      >
        <View style={[styles.iconBubble, { backgroundColor: cat.primary + '20' }]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.durationRow}>
          <View style={[styles.dot, { backgroundColor: cat.primary }]} />
          <Text style={[styles.duration, { color: cat.primary }]}>{duration} min</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'flex-start',
    borderWidth: 1,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  iconBubble: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  icon: {
    fontSize: 24,
  },
  title: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  duration: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
});
