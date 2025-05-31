import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  LayoutChangeEvent,
} from 'react-native';

const { width } = Dimensions.get('window');

interface Tab {
  key: string;
  title: string;
}

interface StickyTabsProps {
  tabs: Tab[];
  scrollY: Animated.Value;
  headerHeight: number;
  initialTab?: string;
  tabBarTopOffset?: number;
  onTabChange?: (tabKey: string) => void;
  children: (activeTab: string) => React.ReactNode;
}

const StickyTabs = ({
  tabs,
  scrollY,
  headerHeight,
  initialTab,
  tabBarTopOffset = 0,
  onTabChange,
  children,
}: StickyTabsProps) => {
  const [activeTab, setActiveTab] = useState(initialTab || tabs[0].key);
  const [tabBarHeight, setTabBarHeight] = useState(48);
  const [tabWidths, setTabWidths] = useState<{ [key: string]: number }>({});
  const [tabPositions, setTabPositions] = useState<{ [key: string]: number }>({});
  const [contentHeight, setContentHeight] = useState(500);
  const tabContainerRef = useRef<View>(null);
  const tabScrollViewRef = useRef<ScrollView>(null);
  const indicatorAnimation = useRef(new Animated.Value(0)).current;

  // Track the scrollY for tab bar stickiness
  const tabBarTranslateY = scrollY.interpolate({
    inputRange: [0, headerHeight - tabBarTopOffset],
    outputRange: [headerHeight, tabBarTopOffset],
    extrapolate: 'clamp',
  });

  const tabBarOpacity = scrollY.interpolate({
    inputRange: [
      headerHeight - tabBarTopOffset - 50,
      headerHeight - tabBarTopOffset
    ],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const tabBarShadowOpacity = scrollY.interpolate({
    inputRange: [
      headerHeight - tabBarTopOffset - 30,
      headerHeight - tabBarTopOffset
    ],
    outputRange: [0, 0.1],
    extrapolate: 'clamp',
  });

  // Animated indicator properties
  useEffect(() => {
    if (tabPositions[activeTab] !== undefined) {
      Animated.spring(indicatorAnimation, {
        toValue: tabPositions[activeTab],
        useNativeDriver: true,
        tension: 80,
        friction: 8,
      }).start();
    }
  }, [activeTab, tabPositions]);

  const handleTabPress = (tab: Tab) => {
    setActiveTab(tab.key);
    
    // Scroll the tab into view if necessary
    if (tabScrollViewRef.current && tabPositions[tab.key] !== undefined) {
      tabScrollViewRef.current.scrollTo({
        x: Math.max(0, tabPositions[tab.key] - width / 4),
        animated: true,
      });
    }

    // Notify parent about tab change
    if (onTabChange) {
      onTabChange(tab.key);
    }
  };

  const handleTabLayout = (tab: Tab, event: LayoutChangeEvent) => {
    const { width, x } = event.nativeEvent.layout;
    
    setTabWidths(prev => ({
      ...prev,
      [tab.key]: width,
    }));
    
    setTabPositions(prev => ({
      ...prev,
      [tab.key]: x,
    }));
  };

  const handleContentLayout = (event: LayoutChangeEvent) => {
    setContentHeight(event.nativeEvent.layout.height);
  };

  const renderTab = (tab: Tab, index: number) => {
    const isActive = activeTab === tab.key;
    
    return (
      <TouchableOpacity
        key={tab.key}
        onPress={() => handleTabPress(tab)}
        onLayout={(e) => handleTabLayout(tab, e)}
        style={styles.tab}
        activeOpacity={0.7}
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
  };

  const indicatorTranslateX = indicatorAnimation;
  const indicatorWidth = tabWidths[activeTab] || 0;

  return (
    <View style={styles.container}>
      {/* Sticky Tab Bar */}
      <Animated.View
        style={[
          styles.tabBarContainer,
          {
            transform: [{ translateY: tabBarTranslateY }],
          },
        ]}
      >
        <Animated.View
          ref={tabContainerRef}
          style={[
            styles.tabBarBackground,
            {
              shadowOpacity: tabBarShadowOpacity,
              opacity: tabBarOpacity,
            },
          ]}
        />
        
        <ScrollView
          ref={tabScrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBar}
        >
          {tabs.map(renderTab)}
          
          {/* Animated indicator */}
          <Animated.View
            style={[
              styles.indicator,
              {
                width: indicatorWidth,
                transform: [{ translateX: indicatorTranslateX }],
              },
            ]}
          />
        </ScrollView>
      </Animated.View>
      
      {/* Tab Content */}
      <View
        style={styles.contentContainer}
        onLayout={handleContentLayout}
      >
        {children(activeTab)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
    height: 48,
  },
  tabBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  tabBar: {
    height: 48,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  tab: {
    marginRight: 24,
    height: 48,
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#71717a',
  },
  activeTabText: {
    fontWeight: '600',
    color: '#3b82f6',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    backgroundColor: '#3b82f6',
    borderRadius: 3,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 48, // Add padding equal to tab bar height so content is properly positioned
  },
});

export default StickyTabs;
