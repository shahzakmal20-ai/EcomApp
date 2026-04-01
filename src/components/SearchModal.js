import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SearchModal = ({ visible, onClose, onApply, onClear, currentFilters }) => {
  const [name, setName] = useState(currentFilters?.name || '');
  const [location, setLocation] = useState(currentFilters?.location || '');

  useEffect(() => {
    if (visible && currentFilters) {
      setName(currentFilters.name || '');
      setLocation(currentFilters.location || '');
    }
  }, [visible, currentFilters]);

  const applyFilters = () => {
    onApply({
      name,
      location,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Search</Text>
            <TouchableOpacity style={styles.topCloseBtn} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>

            <View style={styles.inputContainer}>
              <Icon name="search-outline" size={20} color="#777" style={styles.inputIcon} />
              <TextInput
                placeholder="Search by name"
                placeholderTextColor="#888"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="location-outline" size={20} color="#777" style={styles.inputIcon} />
              <TextInput
                placeholder="Search by location"
                placeholderTextColor="#888"
                value={location}
                onChangeText={setLocation}
                style={styles.input}
              />
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionBtnClear}
                onPress={() => {
                  setName('');
                  setLocation('');

                  if (onClear) {
                    onClear();
                  }
                  onClose();
                }}
              >
                <Text style={styles.actionTextClear}>Clear All</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionBtnApply} onPress={applyFilters}>
                <Text style={styles.actionTextApply}>Apply</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default SearchModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    maxHeight: '90%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 15,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    height: 55,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#333',
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  actionBtnClear: {
    padding: 10,
    flex: 1,
    alignItems: 'center',
  },
  actionTextClear: {
    color: '#ff4444',
    fontWeight: '700',
    fontSize: 16,
  },
  actionBtnApply: {
    backgroundColor: '#22C3B5',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    flex: 1.2,
    alignItems: 'center',
  },
  actionTextApply: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  topCloseBtn: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
    padding: 5,
  },
  closeText: {
    fontSize: 24,
    color: '#ccc',
    fontWeight: '300',
  },
});
