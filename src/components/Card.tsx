import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

type CardVariant = 'default' | 'elevated' | 'accent' | 'flush';

type Props = {
  children: React.ReactNode;
  variant?: CardVariant;
  style?: ViewStyle;
};

export default function Card({ children, variant = 'default', style }: Props) {
  return (
    <View style={[styles.base, styles[variant], style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  default: {
    backgroundColor: Colors.bgCard,
    borderColor: Colors.border,
  },
  elevated: {
    backgroundColor: Colors.bgCardElevated,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  accent: {
    backgroundColor: Colors.accentDark,
    borderColor: Colors.accent,
  },
  flush: {
    backgroundColor: Colors.bgCard,
    borderColor: Colors.border,
    padding: 0,
    overflow: 'hidden',
  },
});
