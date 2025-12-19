import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TextStyle, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { colors } from '../theme/colors';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({ title, loading, style, textStyle, disabled, ...props }) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled, style]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  disabled: {
    backgroundColor: colors.gray,
    shadowOpacity: 0,
    elevation: 0,
  },
  text: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default Button;
