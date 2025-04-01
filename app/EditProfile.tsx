import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';

// Replace with direct environment variable references with fallbacks
const CLOUDINARY_CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your_cloud_name';
const CLOUDINARY_API_KEY = process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY || 'your_api_key';
const CLOUDINARY_UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'venue_finder_profiles';

// Cloudinary upload preset and cloud name
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { user, updateProfile, loading } = useAuth();
  
  // State for form fields
  const [name, setName] = useState(user?.fullName || '');
  const [location, setLocation] = useState(user?.location || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phoneNumber || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || 'https://i.pravatar.cc/300?img=32');
  
  // Additional loading state for image upload
  const [isUploading, setIsUploading] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);

  // Update state if user data changes
  useEffect(() => {
    if (user) {
      setName(user.fullName || '');
      setLocation(user.location || '');
      setEmail(user.email || '');
      setPhone(user.phoneNumber || '');
      setBio(user.bio || '');
      setProfileImage(user.profileImage || 'https://i.pravatar.cc/300?img=32');
    }
  }, [user]);
  
  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'You need to grant access to your photos to change your profile image.');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
      setImageChanged(true);
    }
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (imageUri: string): Promise<string | null> => {
    try {
      setIsUploading(true);
      
      // Create form data for the upload
      const formData = new FormData();
      
      // Extract file name and type
      const uriParts = imageUri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      // @ts-ignore - React Native's FormData implementation allows this format
      formData.append('file', {
        uri: imageUri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });
      
      // Add API key and upload preset
      formData.append('api_key', CLOUDINARY_API_KEY);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      
      console.log('Uploading to Cloudinary:', {
        cloudName: CLOUDINARY_CLOUD_NAME,
        apiKey: CLOUDINARY_API_KEY ? '***' : 'missing',
        uploadPreset: CLOUDINARY_UPLOAD_PRESET
      });
      
      // Upload to Cloudinary
      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        return data.secure_url;
      } else {
        console.error('Cloudinary error:', data);
        throw new Error(data.error?.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', 'Failed to upload profile image. Please try again.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    
    // Prepare profile data
    const profileData: any = {
      fullName: name,
      location,
      phoneNumber: phone,
      bio,
    };
    
    // Upload image if it was changed
    if (imageChanged) {
      const imageUrl = await uploadImageToCloudinary(profileImage);
      if (imageUrl) {
        profileData.profileImage = imageUrl;
      } else {
        // If upload failed but user wants to continue
        const continueWithoutImage = await new Promise((resolve) => {
          Alert.alert(
            'Image Upload Failed',
            'Do you want to continue updating your profile without the new image?',
            [
              { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
              { text: 'Continue', onPress: () => resolve(true) },
            ]
          );
        });
        
        if (!continueWithoutImage) {
          return;
        }
      }
    }
    
    // Update profile
    const success = await updateProfile(profileData);
    if (success) {
      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    }
  };
  
  // Determine if save button should be disabled
  const isSaveDisabled = loading || isUploading || !name.trim();
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity 
          style={[styles.saveButton, isSaveDisabled && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSaveDisabled}
        >
          {loading || isUploading ? (
            <ActivityIndicator size="small" color="#3b82f6" />
          ) : (
            <Text style={styles.saveText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.content}>
          {/* Profile Picture */}
          <View style={styles.photoSection}>
            <View style={styles.profileImageContainer}>
              <Image 
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
              {isUploading && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator size="large" color="white" />
                </View>
              )}
            </View>
            <TouchableOpacity 
              style={styles.changePhotoButton}
              onPress={handlePickImage}
              disabled={isUploading}
            >
              <Text style={styles.changePhotoText}>
                {isUploading ? 'Uploading...' : 'Change Photo'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Form Fields */}
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Your full name"
                placeholderTextColor="#9ca3af"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="City, State"
                placeholderTextColor="#9ca3af"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={[styles.input, { opacity: 0.7 }]}
                value={email}
                placeholder="Email address"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={false}
              />
              <Text style={styles.helperText}>Email cannot be changed</Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Phone number"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                style={[styles.input, styles.bioInput]}
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
          
          {/* Privacy Settings Section */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Privacy Settings</Text>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Change Password</Text>
                <Text style={styles.settingDescription}>Update your password regularly for security</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Privacy Policy</Text>
                <Text style={styles.settingDescription}>Read our privacy policy</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Outfitsemibold',
    color: '#1f2937',
  },
  saveButton: {
    padding: 4,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveText: {
    fontSize: 16,
    fontFamily: 'Outfitsemibold',
    color: '#3b82f6',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  photoSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  profileImageContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#f3f4f6',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  changePhotoText: {
    fontSize: 14,
    fontFamily: 'Outfitmedium',
    color: '#3b82f6',
  },
  formSection: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Outfitmedium',
    color: '#4b5563',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 16,
    fontFamily: 'Outfitmedium',
    color: '#1f2937',
  },
  bioInput: {
    minHeight: 100,
    paddingTop: 12,
  },
  settingsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Outfitsemibold',
    color: '#1f2937',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Outfitmedium',
    color: '#1f2937',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Outfitmedium',
    color: '#9ca3af',
  },
  helperText: {
    fontSize: 12,
    fontFamily: 'Outfitmedium',
    color: '#9ca3af',
    marginTop: 4,
  },
}); 