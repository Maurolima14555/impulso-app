import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  onClose?: () => void;
};

export default function PrivacyPolicyScreen({ onClose }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {onClose && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✕ Fechar</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.title}>Politica de Privacidade</Text>
        <Text style={styles.date}>Ultima atualizacao: Abril 2026</Text>

        <Text style={styles.heading}>1. Dados que recolhemos</Text>
        <Text style={styles.body}>
          O IMPULSO recolhe apenas os dados necessarios para o funcionamento da app:{'\n\n'}
          - Email e password (para criar conta){'\n'}
          - Atividades completadas (tipo, duracao, data){'\n'}
          - Preferencias de notificacao{'\n'}
          - Dados de uso anonimizados (para melhorar a app){'\n\n'}
          NAO recolhemos dados de outras apps, contactos, localizacao, fotos ou mensagens.
        </Text>

        <Text style={styles.heading}>2. Como usamos os dados</Text>
        <Text style={styles.body}>
          Usamos os teus dados exclusivamente para:{'\n\n'}
          - Mostrar o teu progresso (streak, estatisticas){'\n'}
          - Sincronizar entre dispositivos (se criares conta){'\n'}
          - Enviar notificacoes que pediste{'\n'}
          - Melhorar a experiencia da app
        </Text>

        <Text style={styles.heading}>3. Armazenamento e seguranca</Text>
        <Text style={styles.body}>
          Os teus dados sao armazenados de forma segura via Supabase (PostgreSQL) com encriptacao em transito (TLS/SSL). Dados locais sao guardados no dispositivo via AsyncStorage.
        </Text>

        <Text style={styles.heading}>4. Os teus direitos (LGPD / GDPR)</Text>
        <Text style={styles.body}>
          Tens o direito de:{'\n\n'}
          - Aceder aos teus dados{'\n'}
          - Corrigir informacoes incorretas{'\n'}
          - Apagar todos os teus dados (nas Definicoes da app){'\n'}
          - Exportar os teus dados{'\n'}
          - Revogar consentimento a qualquer momento{'\n\n'}
          Para exercer qualquer direito, contacta: privacy@menteprospera.com
        </Text>

        <Text style={styles.heading}>5. Partilha com terceiros</Text>
        <Text style={styles.body}>
          NAO vendemos, alugamos ou partilhamos os teus dados pessoais com terceiros para fins de marketing. Usamos apenas:{'\n\n'}
          - Supabase (base de dados e autenticacao){'\n'}
          - RevenueCat (gestao de subscricoes){'\n'}
          - Expo (notificacoes push)
        </Text>

        <Text style={styles.heading}>6. Menores de idade</Text>
        <Text style={styles.body}>
          O IMPULSO nao se destina a menores de 13 anos. Se descobrirmos que recolhemos dados de um menor, eliminamos imediatamente.
        </Text>

        <Text style={styles.heading}>7. Alteracoes a esta politica</Text>
        <Text style={styles.body}>
          Podemos atualizar esta politica periodicamente. Notificaremos via app sobre alteracoes significativas.
        </Text>

        <Text style={styles.heading}>8. Contacto</Text>
        <Text style={styles.body}>
          Para questoes de privacidade:{'\n'}
          Email: privacy@menteprospera.com{'\n'}
          Instagram: @menteprospera24
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  scroll: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 48 },
  closeButton: { alignSelf: 'flex-end', padding: 8, marginBottom: 8 },
  closeText: { color: '#22c55e', fontSize: 15, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: '800', color: '#ffffff', marginBottom: 4 },
  date: { fontSize: 13, color: '#6b7280', marginBottom: 24 },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 24,
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 22,
  },
});
