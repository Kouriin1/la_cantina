import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { ProductRepositoryImpl } from '../../../data/repositories/ProductRepositoryImpl';
import { Product } from '../../../domain/entities/Product';
import { AddProductUseCase } from '../../../domain/usecases/AddProductUseCase';
import { DeleteProductUseCase } from '../../../domain/usecases/DeleteProductUseCase';
import { GetProductsUseCase } from '../../../domain/usecases/GetProductsUseCase';
import { UpdateProductUseCase } from '../../../domain/usecases/UpdateProductUseCase';
import { colors } from '../../theme/colors';

const ProductsScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const productRepository = new ProductRepositoryImpl();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const getProductsUseCase = new GetProductsUseCase(productRepository);
      const result = await getProductsUseCase.execute();
      setProducts(result);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setStock('');
    setImageUrl('');
    setEditingProduct(null);
  };

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price.toString());
      setStock(product.stock.toString());
      setImageUrl(product.imageUrl || '');
    } else {
      resetForm();
    }
    setModalVisible(true);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name || !price || !stock) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios');
      return;
    }

    try {
      if (editingProduct) {
        const updateProductUseCase = new UpdateProductUseCase(productRepository);
        await updateProductUseCase.execute({
          ...editingProduct,
          name,
          description,
          price: parseFloat(price),
          stock: parseInt(stock),
          imageUrl,
        });
        Alert.alert('Éxito', 'Producto actualizado correctamente');
      } else {
        const addProductUseCase = new AddProductUseCase(productRepository);
        await addProductUseCase.execute({
          name,
          description,
          price: parseFloat(price),
          stock: parseInt(stock),
          imageUrl,
          cost: 0, // Default cost
        });
        Alert.alert('Éxito', 'Producto creado correctamente');
      }
      setModalVisible(false);
      fetchProducts();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo guardar el producto');
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Eliminar Producto',
      '¿Estás seguro de que quieres eliminar este producto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const deleteProductUseCase = new DeleteProductUseCase(productRepository);
              await deleteProductUseCase.execute(id);
              fetchProducts();
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'No se pudo eliminar el producto');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <Image
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
        style={styles.productImage}
      />
      <View style={styles.productContent}>
        <View style={styles.productHeader}>
          <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.productPrice}>Bs.S {item.price.toFixed(2)}</Text>
        </View>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description || 'Sin descripción'}
        </Text>
        <View style={styles.productFooter}>
          <View style={styles.stockBadge}>
            <Ionicons name="cube-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.stockText}>{item.stock} disponibles</Text>
          </View>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() => openModal(item)}
            >
              <Ionicons name="create-outline" size={20} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDelete(item.id)}
            >
              <Ionicons name="trash-outline" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#B8956A', '#A67C52', '#B8956A']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>Gestión de Productos</Text>
        <Text style={styles.headerSubtitle}>Administra el menú de la cantina</Text>
      </LinearGradient>

      {loading ? (
        <View style={styles.centered}>
          <Text>Cargando productos...</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="fast-food-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No hay productos registrados</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => openModal()}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[colors.secondary, '#E67E22']}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={30} color={colors.white} />
        </LinearGradient>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {imageUrl ? (
                  <Image source={{ uri: imageUrl }} style={styles.previewImage} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="camera-outline" size={40} color={colors.textSecondary} />
                    <Text style={styles.imagePlaceholderText}>Toca para agregar imagen</Text>
                  </View>
                )}
              </TouchableOpacity>

              <Text style={styles.label}>Nombre del Producto *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Ej. Empanada de Queso"
              />

              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Descripción detallada..."
                multiline
                numberOfLines={3}
              />

              <View style={styles.row}>
                <View style={styles.halfColumn}>
                  <Text style={styles.label}>Precio (Bs.S) *</Text>
                  <TextInput
                    style={styles.input}
                    value={price}
                    onChangeText={setPrice}
                    placeholder="0.00"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.halfColumn}>
                  <Text style={styles.label}>Stock Inicial *</Text>
                  <TextInput
                    style={styles.input}
                    value={stock}
                    onChangeText={setStock}
                    placeholder="0"
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  productCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    height: 120,
  },
  productImage: {
    width: 120,
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  productContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.secondary,
  },
  productDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  stockText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#3498DB',
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  emptyText: {
    marginTop: 10,
    color: colors.textSecondary,
    fontSize: 16,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: '85%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  formContainer: {
    flex: 1,
  },
  imagePicker: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f6fa',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: colors.textSecondary,
    fontSize: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f6fa',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfColumn: {
    flex: 1,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f6fa',
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProductsScreen;
