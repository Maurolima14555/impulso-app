import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PurchasesPackage } from 'react-native-purchases';
import { getOfferings, purchasePackage, restorePurchases, isPurchasesConfigured } from '../lib/purchases';

type Props = {
  onClose: () => void;
  onPurchased: () => void;
};

const PRO_FEATURES = [
  { icon: '♾️', title: 'Atividades ilimitadas', desc: 'Sem limite de 3 por dia' },
  { icon: '📊', title: 'Estatisticas avancadas', desc: 'Graficos semanais e mensais' },
  { icon: '🎨', title: 'Temas personalizados', desc: 'Escolhe as tuas cores' },
  { icon: '🔔', title: 'Alertas inteligentes', desc: 'Notificacoes personalizadas por app' },
  { icon: '☁️', title: 'Sync na nuvem', desc: 'Nunca perde o teu progresso' },
  { icon: '🚫', title: 'Sem anuncios', desc: 'Experiencia limpa e focada' },
];

export default function PaywallScreen({ onClose, onPurchased }: Props) {
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    const pkgs = await getOfferings();
    setPackages(pkgs);
    // Select annual by default (better value)
    const annualIdx = pkgs.findIndex((p) => p.packageType === 'ANNUAL');
    if (annualIdx >= 0) setSelectedIdx(annualIdx);
    setLoading(false);
  };

  const handlePurchase = async () => {
    if (packages.length === 0) return;
    setPurchasing(true);
    const { success, error } = await purchasePackage(packages[selectedIdx]);
    setPurchasing(false);
    if (success) {
      onPurchased();
    } else if (error) {
      Alert.alert('Erro', error);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    const restored = await restorePurchases();
    setLoading(false);
    if (restored) {
      onPurchased();
    } else {
      Alert.alert('Nada encontrado', 'Nao encontramos compras anteriores associadas a esta conta.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Close button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.badge}>PRO</Text>
          <Text style={styles.title}>Desbloqueia o teu{'\n'}potencial total</Text>
          <Text style={styles.subtitle}>
            Tudo o que precisas para transformar o teu tempo em crescimento real.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          {PRO_FEATURES.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Pricing */}
        {loading ? (
          <ActivityIndicator color="#22c55e" size="large" style={{ marginVertical: 32 }} />
        ) : packages.length > 0 ? (
          <View style={styles.pricing}>
            {packages.map((pkg, i) => {
              const isAnnual = pkg.packageType === 'ANNUAL';
              const selected = i === selectedIdx;
              return (
                <TouchableOpacity
                  key={pkg.identifier}
                  style={[styles.priceCard, selected && styles.priceCardSelected]}
                  onPress={() => setSelectedIdx(i)}
                  activeOpacity={0.8}
                >
                  {isAnnual && (
                    <View style={styles.saveBadge}>
                      <Text style={styles.saveBadgeText}>-44%</Text>
                    </View>
                  )}
                  <Text style={[styles.pricePeriod, selected && styles.pricePeriodSelected]}>
                    {isAnnual ? 'Anual' : 'Mensal'}
                  </Text>
                  <Text style={[styles.priceValue, selected && styles.priceValueSelected]}>
                    {pkg.product.priceString}
                  </Text>
                  <Text style={styles.priceDetail}>
                    {isAnnual ? `${(pkg.product.price / 12).toFixed(2)}/mes` : 'por mes'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          /* Fallback when RevenueCat not configured */
          <View style={styles.pricing}>
            <TouchableOpacity
              style={[styles.priceCard, selectedIdx === 0 && styles.priceCardSelected]}
              onPress={() => setSelectedIdx(0)}
              activeOpacity={0.8}
            >
              <View style={styles.saveBadge}>
                <Text style={styles.saveBadgeText}>-44%</Text>
              </View>
              <Text style={[styles.pricePeriod, styles.pricePeriodSelected]}>Anual</Text>
              <Text style={[styles.priceValue, styles.priceValueSelected]}>R$99,90</Text>
              <Text style={styles.priceDetail}>R$8,33/mes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.priceCard, selectedIdx === 1 && styles.priceCardSelected]}
              onPress={() => setSelectedIdx(1)}
              activeOpacity={0.8}
            >
              <Text style={styles.pricePeriod}>Mensal</Text>
              <Text style={styles.priceValue}>R$14,90</Text>
              <Text style={styles.priceDetail}>por mes</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* CTA */}
        <TouchableOpacity
          style={[styles.ctaButton, purchasing && styles.ctaDisabled]}
          onPress={handlePurchase}
          activeOpacity={0.85}
          disabled={purchasing}
        >
          {purchasing ? (
            <ActivityIndicator color="#0f0f0f" />
          ) : (
            <Text style={styles.ctaText}>Comecar agora</Text>
          )}
        </TouchableOpacity>

        {/* Restore + Legal */}
        <View style={styles.legal}>
          <TouchableOpacity onPress={handleRestore}>
            <Text style={styles.legalLink}>Restaurar compra</Text>
          </TouchableOpacity>
          <Text style={styles.legalText}>
            Cancela quando quiseres. Sem compromisso.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  scroll: { paddingHorizontal: 24, paddingBottom: 40 },
  closeButton: { alignSelf: 'flex-end', padding: 8, marginTop: 8 },
  closeText: { fontSize: 24, color: '#6b7280' },
  header: { marginTop: 8, marginBottom: 32 },
  badge: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0f0f0f',
    backgroundColor: '#22c55e',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    letterSpacing: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 42,
    marginBottom: 12,
  },
  subtitle: { fontSize: 16, color: '#9ca3af', lineHeight: 24 },
  features: { marginBottom: 32, gap: 16 },
  featureRow: { flexDirection: 'row', alignItems: 'center' },
  featureIcon: { fontSize: 28, marginRight: 16, width: 36, textAlign: 'center' },
  featureInfo: { flex: 1 },
  featureTitle: { fontSize: 16, fontWeight: '700', color: '#ffffff', marginBottom: 2 },
  featureDesc: { fontSize: 13, color: '#6b7280' },
  pricing: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  priceCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2a2a2a',
  },
  priceCardSelected: {
    borderColor: '#22c55e',
    backgroundColor: '#052e16',
  },
  saveBadge: {
    position: 'absolute',
    top: -10,
    right: -4,
    backgroundColor: '#22c55e',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  saveBadgeText: { fontSize: 11, fontWeight: '800', color: '#0f0f0f' },
  pricePeriod: { fontSize: 14, fontWeight: '600', color: '#6b7280', marginBottom: 8 },
  pricePeriodSelected: { color: '#4ade80' },
  priceValue: { fontSize: 24, fontWeight: '900', color: '#ffffff', marginBottom: 4 },
  priceValueSelected: { color: '#22c55e' },
  priceDetail: { fontSize: 12, color: '#6b7280' },
  ctaButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 20,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  ctaDisabled: { opacity: 0.7 },
  ctaText: { color: '#0f0f0f', fontSize: 18, fontWeight: '800' },
  legal: { alignItems: 'center', gap: 8 },
  legalLink: { color: '#22c55e', fontSize: 14, fontWeight: '600' },
  legalText: { color: '#4b5563', fontSize: 12, textAlign: 'center' },
});
