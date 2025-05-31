/**
 * VenueFinder Design System
 * A comprehensive collection of colors, spacing, and UI constants to ensure
 * consistent design across the entire application.
 * Updated based on analysis of actual app screenshots
 */

// Primary brand colors
const primaryLight = '#6B46C1'; // Purple from the screenshots (accent color)
const primaryDark = '#8B5CF6'; // Purple accent in dark mode

// Status colors - consistent across themes
const success = '#4CAF50';  // Green (like the 4.3 rating badge)
const error = '#ef4444';    // Red (for errors, delete actions)
const warning = '#ff9800';   // Orange (for warnings)
const info = '#2196f3';      // Blue (for information)

/**
 * Border radius constants to maintain consistent rounded corners
 * throughout the application
 */
export const BorderRadius = {
  xs: 4,        // For tiny elements
  small: 8,      // For smaller elements like chips, tags
  medium: 12,    // For cards, buttons (seen in rating badges)
  large: 16,     // For modal sheets, large cards
  xl: 20,       // For prominent UI elements
  full: 9999,    // For circular elements (profile pics, circular buttons)
};

/**
 * Spacing constants to maintain consistent spacing throughout the app
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

/**
 * Shadow styles for elements that need elevation
 */
export const Shadows = {
  light: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
  dark: {
    // In dark mode, shadows are more subtle with higher contrast
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 1.5,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 3.0,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.5,
      shadowRadius: 6.0,
      elevation: 10,
    },
  }
};

/**
 * Main color system for the application based on screenshot analysis
 */
export const Colors = {
  // Status colors that are the same across themes
  status: {
    success: '#4CAF50',    // Green rating badges (4.3★)
    error: '#ef4444',      // Red for critical actions
    warning: '#ff9800',    // Orange for warnings
    info: '#2196f3',       // Blue for information
    
    // Special offer colors
    offer: '#8B5CF6',      // Purple for offers
    offerBackground: 'rgba(139, 92, 246, 0.1)', // Light purple background
  },
  
  // Light theme colors (from screenshots 1, 3, 4)
  light: {
    // Core colors
    primary: primaryLight,
    text: '#1F2937',         // Main text color (dark gray)
    textSecondary: '#4B5563', // Secondary text (lighter gray)
    textLight: '#6B7280',     // Lightest text (menu items, descriptions)
    background: '#FFFFFF',    // Pure white background
    
    // UI Elements
    card: '#FFFFFF',          // Card background (white)
    cardAlt: '#F9FAFB',       // Alternate card background (very light gray)
    surface: '#F3F4F6',       // Light gray surface (search bars, etc)
    divider: '#E5E7EB',       // Light gray divider lines
    border: '#D1D5DB',        // Border color
    
    // Buttons and interactive elements
    button: primaryLight,     // Primary button color
    buttonSecondary: '#F3F4F6', // Secondary button background
    buttonText: '#FFFFFF',    // Button text color (white)
    buttonTextSecondary: '#1F2937', // Secondary button text
    buttonDisabled: '#E5E7EB', // Disabled button
    buttonTextDisabled: '#9CA3AF', // Disabled button text
    
    // Icons
    icon: '#6B7280',          // Icon color
    iconActive: primaryLight,  // Active icon color
    
    // Tab navigation
    tabBackground: '#FFFFFF',  // Tab bar background
    tabDivider: '#E5E7EB',     // Tab divider
    tabIconDefault: '#6B7280',  // Inactive tab color
    tabIconSelected: primaryLight, // Selected tab color
    tabIndicator: primaryLight, // Tab indicator line
    
    // Rating badges
    ratingBadge: '#4CAF50',     // Green rating badge
    ratingText: '#FFFFFF',      // White text in rating badge
    
    // Status indicators
    statusOpen: '#4CAF50',      // Green for "Open" status
    statusClosed: '#EF4444',    // Red for "Closed" status
    
    // Old properties kept for backward compatibility
    tint: primaryLight,
  },
  
  // Dark theme colors (from screenshots 2, 5, 6, 7, 8)
  dark: {
    // Core colors
    primary: primaryDark,
    text: '#FFFFFF',           // Main text color (pure white)
    textSecondary: '#E5E7EB',   // Secondary text (light gray)
    textLight: '#9BA1A6',       // Lightest text (descriptions)
    background: '#000000',      // True black background as seen in screenshots
    
    // UI Elements
    card: '#121212',           // Card background (very dark gray)
    cardAlt: '#1E1E2D',         // Alternate card background (slightly lighter)
    surface: '#1A1A1A',         // Surface color (search bars, menu items)
    divider: '#333333',         // Divider lines
    border: '#333333',          // Border color
    
    // Buttons and interactive elements
    button: '#1E1E2D',          // Button background (dark mode)
    buttonSecondary: '#262626',  // Secondary button
    buttonText: '#FFFFFF',      // Button text (white)
    buttonTextSecondary: '#FFFFFF', // Secondary button text
    buttonDisabled: '#333333',   // Disabled button
    buttonTextDisabled: '#666666', // Disabled button text
    
    // Special elements
    highlight: '#292B36',        // Highlighted areas in dark mode
    highlightAlt: '#332F39',     // Alternate highlight color
    
    // Icons
    icon: '#9BA1A6',            // Icon color
    iconActive: '#FFFFFF',       // Active icon color
    
    // Tab navigation
    tabBackground: '#000000',    // Tab bar background
    tabDivider: '#333333',       // Tab divider
    tabIconDefault: '#9BA1A6',    // Inactive tab color
    tabIconSelected: '#FFFFFF',   // Selected tab color
    tabIndicator: primaryDark,    // Tab indicator line
    
    // Rating badges
    ratingBadge: '#4CAF50',       // Green rating badge
    ratingText: '#FFFFFF',        // White text in rating badge
    
    // Status indicators
    statusOpen: '#4CAF50',        // Green for "Open" status
    statusClosed: '#EF4444',      // Red for "Closed" status
    
    // Old properties kept for backward compatibility
    tint: primaryDark,
  },
};