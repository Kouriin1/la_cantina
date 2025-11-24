
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuthStore } from '../../state/authStore';
import { colors } from '../../theme/colors';

const SettingsScreen = () => {
  const { user, setUser } = useAuthStore();
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatarUrl || 'https://ui-avatars.com/api/?name=' + (user?.firstName || '') + '+' + (user?.lastName || ''));
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      // Aquí iría la llamada real al backend para actualizar el usuario
      setTimeout(() => {
        setUser({ ...user, firstName, lastName, email, avatarUrl: avatar });
        setSuccess(true);
        setLoading(false);
      }, 800);
    } catch (e) {
      setError('Error al guardar los cambios.');
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    if ((navigation as any).goBack) (navigation as any).goBack();
  };


  const handleChangePhoto = async () => {
    // Solicitar permisos y abrir el selector de imágenes
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permiso requerido', 'Se necesita permiso para acceder a la galería.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.IMAGE,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
      setSuccess(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={["#f5f6fa", "#e6eafc", "#f5f6fa"]} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <Ionicons name="arrow-back" size={22} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Editar Perfil</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.avatarSection}>
              <View style={styles.avatarBorder}>
                <Image source={{ uri: avatar }} style={styles.avatar} />
              </View>
              <TouchableOpacity style={styles.editPhotoButton} onPress={handleChangePhoto}>
                <Ionicons name="camera" size={22} color={colors.white} />
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionTitle}>Información Personal</Text>
            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}><Ionicons name="person-outline" size={18} color={colors.primary} /></View>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Nombre"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}><Ionicons name="person-outline" size={18} color={colors.primary} /></View>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Apellido"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}><Ionicons name="mail-outline" size={18} color={colors.primary} /></View>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Correo electrónico"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            {success ? <Text style={styles.successText}>¡Cambios guardados!</Text> : null}
            <TouchableOpacity activeOpacity={0.8} onPress={handleSave} disabled={loading} style={styles.saveButtonWrap}>
              <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.saveButton} start={{x:0, y:0}} end={{x:1, y:1}}>
                <Text style={styles.saveButtonText}>{loading ? 'Guardando...' : 'Guardar Cambios'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 0,
  },
  gradient: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  backButton: {
    marginRight: 10,
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    letterSpacing: 1,
    textShadowColor: colors.primary,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    margin: 18,
    marginTop: 36,
    shadowColor: '#1a237e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
    alignItems: 'center',
    width: '94%',
    maxWidth: 400,
  },
  avatarBorder: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: '#f5f6fa',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1a237e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 3,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.inputBackground,
    borderWidth: 2,
    borderColor: '#e6eafc',
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 8,
    right: 16,
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 8,
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 18,
    alignSelf: 'flex-start',
    marginLeft: 2,
    letterSpacing: 0.3,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e6eafc',
    marginBottom: 14,
    paddingHorizontal: 12,
    paddingVertical: 4,
    width: '100%',
  },
  inputIcon: {
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
    fontWeight: '400',
    letterSpacing: 0.1,
  },
  saveButtonWrap: {
    width: '100%',
    marginTop: 22,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 2,
  },
  saveButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
    letterSpacing: 0.2,
  },
  errorText: {
    color: colors.danger,
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  successText: {
    color: colors.success,
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
});

export default SettingsScreen;
