import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const Header = ({ onSearchPress }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../../assets/daisylogo.png')}
        style={styles.logo}
      />

      <Text style={styles.appName}>MyDaisy</Text>

      {/* Search Icon */}
      <TouchableOpacity onPress={onSearchPress} style={styles.iconContainer}>
        <Icon name="search" size={22} color="#020D1F" />
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
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
    color: '#22C3B5',
  },
  iconContainer: {
    marginLeft: 'auto',
    padding: 5,
  },
});
