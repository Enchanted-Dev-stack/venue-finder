import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions, Pressable, Animated } from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';

interface OperatingHoursSheetProps {
  isVisible: boolean;
  onClose: () => void;
  hours: {
    day: string;
    hours: string;
  }[];
  activeDay?: string; // Optional to highlight today
}

const OperatingHoursSheet = ({ isVisible, onClose, hours, activeDay }: OperatingHoursSheetProps) => {
  const { currentTheme } = useTheme();
  const colors = Colors[currentTheme];
  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const itemAnimations = useRef(hours.map(() => new Animated.Value(0))).current;
  
  useEffect(() => {
    if (isVisible) {
      // Reset animations when opening
      slideAnim.setValue(0);
      fadeAnim.setValue(0);
      itemAnimations.forEach(anim => anim.setValue(0));
      
      // Start sheet slide-in animation
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Start overlay fade-in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Staggered animations for list items
      Animated.stagger(
        50,
        itemAnimations.map(anim => 
          Animated.timing(anim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          })
        )
      ).start();
    }
  }, [isVisible]);
  
  const handleClose = () => {
    // Animate out before closing
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };
  
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={handleClose}
      animationType="none"
    >
      <Animated.View 
        style={[
          styles.modalOverlay,
          { opacity: fadeAnim }
        ]}
      >
        <Pressable style={styles.dismissArea} onPress={handleClose} />
        <Animated.View 
          style={[
            styles.bottomSheet,
            {
              backgroundColor: currentTheme === 'dark' ? '#1e1e1e' : '#ffffff',
              transform: [{
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [300, 0]
                })
              }]
            }
          ]}
        >
          <View style={[styles.header, { borderBottomColor: currentTheme === 'dark' ? '#333' : '#e0e0e0' }]}>
            <Text style={[styles.title, { color: colors.text }]}>Opening hours</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {hours.map((item, index) => (
            <Animated.View 
              key={index} 
              style={[
                styles.hoursRow, 
                {
                  borderBottomColor: currentTheme === 'dark' ? '#333' : '#e0e0e0',
                  backgroundColor: activeDay === item.day ? 
                    (currentTheme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)') : 
                    'transparent',
                  opacity: itemAnimations[index],
                  transform: [{
                    translateY: itemAnimations[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0]
                    })
                  }]
                }
              ]}
            >
              <View style={styles.dayContainer}>
                <Text style={[styles.dayText, { color: colors.text }]}>{item.day}</Text>
                {activeDay === item.day && (
                  <Text style={[styles.todayTag, { backgroundColor: colors.tint }]}>Today</Text>
                )}
              </View>
              <Text style={[styles.hoursText, { color: currentTheme === 'dark' ? '#e0e0e0' : '#687076' }]}>{item.hours}</Text>
            </Animated.View>
          ))}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  dismissArea: {
    flex: 1,
  },
  bottomSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    maxHeight: height * 0.7,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Outfitregular',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  activeDay: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  dayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 14,
    color: '#fff',
    marginRight: 8,
    fontFamily: 'Ralewayregular',
  },
  todayTag: {
    fontSize: 12,
    color: '#fff',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontFamily: 'Ralewayregular',
  },
  hoursText: {
    fontSize: 13,
    color: '#e0e0e0',
    fontFamily: 'Ralewayregular',
  },
});

export default OperatingHoursSheet;
