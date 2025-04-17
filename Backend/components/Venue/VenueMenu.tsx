import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

// Menu types
type MenuItem = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  spicyLevel?: number;
  popular?: boolean;
  available?: boolean;
  tags?: string[];
};

type MenuCategory = {
  _id: string;
  name: string;
  description: string;
  items: MenuItem[];
  order?: number;
};

type Menu = {
  _id: string;
  name: string;
  description: string;
  type: string;
  categories: MenuCategory[];
  venue: string;
  isActive: boolean;
  isDefault: boolean;
  availabilitySchedule: {
    monday: { isAvailable: boolean };
    tuesday: { isAvailable: boolean };
    wednesday: { isAvailable: boolean };
    thursday: { isAvailable: boolean };
    friday: { isAvailable: boolean };
    saturday: { isAvailable: boolean };
    sunday: { isAvailable: boolean };
  };
};

interface MenuResponse {
  success: boolean;
  count: number;
  data: Menu[];
}

interface VenueMenuProps {
  venueId: string;
}

const { width } = Dimensions.get('window');

const VenueMenu: React.FC<VenueMenuProps> = ({ venueId }) => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);
        const response = await axios.get<MenuResponse>(
          `${process.env.EXPO_PUBLIC_API_URL}/menus/venue/${venueId}`
        );
        
        if (response.data.success) {
          setMenus(response.data.data);
          
          // Set the default menu as selected, or the first one if no default
          const defaultMenu = response.data.data.find(menu => menu.isDefault);
          if (defaultMenu) {
            setSelectedMenu(defaultMenu._id);
          } else if (response.data.data.length > 0) {
            setSelectedMenu(response.data.data[0]._id);
          }
        }
      } catch (err) {
        console.error('Error fetching venue menus:', err);
        setError('Failed to load menus');
      } finally {
        setLoading(false);
      }
    };

    if (venueId) {
      fetchMenus();
    }
  }, [venueId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (error || menus.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="restaurant-outline" size={48} color="#d1d5db" />
        <Text style={styles.emptyStateText}>
          {error || 'No menu available for this venue'}
        </Text>
      </View>
    );
  }

  // Get the currently selected menu
  const currentMenu = menus.find(menu => menu._id === selectedMenu) || menus[0];
  
  // Count available days
  const availableDaysCount = Object.values(currentMenu.availabilitySchedule)
    .filter(day => day.isAvailable)
    .length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Menu selector (if multiple menus) */}
      {menus.length > 1 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.menuSelector}
          contentContainerStyle={styles.menuSelectorContent}
        >
          {menus.map(menu => (
            <TouchableOpacity
              key={menu._id}
              style={[
                styles.menuSelectorItem,
                selectedMenu === menu._id && styles.menuSelectorItemActive
              ]}
              onPress={() => setSelectedMenu(menu._id)}
            >
              <Text style={[
                styles.menuSelectorText,
                selectedMenu === menu._id && styles.menuSelectorTextActive
              ]}>
                {menu.name}
              </Text>
              {menu.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultBadgeText}>Default</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Menu header */}
      <View style={styles.menuHeader}>
        <Text style={styles.menuName}>{currentMenu.name}</Text>
        {currentMenu.description && (
          <Text style={styles.menuDescription}>{currentMenu.description}</Text>
        )}
        
        <View style={styles.menuMeta}>
          <View style={styles.availabilityContainer}>
            <Ionicons name="calendar-outline" size={14} color="#6b7280" />
            <Text style={styles.availabilityText}>
              Available {availableDaysCount === 7 ? 'every day' : `${availableDaysCount} days a week`}
            </Text>
          </View>
          
          <View style={styles.typeContainer}>
            <Ionicons name="restaurant-outline" size={14} color="#6b7280" />
            <Text style={styles.typeText}>{currentMenu.type}</Text>
          </View>
        </View>
      </View>

      {/* Menu categories and items */}
      {currentMenu.categories.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="restaurant-outline" size={36} color="#d1d5db" />
          <Text style={styles.emptyStateText}>No items in this menu</Text>
        </View>
      ) : (
        <View style={styles.categoriesContainer}>
          {currentMenu.categories.map(category => (
            <View key={category._id} style={styles.categoryContainer}>
              <View style={styles.categoryHeader}>
                <Ionicons name="list" size={18} color="#3b82f6" />
                <Text style={styles.categoryName}>{category.name}</Text>
              </View>
              
              {category.description && (
                <Text style={styles.categoryDescription}>{category.description}</Text>
              )}
              
              <View style={styles.itemsContainer}>
                {category.items.map(item => (
                  <View key={item._id} style={styles.itemCard}>
                    <View style={styles.itemContent}>
                      <View style={styles.itemTitleRow}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        {item.popular && (
                          <View style={styles.popularBadge}>
                            <Ionicons name="star" size={10} color="#f59e0b" />
                            <Text style={styles.popularText}>Popular</Text>
                          </View>
                        )}
                      </View>
                      
                      {item.description && (
                        <Text style={styles.itemDescription}>{item.description}</Text>
                      )}
                      
                      <View style={styles.badgesContainer}>
                        {item.isVegetarian && (
                          <View style={[styles.badge, styles.vegetarianBadge]}>
                            <Text style={styles.badgeText}>Vegetarian</Text>
                          </View>
                        )}
                        {item.isVegan && (
                          <View style={[styles.badge, styles.veganBadge]}>
                            <Text style={styles.badgeText}>Vegan</Text>
                          </View>
                        )}
                        {item.isGlutenFree && (
                          <View style={[styles.badge, styles.glutenFreeBadge]}>
                            <Text style={styles.badgeText}>Gluten Free</Text>
                          </View>
                        )}
                        {item.spicyLevel && item.spicyLevel > 0 && (
                          <View style={[styles.badge, styles.spicyBadge]}>
                            <Text style={styles.badgeText}>
                              Spicy {Array(item.spicyLevel).fill('🌶️').join('')}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    
                    <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  menuSelector: {
    marginBottom: 16,
  },
  menuSelectorContent: {
    paddingHorizontal: 16,
  },
  menuSelectorItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuSelectorItemActive: {
    backgroundColor: '#3b82f6',
  },
  menuSelectorText: {
    color: '#4b5563',
    fontFamily: 'Montserratmedium',
    fontSize: 13,
  },
  menuSelectorTextActive: {
    color: '#fff',
  },
  defaultBadge: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
  defaultBadgeText: {
    fontSize: 10,
    color: '#4b5563',
  },
  menuHeader: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  menuName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'Montserratmedium',
  },
  menuDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    fontFamily: 'Outfitlight',
    lineHeight: 20,
  },
  menuMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  availabilityText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
    fontFamily: 'Ralewayregular',
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  typeText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
    fontFamily: 'Ralewayregular',
    textTransform: 'capitalize',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'Montserratmedium',
    textTransform: 'capitalize',
  },
  categoryDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    fontFamily: 'Outfitlight',
  },
  itemsContainer: {
    marginTop: 8,
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemContent: {
    flex: 1,
    marginRight: 8,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Outfitlight',
  },
  popularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  popularText: {
    fontSize: 10,
    color: '#f59e0b',
    marginLeft: 2,
  },
  itemDescription: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 8,
    fontFamily: 'Outfitlight',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
    borderWidth: 1,
  },
  vegetarianBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.2)',
  },
  veganBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  glutenFreeBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  spicyBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Ralewayregular',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Montserratmedium',
  },
});

export default VenueMenu; 