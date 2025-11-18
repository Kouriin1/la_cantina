import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';
import { Product } from '../../../domain/entities/Product';
import { ProductRepositoryImpl } from '../../../data/repositories/ProductRepositoryImpl';
import { GetProductsUseCase } from '../../../domain/usecases/GetProductsUseCase';
import Button from '../../components/Button';
import { colors } from '../../theme/colors';

const ProductsScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.productContainer}>
      <View>
        <Text style={styles.productName}>{item.name}</Text>
        <Text>Price: ${item.price.toFixed(2)} | Stock: {item.stock}</Text>
      </View>
      <Button title="Edit" onPress={() => {}} />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Products</Text>
      <Button title="Add New Product" onPress={() => {}} />
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    marginTop: 20,
  },
  productContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductsScreen;
