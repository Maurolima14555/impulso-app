import { TextStyle } from 'react-native';
import { Colors } from './colors';

export const Typography = {
  // App identity
  appTitle: {
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 4,
    color: Colors.textHighlight,
  } as TextStyle,

  appTitleSmall: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 5,
    color: Colors.textHighlight,
  } as TextStyle,

  // Headings
  h1: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 40,
    color: Colors.textPrimary,
  } as TextStyle,

  h2: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.3,
    lineHeight: 32,
    color: Colors.textPrimary,
  } as TextStyle,

  h3: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
    color: Colors.textPrimary,
  } as TextStyle,

  // Tagline — light elegant
  tagline: {
    fontSize: 28,
    fontWeight: '300',
    letterSpacing: 0.5,
    lineHeight: 40,
    color: Colors.textPrimary,
  } as TextStyle,

  // Body
  body: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 24,
    color: Colors.textBody,
  } as TextStyle,

  bodySmall: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 20,
    color: Colors.textSecondary,
  } as TextStyle,

  // Labels
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    color: Colors.textMuted,
  } as TextStyle,

  // UI elements
  button: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  } as TextStyle,

  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    color: Colors.textSecondary,
  } as TextStyle,
} as const;
