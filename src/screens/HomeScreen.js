import React, { useEffect, useState } from 'react';
import Header from '../components/Header';

import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch API Data
  const getProducts = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // Show loader while fetching
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <ScrollView>
        <View style={styles.bannerContainer}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db',
            }}
            style={styles.banner}
          />
          <Text style={styles.bannerText}>Welcome to Our Store!</Text>
        </View>
        <Text style={styles.heading}>Products</Text>
        <FlatList
          data={products}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text numberOfLines={2} style={styles.title}>
                {item.title}
              </Text>

              {/* Price and Add to Cart button in one row */}
              <View style={styles.row}>
                <Text style={styles.price}>${item.price}</Text>
                <Pressable
                  style={styles.button}
                  onPress={() => Alert.alert('Success', `${item.title} added to cart!`)}
                >
                  <Text style={styles.buttonText}>Add to Cart</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  banner: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerContainer: {
    width: '100%',
    height: 180,
    position: 'relative', 
  },
  bannerText: {
    position: 'absolute', 
    bottom: 10, 
    left: 15, 
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.7)', 
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    margin: 10,
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 14,
    marginTop: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row', // horizontal layout
    justifyContent: 'space-between', // price left, button right
    alignItems: 'center',
    marginTop: 5,
  },
  button: {
    backgroundColor: 'skyblue', // sky color
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
