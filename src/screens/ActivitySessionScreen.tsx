import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Vibration } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { Activity } from '../types';

type Phase = 'ready' | 'running' | 'done';

export default function ActivitySessionScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const activity: Activity = route.params.activity;
  const { logActivity } = useApp();

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
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setPhase('done');
          Vibration.vibrate(500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleComplete = async () => {
    const minutesSpent = Math.ceil((totalSeconds - secondsLeft) / 60) || activity.duration;
    await logActivity(activity, minutesSpent);
    navigation.goBack();
  };

  const handleSkipTimer = async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    await logActivity(activity, activity.duration);
    navigation.goBack();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = 1 - secondsLeft / totalSeconds;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />
      <View style={styles.content}>
        {/* Close button */}
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.center}>
          <Text style={styles.icon}>{activity.icon}</Text>
          <Text style={styles.title}>{activity.title}</Text>
          <Text style={styles.duration}>{activity.duration} minutos</Text>

          {/* Timer circle */}
          <View style={styles.timerContainer}>
            <View style={styles.timerCircle}>
              <View
                style={[
                  styles.timerProgress,
                  {
                    transform: [{ rotate: `${progress * 360}deg` }],
                  },
                ]}
              />
              <View style={styles.timerInner}>
                <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
                {phase === 'running' && (
                  <Text style={styles.timerLabel}>em foco</Text>
                )}
                {phase === 'done' && (
                  <Text style={styles.timerLabelDone}>completo!</Text>
                )}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          {phase === 'ready' && (
            <>
              <TouchableOpacity style={styles.primaryButton} onPress={startTimer} activeOpacity={0.85}>
                <Text style={styles.primaryButtonText}>Iniciar temporizador</Text>
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
            <TouchableOpacity style={styles.primaryButton} onPress={handleComplete} activeOpacity={0.85}>
              <Text style={styles.primaryButtonText}>Feito! 🎉</Text>
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
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  closeText: {
    fontSize: 24,
    color: '#6b7280',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '800', color: '#ffffff', marginBottom: 8 },
  duration: { fontSize: 16, color: '#6b7280', marginBottom: 40 },
  timerContainer: {
    alignItems: 'center',
  },
  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#1a1a1a',
    borderWidth: 4,
    borderColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerProgress: {
    position: 'absolute',
    width: 200,
    height: 200,
  },
  timerInner: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 42,
    fontWeight: '900',
    color: '#ffffff',
    fontVariant: ['tabular-nums'],
  },
  timerLabel: {
    fontSize: 14,
    color: '#22c55e',
    marginTop: 4,
  },
  timerLabelDone: {
    fontSize: 14,
    color: '#4ade80',
    fontWeight: '700',
    marginTop: 4,
  },
  footer: {
    marginBottom: 16,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#0f0f0f',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  secondaryButton: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
