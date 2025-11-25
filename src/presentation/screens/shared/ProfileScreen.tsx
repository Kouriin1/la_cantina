import Button from '@/src/presentation/components/Button';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { UserRepositoryImpl } from '../../../data/repositories/UserRepositoryImpl';
import { User } from '../../../domain/entities/User';
import { useAuthStore } from '../../state/authStore';
import { colors } from '../../theme/colors';

const ProfileScreen = () => {
  const { user, logout } = useAuthStore();
  const [child, setChild] = useState<User | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchChildData = async () => {
      if (user?.role === 'parent' && user.childId) {
        const userRepository = new UserRepositoryImpl();
        const childData = await userRepository.getUserById(user.childId);
        setChild(childData);
      }
    };
    fetchChildData();
  }, [user]);

  const handleLogout = async () => {
    await logout();
  };

  const InfoRow = ({ icon, label, value }: { icon: string, label: string, value: string | undefined }) => (
    <View style={styles.infoRow}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon as any} size={20} color={colors.primary} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || 'N/A'}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons
            name={user?.role === 'student' ? 'school' : user?.role === 'cafeteria' ? 'restaurant' : 'person'}
            size={60}
            color={colors.white}
          />
        </View>
        <Text style={styles.name}>{user?.firstName} {user?.lastName}</Text>
        <View style={styles.roleContainer}>
          <Ionicons
            name={user?.role === 'student' ? 'school' : user?.role === 'cafeteria' ? 'restaurant' : 'people'}
            size={18}
            color="rgba(255,255,255,0.9)"
          />
          <Text style={styles.role}>
            {user?.role === 'student' ? 'Estudiante' : user?.role === 'parent' ? 'Representante' : 'Cantina'}
          </Text>
        </View>
      </View>

      {user?.role === 'student' && (
        <View style={styles.qrSection}>
          <Text style={styles.qrTitle}>Mi Código QR</Text>
          <View style={styles.qrContainer}>
            <QRCode
              value={user.id}
              size={150}
              color={colors.primary}
              backgroundColor="white"
            />
          </View>
          <Text style={styles.qrDescription}>Muestra este código para realizar pagos o identificarte</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información Personal</Text>
        <View style={styles.card}>
          <InfoRow icon="mail" label="Correo Electrónico" value={user?.email} />
          <InfoRow icon="card" label="ID de Usuario" value={user?.id} />
          {user?.role === 'student' && (
            <>
              <InfoRow icon="school" label="Grado" value="5to Año" />
              <InfoRow icon="people" label="Sección" value="A" />
            </>
          )}
        </View>
      </View>

      {user?.role === 'parent' && child && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del Estudiante</Text>
          <View style={styles.card}>
            <InfoRow icon="person" label="Nombre" value={`${child.firstName} ${child.lastName}`} />
            <InfoRow icon="mail" label="Correo" value={child.email} />
          </View>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Editar Perfil" onPress={() => (navigation as any).navigate('Settings')} style={styles.editButton} textStyle={styles.editButtonText} />
        <Button title="Cerrar Sesión" onPress={handleLogout} style={styles.logoutButton} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    paddingVertical: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.white,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  role: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  qrSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  qrContainer: {
    padding: 20,
    backgroundColor: colors.white,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 12,
  },
  qrDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  editButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  editButtonText: {
    color: colors.primary,
  },
  logoutButton: {
    backgroundColor: colors.danger,
  },
});

export default ProfileScreen;

