import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, Link } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';

export default function SignupScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const { register, loading, error } = useAuth();

  const handleSignup = async () => {
    if (!fullName || !email || !password || !acceptTerms) {
      Alert.alert('Error', 'Please fill in all fields and accept the terms');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const success = await register(fullName, email, password);
    if (success) {
      router.replace('/(tabs)');
    }
  };

  const togglePasswordVisibility = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowPassword(!showPassword);
  };

  const toggleTerms = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAcceptTerms(!acceptTerms);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.logoText}>Venue Finder</Text>
            <Text style={styles.subtitle}>Create a new account</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={18} color="#8E8E93" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full name"
                  placeholderTextColor="#A3A3A3"
                  autoCapitalize="words"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={18} color="#8E8E93" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor="#A3A3A3"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={18} color="#8E8E93" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Create password"
                  placeholderTextColor="#A3A3A3"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <Pressable onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#8E8E93"
                  />
                </Pressable>
              </View>
              <Text style={styles.passwordHint}>Password must be at least 8 characters</Text>
            </View>

            <Pressable style={styles.termsContainer} onPress={toggleTerms}>
              <View style={[
                styles.checkbox,
                acceptTerms && styles.checkboxChecked
              ]}>
                {acceptTerms && (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                )}
              </View>
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.termsHighlight}>Terms of Service</Text> and <Text style={styles.termsHighlight}>Privacy Policy</Text>
              </Text>
            </Pressable>

            <TouchableOpacity
              style={[styles.button, (!fullName || !email || !password || !acceptTerms) && styles.buttonDisabled]}
              onPress={handleSignup}
              disabled={!fullName || !email || !password || !acceptTerms || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>
            
            <View style={styles.separator}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>or</Text>
              <View style={styles.separatorLine} />
            </View>

            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-apple" size={20} color="#000" />
                <Text style={styles.socialButtonText}>Sign up with Apple</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
                <Ionicons name="logo-google" size={20} color="#4285F4" />
                <Text style={styles.socialButtonText}>Sign up with Google</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  logoText: {
    fontFamily: 'Pacifico',
    fontSize: 32,
    color: '#000',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Montserratmedium',
    color: '#3C3C43',
    opacity: 0.6,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputContainer: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#F2F2F7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: 'Montserratregular',
    fontSize: 15,
    color: '#000',
  },
  eyeIcon: {
    padding: 6,
  },
  passwordHint: {
    fontSize: 12,
    fontFamily: 'Montserratregular',
    color: '#8E8E93',
    marginTop: 4,
    marginLeft: 4,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 4,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#C7C7CC',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Montserratregular',
    color: '#3C3C43',
    lineHeight: 18,
  },
  termsHighlight: {
    fontFamily: 'Montserratmedium',
    color: '#007AFF',
  },
  button: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#007AFF',
    opacity: 0.6,
  },
  buttonText: {
    fontFamily: 'Montserratbold',
    fontSize: 15,
    color: '#fff',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5EA',
  },
  separatorText: {
    marginHorizontal: 16,
    fontFamily: 'Montserratregular',
    fontSize: 14,
    color: '#8E8E93',
  },
  socialButtonsContainer: {
    gap: 12,
  },
  socialButton: {
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F2F2F7',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  googleButton: {
    backgroundColor: '#F2F2F7',
  },
  socialButtonText: {
    fontFamily: 'Montserratmedium',
    fontSize: 14,
    color: '#000',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingVertical: 16,
  },
  footerText: {
    fontFamily: 'Montserratregular',
    fontSize: 14,
    color: '#3C3C43',
    opacity: 0.6,
  },
  footerLink: {
    fontFamily: 'Montserratbold',
    fontSize: 14,
    color: '#007AFF',
  },
}); 