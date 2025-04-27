import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Define the menu data interface based on the API response
interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  tags: string[];
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  spicyLevel: number;
  popular: boolean;
  available: boolean;
  createdAt: string;
  id: string;
}

interface MenuCategory {
  _id: string;
  name: string;
  description: string;
  items: MenuItem[];
  order: number;
}

interface AvailabilitySchedule {
  [day: string]: {
    isAvailable: boolean;
  };
}

interface Menu {
  _id: string;
  name: string;
  description: string;
  type: string;
  categories: MenuCategory[];
  venue: string;
  user: string;
  isActive: boolean;
  isDefault: boolean;
  packages: any[];
  availabilitySchedule: AvailabilitySchedule;
  createdAt: string;
  updatedAt: string;
  id: string;
}

interface MenuResponse {
  success: boolean;
  count: number;
  data: Menu[];
}

interface VenueMenuProps {
  venueId: string;
}

const VenueMenu: React.FC<VenueMenuProps> = ({ venueId }) => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/menus?venue=${venueId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data: MenuResponse = await response.json();
        
        if (data.success && data.data.length > 0) {
          // Filter out inactive menus
          const activeMenus = data.data.filter(menu => menu.isActive);
          
          if (activeMenus.length > 0) {
            setMenus(activeMenus);
            // Set default menu as active, or first menu if no default
            const defaultMenu = activeMenus.find(menu => menu.isDefault) || activeMenus[0];
            setActiveMenuId(defaultMenu.id);
          } else {
            setMenus([]);
          }
        } else {
          setMenus([]);
        }
      } catch (err) {
        console.error("Error fetching menus:", err);
        setError("Failed to load menu data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (venueId) {
      fetchMenus();
    }
  }, [venueId]);

  // Get the active menu
  const activeMenu = menus.find(menu => menu.id === activeMenuId);

  // Check if the menu is available today
  const getTodayAvailability = (menu: Menu): boolean => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[new Date().getDay()];
    return menu.availabilitySchedule?.[today]?.isAvailable || false;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (menus.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="restaurant-outline" size={48} color="#d1d5db" />
        <Text style={styles.emptyStateText}>No active menus available for this venue</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Menu Selector */}
      {menus.length > 1 && (
        <View style={styles.menuSelector}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {menus.map((menu) => (
              <TouchableOpacity
                key={menu.id}
                style={[
                  styles.menuTab,
                  activeMenuId === menu.id && styles.activeMenuTab
                ]}
                onPress={() => setActiveMenuId(menu.id)}
              >
                <Text style={[
                  styles.menuTabText,
                  activeMenuId === menu.id && styles.activeMenuTabText
                ]}>
                  {menu.name}
                </Text>
                {getTodayAvailability(menu) ? (
                  <View style={styles.availabilityBadge}>
                    <Text style={styles.availabilityText}>Available Today</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Menu Description */}
      {activeMenu && activeMenu.description && (
        <View style={styles.menuDescription}>
          <Text style={styles.menuDescriptionText}>{activeMenu.description}</Text>
        </View>
      )}

      {/* Menu Categories and Items */}
      {activeMenu && activeMenu.categories.length > 0 ? (
        activeMenu.categories.map((category) => (
          <View key={category._id} style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>{category.name}</Text>
            {category.description ? (
              <Text style={styles.categoryDescription}>{category.description}</Text>
            ) : null}
            
            {category.items.map((item) => (
              <View key={item._id} style={styles.menuItem}>
                {item.image && (
                  <Image 
                    source={{ uri: item.image }} 
                    style={styles.menuItemImage} 
                    resizeMode="cover"
                  />
                )}
                <View style={styles.menuItemHeader}>
                  <View style={styles.menuItemNameContainer}>
                    <Text style={styles.menuItemName}>{item.name}</Text>
                    <View style={styles.menuItemBadges}>
                      {item.isVegetarian && (
                        <View style={[styles.badge, styles.vegBadge]}>
                          <Text style={styles.badgeText}>Veg</Text>
                        </View>
                      )}
                      {item.isVegan && (
                        <View style={[styles.badge, styles.veganBadge]}>
                          <Text style={styles.badgeText}>Vegan</Text>
                        </View>
                      )}
                      {item.isGlutenFree && (
                        <View style={[styles.badge, styles.gfBadge]}>
                          <Text style={styles.badgeText}>GF</Text>
                        </View>
                      )}
                      {item.popular && (
                        <View style={[styles.badge, styles.popularBadge]}>
                          <Text style={styles.badgeText}>Popular</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
                </View>
                
                {item.description && (
                  <Text style={styles.menuItemDescription}>{item.description}</Text>
                )}
                
                {item.spicyLevel > 0 && (
                  <View style={styles.spicyContainer}>
                    <Text style={styles.spicyText}>Spicy: </Text>
                    {[...Array(5)].map((_, i) => (
                      <Ionicons 
                        key={i} 
                        name="flame" 
                        size={14} 
                        color={i < item.spicyLevel ? "#ef4444" : "#e5e7eb"} 
                      />
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="restaurant-outline" size={48} color="#d1d5db" />
          <Text style={styles.emptyStateText}>No menu items available</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  menuItemImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
    color: '#6b7280',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    marginTop: 10,
    color: '#6b7280',
    fontSize: 16,
    textAlign: 'center',
  },
  menuSelector: {
    marginBottom: 16,
  },
  menuTab: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  activeMenuTab: {
    backgroundColor: '#3b82f6',
  },
  menuTabText: {
    fontWeight: '500',
    color: '#4b5563',
  },
  activeMenuTabText: {
    color: '#fff',
  },
  availabilityBadge: {
    backgroundColor: '#10b981',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
  },
  availabilityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  menuDescription: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  menuDescriptionText: {
    color: '#6b7280',
    fontSize: 14,
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'Montserratmedium',
  },
  categoryDescription: {
    color: '#6b7280',
    fontSize: 14,
    marginBottom: 12,
    fontFamily: 'Outfitlight',
  },
  menuItem: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  menuItemNameContainer: {
    flex: 1,
    marginRight: 8,
  },
  menuItemName: {
    fontWeight: '500',
    marginBottom: 4,
    fontFamily: 'Outfitlight',
  },
  menuItemPrice: {
    fontWeight: '600',
    fontSize: 16,
    color: '#3b82f6',
  },
  menuItemDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    marginBottom: 8,
  },
  menuItemBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  badge: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 4,
  },
  vegBadge: {
    backgroundColor: '#10b981',
  },
  veganBadge: {
    backgroundColor: '#047857',
  },
  gfBadge: {
    backgroundColor: '#8b5cf6',
  },
  popularBadge: {
    backgroundColor: '#f59e0b',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  spicyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  spicyText: {
    fontSize: 12,
    color: '#6b7280',
    marginRight: 4,
  },
});

export default VenueMenu;