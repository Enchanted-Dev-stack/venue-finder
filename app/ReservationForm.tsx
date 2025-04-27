"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Platform } from "react-native"
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Ionicons } from "@expo/vector-icons"
// We'll use the Platform-specific DateTimePicker instead of the community one
import { StatusBar } from 'expo-status-bar'

// Define the app's navigation structure for TypeScript
type RootStackParamList = {
  Home: undefined;
  VenueDetail: { id: string };
  VenuePackages: { venueId: string; venueName: string };
  ReservationForm: { 
    venueId: string;
    venueName: string;
    packageId: string;
    packageName: string;
    packagePrice: number;
    packagePriceType: string;
  };
};

// Type for navigation prop
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ReservationFormScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'ReservationForm'>>();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [guests, setGuests] = useState('1');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  
  // Date/time picker visibility
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const { venueId, venueName, packageId, packageName, packagePrice, packagePriceType } = route.params;

  const handleSubmit = async () => {
    // Validate form
    if (!name || !email || !phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Combine date and time
      const reservationDateTime = new Date(date);
      const hours = time.getHours();
      const minutes = time.getMinutes();
      reservationDateTime.setHours(hours, minutes);

      // API request to book reservation
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          venueId,
          packageId,
          date: reservationDateTime.toISOString(),
          numberOfGuests: parseInt(guests),
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          specialRequests,
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert(
          'Reservation Successful', 
          'Your reservation has been submitted successfully!',
          [
            { 
              text: 'OK', 
              onPress: () => navigation.navigate('Home')
            }
          ]
        );
      } else {
        throw new Error(data.message || 'Failed to submit reservation');
      }
    } catch (error) {
      console.error('Reservation submission error:', error);
      Alert.alert('Error', 'Failed to submit reservation. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Simplified DateTimePicker implementation for now
  // In a real implementation, you would use platform-specific date pickers
  // or install @react-native-community/datetimepicker
  
  // Handle date change
  const onDateChange = (selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  // Handle time change
  const onTimeChange = (selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  // For demo purposes, we'll show a simple date selector
  // In a real app, you would implement proper DateTimePicker based on platform
  const showDatePickerModal = () => {
    setShowDatePicker(true);
    // This is simplified for the demo
    // In a real app you would show a proper date picker
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };

  const showTimePickerModal = () => {
    setShowTimePicker(true);
    // This is simplified for the demo
    // In a real app you would show a proper time picker
    const newTime = new Date(time);
    newTime.setHours(newTime.getHours() + 1);
    onTimeChange(newTime);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Reservation</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.venueInfo}>
          <Text style={styles.venueName}>{venueName}</Text>
          <Text style={styles.subtitle}>Complete your reservation for the {packageName} package</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reservation Details</Text>
          
          <View style={styles.formField}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity 
              style={styles.dateButton} 
              onPress={showDatePickerModal}
            >
              <Text style={styles.dateButtonText}>{formatDate(date)}</Text>
              <Ionicons name="calendar" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          <View style={styles.formField}>
            <Text style={styles.label}>Time</Text>
            <TouchableOpacity 
              style={styles.dateButton} 
              onPress={showTimePickerModal}
            >
              <Text style={styles.dateButtonText}>{formatTime(time)}</Text>
              <Ionicons name="time" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          <View style={styles.formField}>
            <Text style={styles.label}>Number of Guests</Text>
            <TextInput
              style={styles.input}
              value={guests}
              onChangeText={setGuests}
              keyboardType="number-pad"
              placeholder="1"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Information</Text>
          
          <View style={styles.formField}>
            <Text style={styles.label}>Full Name <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
            />
          </View>

          <View style={styles.formField}>
            <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.formField}>
            <Text style={styles.label}>Phone Number <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.formField}>
            <Text style={styles.label}>Special Requests</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={specialRequests}
              onChangeText={setSpecialRequests}
              placeholder="Any special requests or notes?"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Package</Text>
            <Text style={styles.summaryValue}>{packageName}</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Price</Text>
            <Text style={styles.summaryValue}>
              ${packagePrice}
              <Text style={styles.priceType}>
                {packagePriceType === 'fixed' ? '' : 
                 packagePriceType === 'starting' ? ' starting price' : 
                 ' per person'}
              </Text>
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Date & Time</Text>
            <Text style={styles.summaryValue}>{formatDate(date)}, {formatTime(time)}</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Guests</Text>
            <Text style={styles.summaryValue}>{guests}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Complete Reservation</Text>
            )}
          </TouchableOpacity>
          
          <Text style={styles.disclaimer}>
            By completing this reservation, you agree to the venue's terms and conditions.
            You will receive a confirmation email once your reservation is approved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "#1e2b3c",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  venueInfo: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  venueName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  formField: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
    fontWeight: '500',
  },
  required: {
    color: '#ef4444',
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#1e293b',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  priceType: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '400',
  },
  buttonContainer: {
    padding: 16,
    marginTop: 16,
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  disclaimer: {
    textAlign: 'center',
    fontSize: 12,
    color: '#64748b',
    marginTop: 16,
  },
});
