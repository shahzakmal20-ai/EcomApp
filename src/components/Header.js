import React from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Header = () => {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={{ uri: 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/online-shop-ecommerce-logo-app-icon-logo-design-template-910c781293690546d77a3828f9e901ee_screen.jpg?ts=1611442808' }} // replace with your logo
        style={styles.logo}
      />

      <Text style={styles.appName}>MyStore</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#555" />
        <TextInput
          placeholder="Search products..."
          placeholderTextColor="#464343"
          style={styles.searchInput}
        />
      </View>

      {/* Cart Icon */}
      <TouchableOpacity style={styles.iconContainer}>
        <Icon name="cart-outline" size={25} color="#948e8e" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#020D1F', 
    elevation: 3, // Android shadow
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderBlockColor: 'brown'
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#FFA600', // white text for better contrast
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#C0C0C0', // lighter grey for search bar
    borderRadius: 8,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 5,
    marginLeft: 5,
    color: '#333', // text color
  },
  iconContainer: {
    padding: 5,
  },
});

export default Header;