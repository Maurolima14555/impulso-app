import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Vibration } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { Activity } from '../types';
import { colors, typography, spacing, radius, getCategoryColor } from '../theme';

type Phase = 'ready' | 'running' | 'done';

const RING_SIZE = 260;
const RING_STROKE = 16;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export default function ActivitySessionScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const activity: Activity = route.params.activity;
  const { logActivity } = useApp();
  const cat = getCategoryColor(activity.category);

  const [phase, setPhase] = useState<Phase>('ready');
  const [secondsLeft, setSecondsLeft] = useState(activity.duration * 60);
  const [totalSeconds] = useState(activity.duration * 60);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startTimer = () => {
    setPhase('running');
    Vibration.vibrate(50);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setPhase('done');
          Vibration.vibrate([0, 200, 100, 200]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleComplete = async () => {
    const minutesSpent = Math.ceil((totalSeconds - secondsLeft) / 60) || activity.duration;
    await logActivity(activity, minutesSpent);
    (navigation as any).replace('SessionReflection', {
      activity,
      duration: minutesSpent,
    });
  };

  const handleSkipTimer = async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    await logActivity(activity, activity.duration);
    (navigation as any).replace('SessionReflection', {
      activity,
      duration: activity.duration,
    });
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = 1 - secondsLeft / totalSeconds;
  const progressDash = progress * CIRCUMFERENCE;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg.base} />
      {/* Background gradient based on category */}
      <LinearGradient
        colors={[cat.glow, colors.bg.base, colors.bg.base]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.6 }}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Close button */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Activity icon bubble */}
          <View style={[styles.iconBubble, { backgroundColor: cat.glow, borderColor: cat.primary + '50' }]}>
            <Text style={styles.icon}>{activity.icon}</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{activity.title}</Text>
          <View style={styles.durationChip}>
            <View style={[styles.durationDot, { backgroundColor: cat.primary }]} />
            <Text style={[styles.durationText, { color: cat.primary }]}>{activity.duration} minutos</Text>
          </View>

          {/* Timer ring */}
          <View style={styles.timerWrapper}>
            <Svg width={RING_SIZE} height={RING_SIZE}>
              <Defs>
                <SvgGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor={cat.primary} stopOpacity="1" />
                  <Stop offset="100%" stopColor={cat.primary} stopOpacity="0.4" />
                </SvgGradient>
              </Defs>
              <Circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RING_RADIUS}
                stroke={colors.border.subtle}
                strokeWidth={RING_STROKE}
                fill="none"
              />
              <Circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RING_RADIUS}
                stroke="url(#ringGradient)"
                strokeWidth={RING_STROKE}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${progressDash} ${CIRCUMFERENCE}`}
                transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
              />
            </Svg>
            <View style={[styles.timerCenter, { width: RING_SIZE, height: RING_SIZE }]}>
              <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
              {phase === 'ready' && <Text style={styles.timerLabel}>pronto</Text>}
              {phase === 'running' && <Text style={[styles.timerLabel, { color: cat.primary }]}>em foco</Text>}
              {phase === 'done' && <Text style={styles.timerLabelDone}>completo!</Text>}
            </View>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.footer}>
          {phase === 'ready' && (
            <>
              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: cat.primary }]}
                onPress={startTimer}
                activeOpacity={0.85}
              >
                <Text style={[styles.primaryButtonText, { color: '#ffffff' }]}>▶  Iniciar foco</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={handleSkipTimer}>
                <Text style={styles.secondaryButtonText}>Ja fiz - registar</Text>
              </TouchableOpacity>
            </>
          )}
          {phase === 'running' && (
            <TouchableOpacity style={styles.secondaryButton} onPress={handleSkipTimer}>
              <Text style={styles.secondaryButtonText}>Terminar e registar</Text>
            </TouchableOpacity>
          )}
          {phase === 'done' && (
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: cat.primary }]}
              onPress={handleComplete}
              activeOpacity={0.85}
            >
              <Text style={[styles.primaryButtonText, { color: '#ffffff' }]}>✓  Conquistado!</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.base,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: spacing.sm,
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

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconBubble: {
    width: 88,
    height: 88,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginBottom: spacing.lg,
  },
  icon: {
    fontSize: 44,
  },

  title: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.heavy,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  durationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.bg.elevated,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border.default,
    marginBottom: spacing.xxl,
  },
  durationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  durationText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },

  timerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 56,
    fontWeight: typography.weight.black,
    color: colors.text.primary,
    fontVariant: ['tabular-nums'],
    letterSpacing: -1,
  },
  timerLabel: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
    fontWeight: typography.weight.bold,
    letterSpacing: typography.letterSpacing.wider,
    textTransform: 'uppercase',
    marginTop: spacing.xs,
  },
  timerLabelDone: {
    fontSize: typography.size.sm,
    color: colors.brand.primary,
    fontWeight: typography.weight.bold,
    letterSpacing: typography.letterSpacing.wider,
    textTransform: 'uppercase',
    marginTop: spacing.xs,
  },

  footer: {
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  primaryButton: {
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    letterSpacing: 0.3,
  },
  secondaryButton: {
    backgroundColor: colors.bg.elevated,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  secondaryButtonText: {
    color: colors.text.primary,
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
  },
});
