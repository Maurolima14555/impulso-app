import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, StatusBar, Alert, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { requestNotificationPermissions, scheduleDailyReminders, cancelAllNotifications } from '../lib/notifications';
import PaywallScreen from './PaywallScreen';
import PrivacyPolicyScreen from './PrivacyPolicyScreen';

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
        Alert.alert('Permissao negada', 'Ativa as notificacoes nas definicoes do dispositivo.');
      }
    } else {
      await cancelAllNotifications();
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sair da conta', 'Tens a certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', onPress: () => signOut() },
    ]);
  };

  const handleResetData = () => {
    Alert.alert(
      'Apagar dados',
      'Tens a certeza? Isto apaga todo o teu progresso.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            Alert.alert('Dados apagados', 'Reinicia a app para comecar de novo.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Definicoes</Text>

        {/* Plan */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Plano</Text>
          {isPro ? (
            <View style={styles.proActiveCard}>
              <Text style={styles.proActiveTitle}>IMPULSO PRO ativo</Text>
              <Text style={styles.proActiveDesc}>Atividades ilimitadas e todas as features desbloqueadas.</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.upgradeCard}
              activeOpacity={0.85}
              onPress={() => setShowPaywall(true)}
            >
              <Text style={styles.upgradeTitle}>Upgrade para Pro</Text>
              <Text style={styles.upgradePrice}>R$14,90/mes ou R$99,90/ano</Text>
              <Text style={styles.upgradeDesc}>
                Atividades ilimitadas, estatisticas avancadas, temas personalizados e sem anuncios.
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Notificacoes</Text>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>Receber lembretes</Text>
              <Text style={styles.rowDesc}>Alertas quando passas tempo demais nas redes</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: '#374151', true: '#22c55e' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* Account */}
        {isConfigured && user && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Conta</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
            <TouchableOpacity style={styles.dangerButton} onPress={handleSignOut}>
              <Text style={styles.dangerText}>Sair da conta</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Data */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Dados</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Atividades registadas</Text>
            <Text style={styles.infoValue}>{completedActivities.length}</Text>
          </View>
          <TouchableOpacity style={styles.dangerButton} onPress={handleResetData}>
            <Text style={styles.dangerText}>Apagar todos os dados</Text>
          </TouchableOpacity>
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Legal</Text>
          <TouchableOpacity style={styles.infoRow} onPress={() => setShowPrivacy(true)}>
            <Text style={styles.infoLabel}>Politica de Privacidade</Text>
            <Text style={styles.infoArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Sobre</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Versao</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Criado por</Text>
            <Text style={styles.infoValue}>@menteprospera24</Text>
          </View>
        </View>
      </ScrollView>

      <Modal visible={showPaywall} animationType="slide">
        <PaywallScreen
          onClose={() => setShowPaywall(false)}
          onPurchased={() => {
            setShowPaywall(false);
            refreshProStatus();
          }}
        />
      </Modal>

      <Modal visible={showPrivacy} animationType="slide">
        <PrivacyPolicyScreen onClose={() => setShowPrivacy(false)} />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  scroll: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 48 },
  title: { fontSize: 32, fontWeight: '800', color: '#ffffff', marginBottom: 24 },
  section: { marginBottom: 32 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    letterSpacing: 1,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  rowLabel: { fontSize: 16, color: '#ffffff', marginBottom: 2 },
  rowDesc: { fontSize: 12, color: '#6b7280', maxWidth: 240 },
  proActiveCard: {
    backgroundColor: '#052e16',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  proActiveTitle: { fontSize: 18, fontWeight: '800', color: '#22c55e', marginBottom: 4 },
  proActiveDesc: { fontSize: 14, color: '#4ade80' },
  upgradeCard: {
    backgroundColor: '#052e16',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  upgradeTitle: { fontSize: 18, fontWeight: '800', color: '#22c55e', marginBottom: 4 },
  upgradePrice: { fontSize: 14, color: '#4ade80', marginBottom: 10 },
  upgradeDesc: { fontSize: 14, color: '#6b7280', lineHeight: 21 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 8,
  },
  infoLabel: { fontSize: 15, color: '#ffffff' },
  infoValue: { fontSize: 15, color: '#6b7280' },
  infoArrow: { fontSize: 20, color: '#6b7280' },
  dangerButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#7f1d1d',
  },
  dangerText: { fontSize: 15, color: '#ef4444', textAlign: 'center' },
});
