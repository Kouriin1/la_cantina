import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProductRepositoryImpl } from '../../../data/repositories/ProductRepositoryImpl';
import { Product } from '../../../domain/entities/Product';
import { GetProductsUseCase } from '../../../domain/usecases/GetProductsUseCase';
import { useCartStore } from '../../state/cartStore';
import { colors } from '../../theme/colors';

const StudentMenuScreen = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem, getItemCount } = useCartStore();
  const cartItemCount = getItemCount();
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productRepository = new ProductRepositoryImpl();
        const getProductsUseCase = new GetProductsUseCase(productRepository);
        const result = await getProductsUseCase.execute();
        setProducts(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addItem(product);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1000);
  };

  const renderItem = ({ item }: { item: Product }) => {
    const isAdded = addedProductId === item.id;

    return (
      <View style={styles.productCard}>
        <Image
          source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
          style={styles.productImage}
        />
        {item.stock < 5 && item.stock > 0 && (
          <View style={styles.lowStockBadge}>
            <Text style={styles.lowStockText}>¡Últimas unidades!</Text>
          </View>
        )}
        {item.stock === 0 && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Agotado</Text>
          </View>
        )}
        <View style={styles.productContent}>
          <Text style={styles.productName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.productDescription} numberOfLines={1}>
            {item.description || 'Delicioso y nutritivo'}
          </Text>
          <View style={styles.bottomRow}>
            <View style={styles.priceColumn}>
              <Text style={styles.productPrice}>Bs.S {item.price.toFixed(2)}</Text>
              <View style={styles.stockBadge}>
                <Ionicons name="cube-outline" size={12} color={colors.textSecondary} />
                <Text style={styles.stockText}>{item.stock} disponibles</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.addButton, isAdded && styles.addButtonSuccess]}
              onPress={() => handleAddToCart(item)}
              disabled={item.stock === 0}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  item.stock === 0
                    ? ['#B2BEC3', '#636E72']
                    : isAdded
                      ? ['#61C9A8', '#4FB896']
                      : ['#ED9B40', '#E8872E']
                }
                style={styles.addButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons
                  name={isAdded ? 'checkmark' : 'add'}
                  size={24}
                  color={colors.white}
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Ionicons name="restaurant" size={60} color={colors.primary} />
        <Text style={styles.loadingText}>Cargando menú...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#B8956A', '#A67C52', '#B8956A']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Menú del Día</Text>
            <Text style={styles.headerSubtitle}>
              <Ionicons name="flame" size={16} color="#ED9B40" /> ¡Disfruta de nuestras comidas!
            </Text>
          </View>
          {cartItemCount > 0 && (
            <TouchableOpacity
              style={styles.headerCartButton}
              onPress={() => (navigation as any).navigate('Cart')}
              activeOpacity={0.8}
            >
              <Ionicons name="cart" size={28} color="#fff" />
              <View style={styles.headerCartBadge}>
                <Text style={styles.headerCartBadgeText}>{cartItemCount}</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="fast-food-outline" size={80} color="#DFE6E9" />
            <Text style={styles.emptyText}>No hay productos disponibles</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    color: colors.textSecondary,
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 0.3,
  },
  headerCartButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  headerCartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#E74C3C',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerCartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 4,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 20,
  },
  productCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    flexDirection: 'row',
    height: 140,
  },
  productImage: {
    width: 140,
    height: '100%',
    backgroundColor: colors.background,
  },
  lowStockBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 1,
  },
  lowStockText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  outOfStockText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  productContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  productDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 18,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceColumn: {
    flex: 1,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.secondary,
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    alignSelf: 'flex-start',
  },
  stockText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  addButton: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginLeft: 12,
  },
  addButtonSuccess: {
    shadowColor: colors.success,
  },
  addButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
});

export default StudentMenuScreen;
