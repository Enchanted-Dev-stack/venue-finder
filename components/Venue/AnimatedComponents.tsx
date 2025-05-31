import React, { useRef } from 'react';
import { 
  View, 
  TouchableOpacity, 
  Animated, 
  StyleSheet,
  ViewStyle,
  StyleProp,
  TextStyle,
  Text
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AnimatedIconButtonProps {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
  activeOpacity?: number;
}

export const AnimatedIconButton = ({ 
  name, 
  size = 24, 
  color = '#fff', 
  style, 
  onPress,
  activeOpacity = 0.8
}: AnimatedIconButtonProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={activeOpacity}
      style={style}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Ionicons name={name as any} size={size} color={color} />
      </Animated.View>
    </TouchableOpacity>
  );
};

interface AnimatedCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export const AnimatedCard = ({ children, style, onPress }: AnimatedCardProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!onPress) return;
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4
    }).start();
  };

  const handlePressOut = () => {
    if (!onPress) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4
    }).start();
  };

  const Card = () => (
    <Animated.View 
      style={[
        styles.card, 
        { transform: [{ scale: scaleAnim }] },
        style
      ]}
    >
      {children}
    </Animated.View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <Card />
      </TouchableOpacity>
    );
  }

  return <Card />;
};

interface AnimatedButtonProps {
  title: string;
  icon?: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconColor?: string;
  iconSize?: number;
  primary?: boolean;
}

export const AnimatedButton = ({
  title,
  icon,
  onPress,
  style,
  textStyle,
  iconColor,
  iconSize = 20,
  primary = true
}: AnimatedButtonProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      <Animated.View
        style={[
          styles.button,
          primary ? styles.primaryButton : styles.secondaryButton,
          { transform: [{ scale: scaleAnim }] },
          style
        ]}
      >
        {icon && (
          <Ionicons
            name={icon as any}
            size={iconSize}
            color={iconColor || (primary ? '#fff' : '#3b82f6')}
            style={styles.buttonIcon}
          />
        )}
        <Text
          style={[
            styles.buttonText,
            primary ? styles.primaryButtonText : styles.secondaryButtonText,
            textStyle
          ]}
        >
          {title}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
  },
  secondaryButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: '#fff',
  },
  secondaryButtonText: {
    color: '#3b82f6',
  },
  buttonIcon: {
    marginRight: 8,
  },
});
