import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface TabItem {
  key: string;
  title: string;
}

interface TabContainerProps {
  tabs: TabItem[];
  initialTabKey?: string;
  scrollY: Animated.Value;
  headerHeight: number;
  renderContent: (activeTabKey: string) => React.ReactNode;
}

const TabContainer: React.FC<TabContainerProps> = ({
  tabs,
  initialTabKey,
  scrollY,
  headerHeight,
  renderContent,
}) => {
  const [activeTab, setActiveTab] = useState(initialTabKey || tabs[0].key);
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const tabBarHeight = 48;
  const tabPositionsRef = useRef<{ [key: string]: number }>({});
  const indicatorPosition = useRef(new Animated.Value(0)).current;
  const tabWidthsRef = useRef<{ [key: string]: number }>({});

  // Create animated values for the tab bar
  const tabBarPositionY = scrollY.interpolate({
    inputRange: [0, headerHeight - tabBarHeight],
    outputRange: [headerHeight, insets.top],
    extrapolate: 'clamp',
  });

  const tabBarBackground = scrollY.interpolate({
    inputRange: [headerHeight - 100, headerHeight - 40],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleTabPress = (tab: TabItem) => {
    setActiveTab(tab.key);
    
    // Animate the indicator
    const position = tabPositionsRef.current[tab.key] || 0;
    Animated.spring(indicatorPosition, {
      toValue: position,
      useNativeDriver: true,
      tension: 80,
      friction: 8,
    }).start();
  };

  const handleTabLayout = (key: string, x: number, width: number) => {
    // Store tab position and width
    tabPositionsRef.current[key] = x;
    tabWidthsRef.current[key] = width;
    
    // Initialize indicator position if it's the active tab
    if (key === activeTab) {
      indicatorPosition.setValue(x);
    }
  };

  // Update indicator position when active tab changes
  useEffect(() => {
    const position = tabPositionsRef.current[activeTab] || 0;
    Animated.spring(indicatorPosition, {
      toValue: position,
      useNativeDriver: true,
      tension: 80,
      friction: 8,
    }).start();
  }, [activeTab]);

  return (
    <View style={styles.container}>
      {/* Sticky Tab Bar */}
      <Animated.View
        style={[
          styles.tabBarWrapper,
          {
            transform: [{ translateY: tabBarPositionY }],
          },
        ]}
      >
        <Animated.View 
          style={[
            styles.tabBarBackground,
            { opacity: tabBarBackground }
          ]} 
        />
        <View style={styles.tabBar}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabScrollContent}
          >
            {tabs.map((tab) => {
              const isActive = tab.key === activeTab;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={styles.tab}
                  onPress={() => handleTabPress(tab)}
                  onLayout={(e) => {
                    const { x, width } = e.nativeEvent.layout;
                    handleTabLayout(tab.key, x, width);
                  }}
                >
                  <Text
                    style={[
                      styles.tabText,
                      isActive && styles.activeTabText,
                    ]}
                  >
                    {tab.title}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {/* Tab Indicator */}
            <Animated.View
              style={[
                styles.tabIndicator,
                {
                  width: tabWidthsRef.current[activeTab] || 0,
                  transform: [{ translateX: indicatorPosition }],
                },
              ]}
            />
          </ScrollView>
        </View>
      </Animated.View>

      {/* Content Section */}
      <View style={[styles.contentContainer, { marginTop: headerHeight }]}>
        {renderContent(activeTab)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBarWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: 48,
  },
  tabBarBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tabBar: {
    height: 48,
    flexDirection: 'row',
  },
  tabScrollContent: {
    paddingHorizontal: 16,
    height: 48,
  },
  tab: {
    paddingHorizontal: 16,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#71717a',
  },
  activeTabText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    backgroundColor: '#3b82f6',
    borderRadius: 3,
  },
  contentContainer: {
    flex: 1,
  },
});

export default TabContainer;
