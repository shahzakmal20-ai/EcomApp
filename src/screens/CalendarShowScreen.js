import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const CalendarShowScreen = ({ route }) => {
  const navigation = useNavigation();

  const { calendarSlug, calendarName, calendarLogo } = route.params;

  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const API_URL = `https://ceola-unreprovable-modesto.ngrok-free.dev/api/v1/bigdaisy/calendar_events?calendar_slug=${calendarSlug}`;

  const fetchEvents = async (pageNum = 1) => {
    try {
      pageNum === 1 ? setLoading(true) : setLoadingMore(true);

      const res = await fetch(`${API_URL}&page=${pageNum}&per_page=10`);
      const data = await res.json();

      const newEvents = data.events || [];

      if (pageNum === 1) {
        setEvents(newEvents);
      } else {
        setEvents(prev => [...prev, ...newEvents]);
      }

      setPage(pageNum);

      if (newEvents.length < 10) {
        setHasMore(false);
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    fetchEvents(1);
  }, []);

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    fetchEvents(page + 1);
  };

  const renderItem = ({ item }) => {
    const date = item.start_date ? new Date(item.start_date) : null;

    const day = date ? date.getDate() : '--';
    const month = date
      ? date.toLocaleString('default', { month: 'short' })
      : '';

    return (
      <View style={styles.card}>
        {/* IMAGE */}
        <TouchableOpacity
          onPress={() => navigation.navigate('EventDetail', { event: item })}
        >
          <Image
            source={{
              uri: item.banner_image_url || 'https://via.placeholder.com/400',
            }}
            style={styles.image}
          />
        </TouchableOpacity>

        {/* DATE BADGE */}
        <View style={styles.dateBadge}>
          <Text style={styles.dateDay}>{day}</Text>
          <Text style={styles.dateMonth}>{month}</Text>
        </View>

        {/* CONTENT */}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>

          <Text style={styles.location}>
             {item.location || 'No location'}
          </Text>

          <Text style={styles.price}>
            {item.price ? `$${item.price}` : 'Free'}
          </Text>
        </View>
      </View>
    );
  };

  //  HEADER (Logo + Name)
  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <Image
        source={
          calendarLogo
            ? { uri: calendarLogo }
            : require('../../assets/daisylogo.png')
        }
        style={styles.logo}
      />

      <Text style={styles.headerTitle}>{calendarName}</Text>
    </View>
  );

  // LOADER SCREEN
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#79beef" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={1.2}
        ListFooterComponent={
          loadingMore ? (
            <View style={{ paddingVertical: 20 }}>
              <ActivityIndicator size="small" color="#666" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Events Found</Text>
          </View>
        }
      />
    </View>
  );
};

export default CalendarShowScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },

  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111',
  },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 14,
    marginTop: 14,
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 4,
  },

  image: {
    width: '100%',
    height: 250,
  },

  dateBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#111',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },

  dateDay: {
    color: '#fff',
    fontWeight: 'bold',
  },

  dateMonth: {
    color: '#fff',
    fontSize: 12,
  },

  content: {
    padding: 14,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
  },

  location: {
    marginTop: 6,
    color: '#666',
  },

  price: {
    marginTop: 8,
    fontWeight: '700',
  },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },

  emptyTitle: {
    fontSize: 16,
    color: '#777',
  },
});
