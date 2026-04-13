import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Program } from '../types';
import { getActivityById } from '../data/activities';
import { colors, typography, spacing, radius } from '../theme';

export default function ProgramDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const program: Program = route.params.program;

  const handleStartDay = (dayIndex: number) => {
    const activityId = program.activityIds[dayIndex];
    const activity = getActivityById(activityId);
    if (activity) {
      navigation.navigate('ActivityDetail', { activity });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg.base} />
      <LinearGradient
        colors={[program.gradient[0], colors.bg.base]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.4 }}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          {program.isPro && (
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeText}>PRO</Text>
            </View>
          )}
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <View style={styles.hero}>
            <Text style={styles.programIcon}>{program.icon}</Text>
            <Text style={styles.title}>{program.title}</Text>
            <Text style={styles.subtitle}>{program.subtitle}</Text>
          </View>

          {/* Description */}
          <Text style={styles.description}>{program.description}</Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{program.totalDays}</Text>
              <Text style={styles.statLabel}>dias</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>1</Text>
              <Text style={styles.statLabel}>sessao/dia</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>~10m</Text>
              <Text style={styles.statLabel}>por dia</Text>
            </View>
          </View>

          {/* Days list */}
          <View style={styles.daysSection}>
            <Text style={styles.sectionLabel}>SESSOES DIARIAS</Text>
            <View style={styles.daysList}>
              {program.activityIds.map((activityId, i) => {
                const activity = getActivityById(activityId);
                if (!activity) return null;
                return (
                  <TouchableOpacity
                    key={`${activityId}-${i}`}
                    style={styles.dayRow}
                    onPress={() => handleStartDay(i)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.dayNumber}>
                      <Text style={styles.dayNumberText}>{i + 1}</Text>
                    </View>
                    <View style={styles.dayInfo}>
                      <Text style={styles.dayActivity}>{activity.title}</Text>
                      <Text style={styles.dayDuration}>
                        {activity.icon} {activity.duration} min
                      </Text>
                    </View>
                    <Text style={styles.dayArrow}>›</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* Start button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => handleStartDay(0)}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={program.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.startButtonGradient}
            >
              <Text style={styles.startButtonText}>Comecar Dia 1 ▶</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.base },
  safeArea: { flex: 1 },

  // Top bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  backText: {
    fontSize: 24,
    color: '#ffffff',
    marginTop: -2,
  },
  proBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  proBadgeText: {
    fontSize: 10,
    fontWeight: typography.weight.black,
    color: '#ffffff',
    letterSpacing: 1.5,
  },

  scroll: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },

  // Hero
  hero: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  programIcon: {
    fontSize: 72,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.heavy,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.size.md,
    color: '#ffffff',
    opacity: 0.85,
    textAlign: 'center',
  },

  description: {
    fontSize: typography.size.base,
    color: colors.text.secondary,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.heavy,
    color: colors.text.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border.subtle,
  },

  // Days
  daysSection: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.text.tertiary,
    letterSpacing: typography.letterSpacing.wider,
    marginBottom: spacing.md,
  },
  daysList: {
    gap: spacing.sm,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  dayNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bg.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  dayNumberText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.heavy,
    color: colors.text.secondary,
  },
  dayInfo: {
    flex: 1,
  },
  dayActivity: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: 2,
  },
  dayDuration: {
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
  },
  dayArrow: {
    fontSize: 22,
    color: colors.text.tertiary,
  },

  // Footer
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.base,
    paddingTop: spacing.md,
  },
  startButton: {
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  startButtonGradient: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    letterSpacing: 0.3,
  },
});
