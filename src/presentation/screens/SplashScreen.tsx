import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');
const APP_NAME = "La Cantina";
const ICONS: Array<keyof typeof Ionicons.glyphMap> = ['fast-food', 'pizza', 'nutrition', 'cafe', 'ice-cream'];

const SplashScreen = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const iconScaleAnim = useRef(new Animated.Value(1)).current;
    const iconRotateAnim = useRef(new Animated.Value(0)).current;

    const [currentIconIndex, setCurrentIconIndex] = useState(0);

    // Crear valores animados para cada letra
    const letterAnims = useRef(
        APP_NAME.split('').map(() => new Animated.Value(0))
    ).current;

    useEffect(() => {
        // 1. Animación de entrada general
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();

        // 2. Animación de letras (Ola continua)
        const animateLetters = () => {
            const animations = letterAnims.map((anim, index) => {
                return Animated.sequence([
                    Animated.timing(anim, {
                        toValue: -15,
                        duration: 200,
                        useNativeDriver: true,
                        easing: Easing.ease,
                    }),
                    Animated.timing(anim, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                        easing: Easing.bounce,
                    }),
                    Animated.delay(1200),
                ]);
            });

            Animated.loop(
                Animated.stagger(100, animations)
            ).start();
        };

        // 3. Ciclo de iconos con animación de "pop"
        const cycleIcons = () => {
            let index = 0;
            const interval = setInterval(() => {
                // Animar salida (shrink)
                Animated.sequence([
                    Animated.timing(iconScaleAnim, {
                        toValue: 0.01,
                        duration: 200,
                        useNativeDriver: true,
                        easing: Easing.ease,
                    }),
                    Animated.timing(iconRotateAnim, {
                        toValue: 1,
                        duration: 0, // Reset instantáneo
                        useNativeDriver: true,
                    })
                ]).start(() => {
                    // Cambiar icono
                    index = (index + 1) % ICONS.length;
                    setCurrentIconIndex(index);

                    // Animar entrada (pop con rotación)
                    Animated.parallel([
                        Animated.spring(iconScaleAnim, {
                            toValue: 1,
                            friction: 6,
                            tension: 100,
                            useNativeDriver: true,
                        }),
                        Animated.timing(iconRotateAnim, {
                            toValue: 0,
                            duration: 400,
                            useNativeDriver: true,
                        })
                    ]).start();
                });
            }, 1200); // Cambia cada 1.2 segundos

            return () => clearInterval(interval);
        };

        setTimeout(animateLetters, 500);
        const clearIcons = cycleIcons();

        return () => {
            clearIcons();
        };
    }, []);

    const spin = iconRotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg']
    });

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#B8956A', '#A67C52', '#8C6239']}
                style={styles.background}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                {/* Círculo decorativo pulsante */}
                <View style={styles.circleDecoration}>
                    <Animated.View style={[
                        styles.iconWrapper,
                        {
                            transform: [
                                { scale: iconScaleAnim },
                                { rotate: spin }
                            ]
                        }
                    ]}>
                        <Ionicons
                            name={ICONS[currentIconIndex]}
                            size={90}
                            color="#fff"
                        />
                    </Animated.View>
                </View>

                {/* Contenedor de letras animadas */}
                <View style={styles.titleContainer}>
                    {APP_NAME.split('').map((letter, index) => (
                        <Animated.Text
                            key={index}
                            style={[
                                styles.letter,
                                {
                                    transform: [{ translateY: letterAnims[index] }],
                                },
                            ]}
                        >
                            {letter}
                        </Animated.Text>
                    ))}
                </View>

                <Text style={styles.subtitle}>Sabor que conecta</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    circleDecoration: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    iconWrapper: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        height: 60,
        alignItems: 'center',
        marginBottom: 8,
    },
    letter: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 2,
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.9)',
        letterSpacing: 4,
        fontWeight: '300',
        textTransform: 'uppercase',
    },
});

export default SplashScreen;
