import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthRepositoryImpl } from '../../../data/repositories/AuthRepositoryImpl';
import { LoginUseCase } from '../../../domain/usecases/LoginUseCase';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuthStore } from '../../state/authStore';
import { colors } from '../../theme/colors';

const { width, height } = Dimensions.get('window');

// Iconos de fondo para la animación (Menos cantidad, mejor distribuidos)
// Usamos nombres de MaterialCommunityIcons para mayor variedad (empanadas/arepas)
const BACKGROUND_ICONS = [
    { name: 'pizza', size: 45, left: '8%', top: '12%' },           // Arriba Izquierda
    { name: 'coffee', size: 35, left: '85%', top: '15%' },         // Arriba Derecha
    { name: 'taco', size: 40, left: '5%', top: '45%' },            // Medio Izquierda (Empanada)
    { name: 'circle-slice-8', size: 38, left: '90%', top: '50%' }, // Medio Derecha (Arepa)
    { name: 'hamburger', size: 42, left: '15%', top: '85%' },      // Abajo Izquierda
    { name: 'ice-cream', size: 35, left: '80%', top: '88%' },      // Abajo Derecha
    { name: 'cup-water', size: 28, left: '45%', top: '5%' },       // Arriba Centro
    { name: 'fruit-watermelon', size: 30, left: '50%', top: '95%' } // Abajo Centro
];

const LoginScreen = () => {
    const navigation = useNavigation();
    const { login } = useAuthStore();
    const [email, setEmail] = useState('aplicacio@gmail.com');
    const [password, setPassword] = useState('12345');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Animaciones
    // Inicializamos en 1 y 0 para que NO haya animación de entrada y se vea instantáneo
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;

    // Animación flotante para los iconos de fondo
    const floatAnims = useRef(BACKGROUND_ICONS.map(() => new Animated.Value(0))).current;

    useEffect(() => {
        // Animación continua de los iconos de fondo
        const animations = floatAnims.map((anim, index) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: 4000 + (index * 500), // Más lento y suave
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                    }),
                    Animated.timing(anim, {
                        toValue: 0,
                        duration: 4000 + (index * 500),
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                    }),
                ])
            );
        });

        Animated.parallel(animations).start();
    }, []);

    const handleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const authRepository = new AuthRepositoryImpl();
            const loginUseCase = new LoginUseCase(authRepository);
            const user = await loginUseCase.execute(email, password);
            login(user);
        } catch (e) {
            setError('Error al iniciar sesión. Por favor verifica tus credenciales.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <LinearGradient
                colors={['#B8956A', '#A67C52', '#8C6239']}
                style={styles.background}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            {/* Iconos de fondo animados */}
            <View style={StyleSheet.absoluteFill}>
                {BACKGROUND_ICONS.map((icon, index) => (
                    <Animated.View
                        key={index}
                        style={[
                            styles.floatingIcon,
                            {
                                left: icon.left as any,
                                top: icon.top as any,
                                transform: [
                                    {
                                        translateY: floatAnims[index].interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, -25], // Flotar un poco más
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        <MaterialCommunityIcons name={icon.name as any} size={icon.size} color="rgba(255,255,255,0.15)" />
                    </Animated.View>
                ))}
            </View>

            <Animated.View
                style={[
                    styles.contentContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    }
                ]}
            >
                <View style={styles.card}>
                    <View style={styles.headerContainer}>
                        <View style={styles.logoContainer}>
                            <LinearGradient
                                colors={['#ED9B40', '#E8872E']}
                                style={styles.logoGradient}
                            >
                                <Ionicons name="restaurant" size={32} color="#fff" />
                            </LinearGradient>
                        </View>
                        <Text style={styles.title}>¡Bienvenido!</Text>
                        <Text style={styles.subtitle}>Tu comida favorita te espera</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <Input
                            label="Correo electrónico"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="correo@ejemplo.com"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            icon="person-outline"
                        />
                        <Input
                            label="Contraseña"
                            value={password}
                            onChangeText={setPassword}
                            placeholder="••••••••"
                            secureTextEntry
                            icon="lock-closed-outline"
                        />

                        {error ? (
                            <View style={styles.errorContainer}>
                                <Ionicons name="alert-circle" size={20} color={colors.danger} />
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        <View style={styles.buttonContainer}>
                            <Button title="Iniciar sesión" onPress={handleLogin} loading={loading} />
                        </View>

                        <TouchableOpacity
                            style={styles.linkContainer}
                            onPress={() => (navigation as any).navigate('Register')}
                        >
                            <Text style={styles.linkText}>
                                ¿No tienes una cuenta? <Text style={styles.linkHighlight}>Regístrate</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    floatingIcon: {
        position: 'absolute',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 30,
        padding: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoContainer: {
        marginBottom: 16,
        shadowColor: '#ED9B40',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    logoGradient: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2D3436',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    formContainer: {
        width: '100%',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFE5E5',
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
    },
    errorText: {
        color: colors.danger,
        marginLeft: 8,
        flex: 1,
        fontSize: 14,
    },
    buttonContainer: {
        marginTop: 8,
        marginBottom: 24,
    },
    linkContainer: {
        alignItems: 'center',
    },
    linkText: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    linkHighlight: {
        color: colors.primary,
        fontWeight: 'bold',
    },
});

export default LoginScreen;
