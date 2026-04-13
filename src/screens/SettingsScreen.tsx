import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  StatusBar,
  Alert,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
  requestNotificationPermissions,
  scheduleDailyReminders,
  cancelAllNotifications,
} from '../lib/notifications';
import PaywallScreen from './PaywallScreen';
import PrivacyPolicyScreen from './PrivacyPolicyScreen';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

type RowProps = {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  chevron?: boolean;
  danger?: boolean;
  right?: React.ReactNode;
};

function Row({ icon, label, value, onPress, chevron = false, danger = false, right }: RowProps) {
  const content = (
    <View style={rowStyles.row}>
      <View style={rowStyles.iconBox}>
        <Ionicons name={icon as any} size={17} color={danger ? Colors.danger : Colors.textSecondary} />
      </View>
      <Text style={[rowStyles.label, danger && rowStyles.labelDanger]}>{label}</Text>
      <View style={rowStyles.right}>
        {right ?? (
          <>
            {value && <Text style={rowStyles.value}>{value}</Text>}
            {chevron && <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} style={{ marginLeft: 4 }} />}
          </>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }
  return content;
}

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const { completedActivities, isPro, refreshProStatus } = useApp();
  const { user, signOut, isConfigured } = useAuth();

  const handleToggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    if (value) {
      const granted = await requestNotificationPermissions();
      if (granted) {
        await scheduleDailyReminders();
      } else {
        setNotificationsEnabled(false);
        Alert.alert('Permissão negada', 'Activa as notificações nas definições do dispositivo.');
      }
    } else {
      await cancelAllNotifications();
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sair da conta', 'Tens a certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  const handleResetData = () => {
    Alert.alert(
      'Apagar dados',
      'Isto apaga todo o teu progresso. Não é reversível.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            Alert.alert('Feito', 'Reinicia a app para começar de novo.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <Text style={styles.title}>Definições</Text>

        {/* Plan */}
        <Text style={styles.sectionLabel}>PLANO</Text>
        {isPro ? (
          <View style={styles.group}>
            <View style={styles.proActiveCard}>
              <View style={styles.proActiveBadge}>
                <Ionicons name="infinite" size={14} color={Colors.bg} />
                <Text style={styles.proActiveBadgeText}>PRO</Text>
              </View>
              <Text style={styles.proActiveTitle}>IMPULSO Pro activo</Text>
              <Text style={styles.proActiveDesc}>Actividades ilimitadas e todas as features desbloqueadas.</Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.group} onPress={() => setShowPaywall(true)} activeOpacity={0.85}>
            <View style={styles.upgradeCard}>
              <View style={styles.upgradeTop}>
                <View style={styles.upgradeBadge}>
                  <Text style={styles.upgradeBadgeText}>PRO</Text>
                </View>
                <Text style={styles.upgradePrice}>R$14,90/mês · R$99,90/ano</Text>
              </View>
              <Text style={styles.upgradeTitle}>Desbloqueia o IMPULSO completo</Text>
              <Text style={styles.upgradeDesc}>
                Actividades ilimitadas, estatísticas avançadas, temas e sync na nuvem.
              </Text>
              <View style={styles.upgradeArrow}>
                <Text style={styles.upgradeArrowText}>Ver planos</Text>
                <Ionicons name="arrow-forward" size={14} color={Colors.accent} />
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Notifications */}
        <Text style={styles.sectionLabel}>NOTIFICAÇÕES</Text>
        <View style={styles.group}>
          <Row
            icon="notifications-outline"
            label="Receber lembretes"
            right={
              <Switch
                value={notificationsEnabled}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: Colors.border, true: Colors.accent }}
                thumbColor={Colors.textHighlight}
                ios_backgroundColor={Colors.border}
              />
            }
          />
        </View>

        {/* Account */}
        {isConfigured && user && (
          <>
            <Text style={styles.sectionLabel}>CONTA</Text>
            <View style={styles.group}>
              <Row icon="mail-outline" label="Email" value={user.email} />
              <View style={styles.divider} />
              <Row icon="log-out-outline" label="Sair da conta" onPress={handleSignOut} danger chevron />
            </View>
          </>
        )}

        {/* Data */}
        <Text style={styles.sectionLabel}>DADOS</Text>
        <View style={styles.group}>
          <Row
            icon="bar-chart-outline"
            label="Actividades registadas"
            value={String(completedActivities.length)}
          />
          <View style={styles.divider} />
          <Row icon="trash-outline" label="Apagar todos os dados" onPress={handleResetData} danger chevron />
        </View>

        {/* Legal */}
        <Text style={styles.sectionLabel}>LEGAL</Text>
        <View style={styles.group}>
          <Row icon="document-text-outline" label="Política de Privacidade" onPress={() => setShowPrivacy(true)} chevron />
        </View>

        {/* About */}
        <Text style={styles.sectionLabel}>SOBRE</Text>
        <View style={styles.group}>
          <Row icon="information-circle-outline" label="Versão" value="1.0.0" />
          <View style={styles.divider} />
          <Row icon="logo-instagram" label="Criado por" value="@menteprospera24" />
        </View>

      </ScrollView>

      <Modal visible={showPaywall} animationType="slide">
        <PaywallScreen
          onClose={() => setShowPaywall(false)}
          onPurchased={() => { setShowPaywall(false); refreshProStatus(); }}
        />
      </Modal>
      <Modal visible={showPrivacy} animationType="slide">
        <PrivacyPolicyScreen onClose={() => setShowPrivacy(false)} />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 48 },

  title: { ...Typography.h1, marginBottom: 28 },

  sectionLabel: {
    ...Typography.label,
    letterSpacing: 1.5,
    paddingHorizontal: 4,
    marginBottom: 8,
    marginTop: 24,
  },

  group: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },

  divider: {
    height: 1,
    backgroundColor: Colors.borderSubtle,
    marginLeft: 56,
  },

  // Upgrade card
  upgradeCard: {
    padding: 20,
  },
  upgradeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  upgradeBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  upgradeBadgeText: { fontSize: 11, fontWeight: '900', color: Colors.bg, letterSpacing: 2 },
  upgradePrice: { fontSize: 12, color: Colors.accent, fontWeight: '500' },
  upgradeTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  upgradeDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20, marginBottom: 16 },
  upgradeArrow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  upgradeArrowText: { fontSize: 13, fontWeight: '700', color: Colors.accent },

  // Pro active card
  proActiveCard: { padding: 20 },
  proActiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.accent,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  proActiveBadgeText: { fontSize: 11, fontWeight: '900', color: Colors.bg, letterSpacing: 2 },
  proActiveTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  proActiveDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
});

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  iconBox: {
    width: 28,
    alignItems: 'center',
  },
  label: { flex: 1, fontSize: 15, color: Colors.textPrimary, fontWeight: '400' },
  labelDanger: { color: Colors.danger },
  right: { flexDirection: 'row', alignItems: 'center' },
  value: { fontSize: 14, color: Colors.textSecondary },
});
