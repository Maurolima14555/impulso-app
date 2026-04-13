import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { requestNotificationPermissions, scheduleDailyReminders } from '../lib/notifications';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import Button from '../components/Button';
import { INTENTIONS, Intention } from '../types';

const { width } = Dimensions.get('window');

// — Slide 1: animated circle —
function PulseCircle() {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.15)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.18, duration: 1400, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1, duration: 1400, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0.28, duration: 1400, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.12, duration: 1400, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <View style={slide1.circleContainer}>
      <Animated.View style={[slide1.circleOuter, { transform: [{ scale }], opacity }]} />
      <View style={slide1.circleMiddle} />
      <View style={slide1.circleInner} />
    </View>
  );
}

// — Slide 3: notification illustration —
function NotificationIllustration() {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, { toValue: -8, duration: 1200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[slide3.phoneWrap, { transform: [{ translateY }] }]}>
      <View style={slide3.phone}>
        <View style={slide3.phoneSpeaker} />
        <View style={slide3.notifCard}>
          <View style={slide3.notifIcon}>
            <Text style={{ fontSize: 16 }}>🌱</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={slide3.notifTitle}>Momento IMPULSO</Text>
            <Text style={slide3.notifBody}>Que tal 5 min de leitura?</Text>
          </View>
        </View>
        <View style={[slide3.notifCard, { opacity: 0.4, marginTop: 8 }]}>
          <View style={[slide3.notifIcon, { backgroundColor: Colors.accentSubtle }]}>
            <Text style={{ fontSize: 14 }}>🎯</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[slide3.notifTitle, { fontSize: 11 }]}>30 min de scroll</Text>
            <Text style={[slide3.notifBody, { fontSize: 10 }]}>Hora de crescer!</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const [selectedIntentions, setSelectedIntentions] = useState<Intention[]>([]);
  const [notifGranted, setNotifGranted] = useState<boolean | null>(null);
  const { completeOnboarding } = useApp();

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const goTo = (next: number) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      setStep(next);
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    });
  };

  const toggleIntention = (id: Intention) => {
    setSelectedIntentions((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleRequestNotif = async () => {
    const granted = await requestNotificationPermissions();
    if (granted) await scheduleDailyReminders();
    setNotifGranted(granted);
  };

  const handleFinish = async () => {
    await completeOnboarding();
  };

  const isLast = step === 2;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      {/* Progress lines */}
      <View style={styles.progress}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.line, i <= step && styles.lineActive]} />
        ))}
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>

        {/* SLIDE 1 */}
        {step === 0 && (
          <View style={styles.slide}>
            <PulseCircle />
            <View style={styles.textBlock}>
              <Text style={styles.slideTagline}>Chega de scroll{'\n'}sem sentido.</Text>
              <Text style={styles.slideBody}>
                O IMPULSO detecta quando passas demasiado tempo no telefone
                e transforma esses minutos em crescimento real.
              </Text>
            </View>
          </View>
        )}

        {/* SLIDE 2 */}
        {step === 1 && (
          <View style={styles.slide}>
            <Text style={styles.slideHeading}>O que queres{'\n'}do IMPULSO?</Text>
            <Text style={styles.slideSubtitle}>Escolhe tudo o que se aplica</Text>
            <View style={styles.chipsGrid}>
              {INTENTIONS.map((intention) => {
                const selected = selectedIntentions.includes(intention.id);
                return (
                  <TouchableOpacity
                    key={intention.id}
                    style={[styles.chip, selected && styles.chipSelected]}
                    onPress={() => toggleIntention(intention.id)}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.chipEmoji}>{intention.emoji}</Text>
                    <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>
                      {intention.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* SLIDE 3 */}
        {step === 2 && (
          <View style={styles.slide}>
            <NotificationIllustration />
            <View style={styles.textBlock}>
              <Text style={styles.slideHeading}>Activa os teus{'\n'}lembretes</Text>
              <Text style={styles.slideBody}>
                Enviamos um IMPULSO quando notas que precisas de uma pausa
                do scroll. Positivo, não intrusivo.
              </Text>
              {notifGranted === false && (
                <View style={styles.notifWarning}>
                  <Ionicons name="alert-circle-outline" size={15} color={Colors.warning} />
                  <Text style={styles.notifWarningText}>
                    Podes activar mais tarde nas Definições do dispositivo.
                  </Text>
                </View>
              )}
              {notifGranted === true && (
                <View style={styles.notifSuccess}>
                  <Ionicons name="checkmark-circle" size={15} color={Colors.accent} />
                  <Text style={styles.notifSuccessText}>Notificações activadas!</Text>
                </View>
              )}
              {notifGranted === null && (
                <TouchableOpacity style={styles.notifButton} onPress={handleRequestNotif} activeOpacity={0.8}>
                  <Ionicons name="notifications-outline" size={16} color={Colors.accent} />
                  <Text style={styles.notifButtonText}>Activar notificações</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </Animated.View>

      {/* Footer */}
      <View style={styles.footer}>
        {isLast ? (
          <Button label="Começar agora" variant="primary" size="lg" style={styles.btn} onPress={handleFinish} />
        ) : (
          <>
            <Button
              label={step === 1 && selectedIntentions.length === 0 ? 'Pular' : 'Próximo'}
              variant="primary"
              size="lg"
              style={styles.btn}
              onPress={() => goTo(step + 1)}
            />
            <TouchableOpacity onPress={() => completeOnboarding()} style={styles.skipBtn}>
              <Text style={styles.skipText}>Pular tudo</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

// ─── Main styles ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  progress: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  line: {
    flex: 1,
    height: 2,
    borderRadius: 1,
    backgroundColor: Colors.border,
  },
  lineActive: { backgroundColor: Colors.accent },
  content: { flex: 1, paddingHorizontal: 24 },
  slide: { flex: 1, justifyContent: 'center' },
  textBlock: { marginTop: 32 },
  slideTagline: {
    ...Typography.tagline,
    marginBottom: 20,
  },
  slideHeading: {
    ...Typography.h1,
    marginBottom: 8,
  },
  slideSubtitle: {
    ...Typography.bodySmall,
    marginBottom: 24,
  },
  slideBody: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.bgCard,
  },
  chipSelected: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accentSubtle,
  },
  chipEmoji: { fontSize: 16 },
  chipLabel: { fontSize: 13, fontWeight: '500', color: Colors.textSecondary },
  chipLabelSelected: { color: Colors.accent, fontWeight: '600' },
  footer: { paddingHorizontal: 24, paddingBottom: 24, paddingTop: 12 },
  btn: { width: '100%' },
  skipBtn: { alignItems: 'center', paddingVertical: 16 },
  skipText: { fontSize: 14, color: Colors.textMuted },

  // Notification states
  notifButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.accentMid,
    backgroundColor: Colors.accentSubtle,
    alignSelf: 'flex-start',
  },
  notifButtonText: { fontSize: 14, color: Colors.accent, fontWeight: '600' },
  notifWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 20,
  },
  notifWarningText: { fontSize: 13, color: Colors.warning, flex: 1 },
  notifSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 20,
  },
  notifSuccessText: { fontSize: 13, color: Colors.accent, fontWeight: '600' },
});

// ─── Slide 1 styles ───────────────────────────────────────────────────────────
const slide1 = StyleSheet.create({
  circleContainer: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  circleOuter: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: Colors.accent,
  },
  circleMiddle: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.accentDark,
    borderWidth: 1,
    borderColor: Colors.accentMid,
  },
  circleInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.accent,
  },
});

// ─── Slide 3 styles ───────────────────────────────────────────────────────────
const slide3 = StyleSheet.create({
  phoneWrap: {
    alignItems: 'center',
    marginBottom: 8,
  },
  phone: {
    width: 240,
    backgroundColor: Colors.bgCardElevated,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
  },
  phoneSpeaker: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: 20,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notifIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.accentSubtle,
    borderWidth: 1,
    borderColor: Colors.accentMid,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifTitle: { fontSize: 12, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  notifBody: { fontSize: 11, color: Colors.textSecondary },
});
