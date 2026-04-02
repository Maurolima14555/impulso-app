import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />
      <View style={styles.header}>
        <Text style={styles.title}>Definições</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Notificações</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Receber lembretes</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#374151', true: '#22c55e' }}
            thumbColor="#ffffff"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Plano</Text>
        <TouchableOpacity style={styles.upgradeCard} activeOpacity={0.85}>
          <Text style={styles.upgradeTitle}>Upgrade para Pro</Text>
          <Text style={styles.upgradePrice}>R$14,90/mês · R$99,90/ano</Text>
          <Text style={styles.upgradeDesc}>
            Actividades ilimitadas, estatísticas avançadas e sem anúncios.
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  header: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 16 },
  title: { fontSize: 32, fontWeight: '800', color: '#ffffff' },
  section: { paddingHorizontal: 24, marginTop: 24 },
  sectionLabel: { fontSize: 12, fontWeight: '600', color: '#6b7280', letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  rowLabel: { fontSize: 16, color: '#ffffff' },
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
});
