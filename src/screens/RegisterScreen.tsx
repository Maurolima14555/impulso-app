import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

type Props = {
  onSwitchToLogin: () => void;
  onSkip: () => void;
};

export default function RegisterScreen({ onSwitchToLogin, onSkip }: Props) {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Preenche email e password');
      return;
    }
    if (password.length < 6) {
      setError('A password precisa de pelo menos 6 caracteres');
      return;
    }
    setError('');
    setLoading(true);
    const { error: err } = await signUp(email.trim(), password, name.trim());
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      Alert.alert(
        'Conta criada!',
        'Verifica o teu email para confirmar a conta.',
        [{ text: 'OK', onPress: onSwitchToLogin }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>IMPULSO</Text>
          <View style={styles.accent} />
          <Text style={styles.subtitle}>Cria a tua conta</Text>
          <Text style={styles.description}>
            Guarda o teu progresso e sincroniza entre dispositivos
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Nome (opcional)"
            placeholderTextColor="#4b5563"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#4b5563"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Password (min. 6 caracteres)"
            placeholderTextColor="#4b5563"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#0f0f0f" />
            ) : (
              <Text style={styles.buttonText}>Criar conta</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={onSwitchToLogin}>
            <Text style={styles.linkText}>
              Ja tens conta? <Text style={styles.linkBold}>Entrar</Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Continuar sem conta</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  header: { marginTop: 48 },
  logo: {
    fontSize: 32,
    fontWeight: '900',
    color: '#22c55e',
    letterSpacing: 6,
  },
  accent: {
    marginTop: 6,
    width: 28,
    height: 3,
    backgroundColor: '#22c55e',
    borderRadius: 2,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#6b7280',
    lineHeight: 22,
  },
  form: { gap: 14 },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  error: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#22c55e',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: {
    color: '#0f0f0f',
    fontSize: 17,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 32,
    gap: 16,
  },
  linkText: { color: '#6b7280', fontSize: 15 },
  linkBold: { color: '#22c55e', fontWeight: '700' },
  skipButton: { padding: 8 },
  skipText: { color: '#4b5563', fontSize: 14 },
});
