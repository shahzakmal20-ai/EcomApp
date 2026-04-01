import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const Header = ({ onSearchPress, onFilterPress }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Search Pill */}
      <View style={styles.searchPill}>
        <TouchableOpacity style={styles.searchInputArea} onPress={onSearchPress}>
          <Icon name="search" size={20} color="#777" style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Find events...</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity onPress={onFilterPress} style={styles.filterIconArea}>
          <Icon name="options-outline" size={22} color="#020D1F" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    zIndex: 10,
  },
  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 30,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  searchInputArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: '#777',
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 25,
    backgroundColor: '#ddd',
    marginHorizontal: 10,
  },
  filterIconArea: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
