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
  const [avatar, setAvatar] = useState('https://ui-avatars.com/api/?name=' + (user?.firstName || '') + '+' + (user?.lastName || ''));
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      setTimeout(() => {
        setUser({ ...user, firstName, lastName, email });
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
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permiso requerido', 'Se necesita permiso para acceder a la galería.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
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
      <LinearGradient
        colors={['#B8956A', '#A67C52', '#B8956A']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack} activeOpacity={0.7}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Editar Perfil</Text>
              <Text style={styles.headerSubtitle}>Actualiza tu información personal</Text>
            </View>
          </View>

          <View style={styles.mainCard}>
            <View style={styles.avatarSection}>
              <LinearGradient
                colors={['#ED9B40', '#E8872E']}
                style={styles.avatarGradientBorder}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.avatarInnerBorder}>
                  <Image source={{ uri: avatar }} style={styles.avatar} />
                </View>
              </LinearGradient>
              <TouchableOpacity
                style={styles.editPhotoButton}
                onPress={handleChangePhoto}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#61C9A8', '#4FB896']}
                  style={styles.editPhotoGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="camera" size={20} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <Text style={styles.userName}>{user?.firstName} {user?.lastName}</Text>
            <View style={styles.roleBadge}>
              <Ionicons
                name={user?.role === 'student' ? 'school' : user?.role === 'cafeteria' ? 'restaurant' : 'people'}
                size={14}
                color="#ED9B40"
              />
              <Text style={styles.roleText}>
                {user?.role === 'student' ? 'Estudiante' : user?.role === 'parent' ? 'Representante' : 'Cantina'}
              </Text>
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Ionicons name="person-circle-outline" size={20} color="#61C9A8" />
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>
                <Ionicons name="information-circle" size={18} color="#B8956A" /> Información Personal
              </Text>

              <View style={[
                styles.inputContainer,
                focusedInput === 'firstName' && styles.inputContainerFocused
              ]}>
                <View style={styles.inputIconContainer}>
                  <Ionicons name="person" size={20} color="#ED9B40" />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Nombre</Text>
                  <TextInput
                    style={styles.input}
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="Ingresa tu nombre"
                    placeholderTextColor="#B2BEC3"
                    onFocus={() => setFocusedInput('firstName')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>
              </View>

              <View style={[
                styles.inputContainer,
                focusedInput === 'lastName' && styles.inputContainerFocused
              ]}>
                <View style={styles.inputIconContainer}>
                  <Ionicons name="person-outline" size={20} color="#ED9B40" />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Apellido</Text>
                  <TextInput
                    style={styles.input}
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Ingresa tu apellido"
                    placeholderTextColor="#B2BEC3"
                    onFocus={() => setFocusedInput('lastName')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>
              </View>

              <View style={[
                styles.inputContainer,
                focusedInput === 'email' && styles.inputContainerFocused
              ]}>
                <View style={styles.inputIconContainer}>
                  <Ionicons name="mail" size={20} color="#ED9B40" />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Correo Electrónico</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="correo@ejemplo.com"
                    placeholderTextColor="#B2BEC3"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>
              </View>

              {error ? (
                <View style={styles.messageContainer}>
                  <Ionicons name="alert-circle" size={18} color={colors.danger} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              {success ? (
                <View style={styles.messageContainer}>
                  <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                  <Text style={styles.successText}>¡Cambios guardados exitosamente!</Text>
                </View>
              ) : null}

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleSave}
                disabled={loading}
                style={styles.saveButtonContainer}
              >
                <LinearGradient
                  colors={loading ? ['#B2BEC3', '#636E72'] : ['#61C9A8', '#4FB896']}
                  style={styles.saveButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {loading ? (
                    <>
                      <Ionicons name="hourglass-outline" size={20} color="#fff" style={styles.buttonIcon} />
                      <Text style={styles.saveButtonText}>Guardando...</Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="save" size={20} color="#fff" style={styles.buttonIcon} />
                      <Text style={styles.saveButtonText}>Guardar Cambios</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.infoFooter}>
            <Ionicons name="shield-checkmark" size={16} color="rgba(255,255,255,0.6)" />
            <Text style={styles.infoFooterText}>Tu información está segura y encriptada</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B8956A',
  },
  gradient: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.3,
  },
  mainCard: {
    backgroundColor: '#fff',
    borderRadius: 30,
    marginHorizontal: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  avatarGradientBorder: {
    width: 130,
    height: 130,
    borderRadius: 65,
    padding: 4,
    shadowColor: '#ED9B40',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarInnerBorder: {
    width: '100%',
    height: '100%',
    borderRadius: 61,
    backgroundColor: '#fff',
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: '32%',
    borderRadius: 20,
    shadowColor: '#61C9A8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  editPhotoGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B8956A',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5E6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
    gap: 6,
  },
  roleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ED9B40',
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E6EAFC',
  },
  formSection: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B8956A',
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputContainerFocused: {
    borderColor: '#61C9A8',
    backgroundColor: '#FFF',
    shadowColor: '#61C9A8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFF5E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  inputWrapper: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#636E72',
    marginBottom: 2,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  input: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
    padding: 0,
    margin: 0,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  successText: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  saveButtonContainer: {
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#61C9A8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  infoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 8,
    paddingHorizontal: 20,
  },
  infoFooterText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.3,
  },
});

export default SettingsScreen;
