import React, { useState, useEffect } from 'react';
import { Calendar } from 'react-native-calendars';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const FilterModal = ({ visible, onClose, onApply, onClear, currentFilters, categories, initialSection }) => {
  const scrollRef = React.useRef(null);
  const [sectionOffsets, setSectionOffsets] = useState({});

  const [priceType, setPriceType] = useState(currentFilters?.price_filter || 'any');
  const [dateFilter, setDateFilter] = useState(currentFilters?.date_filter || 'any');
  const [startDate, setStartDate] = useState(currentFilters?.start_date || '');
  const [endDate, setEndDate] = useState(currentFilters?.end_date || '');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState(currentFilters?.category_ids || []);

  // 1. SYNC STATE ONLY ON OPEN
  useEffect(() => {
    if (visible) {
      setPriceType(currentFilters?.price_filter || 'any');
      setDateFilter(currentFilters?.date_filter || 'any');
      setStartDate(currentFilters?.start_date || '');
      setEndDate(currentFilters?.end_date || '');
      setSelectedCategoryIds(currentFilters?.category_ids || []);
    }
  }, [visible]);

  // 2. SCROLL ON INITIAL LOAD
  useEffect(() => {
    if (visible && initialSection && sectionOffsets[initialSection] !== undefined) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          y: sectionOffsets[initialSection],
          animated: true,
        });
      }, 100);
    }
  }, [visible, initialSection, sectionOffsets]);

  const toggleCategory = (id) => {
    setSelectedCategoryIds(prev =>
      prev.includes(id) ? prev.filter(catId => catId !== id) : [...prev, id]
    );
  };

  const applyFilters = () => {
    onApply({
      price_filter: priceType,
      date_filter: dateFilter,
      start_date: startDate,
      end_date: endDate,
      category_ids: selectedCategoryIds,
    });
    onClose();
  };

  const resetAll = () => {
    setPriceType('any');
    setDateFilter('any');
    setStartDate('');
    setEndDate('');
    setSelectedCategoryIds([]);
  };

  const handleDayPress = (day) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day.dateString);
      setEndDate('');
    } else if (startDate && !endDate) {
      if (day.dateString < startDate) {
        setStartDate(day.dateString);
      } else {
        setEndDate(day.dateString);
      }
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>All Filters</Text>
          <TouchableOpacity
            onPress={() => {
              resetAll();
              if (onClear) onClear();
              onClose();
            }}
          >
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View onLayout={(e) => {
            const { y } = e.nativeEvent.layout;
            setSectionOffsets(prev => ({ ...prev, price: y }));
          }}>
            <Text style={styles.filterLabel}>Price</Text>
          </View>
          <View style={styles.row}>
            {['any', 'free', 'paid'].map(type => (
              <TouchableOpacity
                key={type}
                onPress={() => setPriceType(type)}
                style={[styles.btn, priceType === type && styles.activeBtn]}
              >
                <Text
                  style={[
                    styles.btnText,
                    priceType === type && styles.activeText,
                  ]}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View onLayout={(e) => {
            const { y } = e.nativeEvent.layout;
            setSectionOffsets(prev => ({ ...prev, date: y }));
          }}>
            <Text style={styles.filterLabel}>Date</Text>
          </View>
          <View style={styles.dateOptionsContainer}>
            {['any', 'today', 'this_week', 'this_month', 'custom'].map(type => (
              <TouchableOpacity
                key={type}
                onPress={() => setDateFilter(type)}
                style={[styles.dateBtn, dateFilter === type && styles.activeDateBtn]}
              >
                <Text
                  style={[
                    styles.dateBtnText,
                    dateFilter === type && styles.activeDateText,
                  ]}
                >
                  {type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {dateFilter === 'custom' && (
            <View style={styles.calendarContainer}>
              <Text style={styles.dateRangeText}>
                {startDate ? `Start: ${startDate}` : 'Select Start Date'}
                {endDate ? `  |  End: ${endDate}` : ''}
              </Text>
              <Calendar
                onDayPress={handleDayPress}
                minDate={new Date().toISOString().split('T')[0]}
                markedDates={{
                  ...(startDate ? { [startDate]: { selected: true, selectedColor: '#22C3B5' } } : {}),
                  ...(endDate ? { [endDate]: { selected: true, selectedColor: '#22C3B5' } } : {})
                }}
                renderArrow={(direction) => (
                  <Icon 
                    name={direction === 'left' ? 'chevron-back' : 'chevron-forward'} 
                    size={24} 
                    color="#22C3B5" 
                  />
                )}
                theme={{
                  selectedDayBackgroundColor: '#22C3B5',
                  todayTextColor: '#22C3B5',
                  arrowColor: '#22C3B5',
                }}
              />
            </View>
          )}

          <View onLayout={(e) => {
            const { y } = e.nativeEvent.layout;
            setSectionOffsets(prev => ({ ...prev, categories: y }));
          }}>
            <Text style={styles.filterLabel}>Categories</Text>
          </View>
          <View style={styles.categoryContainer}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => toggleCategory(cat.id)}
                style={[
                  styles.categoryChip,
                  selectedCategoryIds.includes(cat.id) && styles.activeCategoryChip
                ]}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategoryIds.includes(cat.id) && styles.activeCategoryText
                ]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.unselectBtn} onPress={resetAll}>
            <Text style={styles.unselectText}>Unselect All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtnApply} onPress={applyFilters}>
            <Text style={styles.actionTextApply}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50, // Safe area for header
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  closeBtn: {
    padding: 5,
  },
  closeText: {
    fontSize: 22,
    color: '#333',
    fontWeight: '300',
  },
  resetText: {
    fontSize: 14,
    color: '#ff4444',
    fontWeight: '600',
  },
  scrollContent: {
    padding: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginTop: 20,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  activeBtn: {
    backgroundColor: '#22C3B5',
    borderColor: '#22C3B5',
  },
  btnText: {
    color: '#555',
    fontWeight: '600',
    fontSize: 14,
  },
  activeText: {
    color: '#fff',
  },
  dateOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  dateBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 24,
    marginRight: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  activeDateBtn: {
    backgroundColor: '#22C3B5',
    borderColor: '#22C3B5',
  },
  dateBtnText: {
    color: '#555',
    fontSize: 13,
    fontWeight: '600',
  },
  activeDateText: {
    color: '#fff',
  },
  calendarContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#fbfbfb',
  },
  dateRangeText: {
    textAlign: 'center',
    fontWeight: '700',
    color: '#22C3B5',
    marginBottom: 15,
    fontSize: 14,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 30,
  },
  categoryChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 24,
    marginRight: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeCategoryChip: {
    backgroundColor: '#22C3B520',
    borderColor: '#22C3B5',
  },
  categoryText: {
    color: '#555',
    fontSize: 14,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#22C3B5',
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
    paddingBottom: 30, 
  },
  unselectBtn: {
    paddingVertical: 10,
  },
  unselectText: {
    color: '#ff4444',
    fontWeight: '700',
    fontSize: 14,
  },
  actionBtnApply: {
    backgroundColor: '#22C3B5',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#22C3B5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  actionTextApply: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
