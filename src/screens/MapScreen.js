import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';

const API_URL =
  'https://ceola-unreprovable-modesto.ngrok-free.dev/api/v1/bigdaisy/mapcalendars';

const MapScreen = () => {
  const navigation = useNavigation();
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);

  const buildMapHTML = calendars => {
    return `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<style>
  body { margin: 0; }
  #map { height: 100vh; }

  .custom-pin {
    background: transparent;
    border: none;
  }

  .pin-wrapper {
    width: 50px;
    height: 64px;
    position: relative;
  }

  .pin-circle {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid white;
    box-shadow: 0 4px 10px rgba(0,0,0,0.25);
    position: absolute;
    top: 0;
    left: 4px;
    animation: pop 0.3s ease;
  }

  .pin-circle img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .pin-label {
    position: absolute;
    top: 45px;
    left: -20px;
    background: white;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: bold;
    box-shadow: 0 3px 10px rgba(0,0,0,0.2);
    white-space: nowrap;
    animation: fadeIn 0.2s ease;
  }

  @keyframes pop {
    0% { transform: scale(0.3); }
    100% { transform: scale(1); }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
</head>

<body>
<div id="map"></div>

<script>
    const map = L.map('map', {
     zoomControl: true,
    }).setView([30.3753, 69.3451], 5);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CartoDB',
    subdomains: 'abcd',
    maxZoom: 19
    }).addTo(map);

  function sendToApp(data) {
    window.ReactNativeWebView.postMessage(JSON.stringify(data));
  }

  function createMarker(item) {
    const logo = item.logo_url || 'https://via.placeholder.com/40';

    const icon = L.divIcon({
      className: 'custom-pin',
      html: \`
        <div class="pin-wrapper">
          <div class="pin-circle">
            <img src="\${logo}" />
          </div>
        </div>
      \`,
      iconSize: [50, 64],
      iconAnchor: [25, 64],
      popupAnchor: [0, -60]
    });

    const marker = L.marker([item.latitude, item.longitude], { icon }).addTo(map);

    marker.bindPopup(
      '<b>' + item.name + '</b><br/>Tap to open'
    );

    marker.on('popupopen', function () {
      const popup = document.querySelector('.leaflet-popup-content');
      if (popup) {
        popup.style.cursor = 'pointer';
        popup.onclick = function () {
          sendToApp(item); // FULL OBJECT SENT
        };
      }
    });

    marker.on('mouseover', function (e) {
      const el = e.target._icon;
      if (!el.querySelector('.pin-label')) {
        const label = document.createElement('div');
        label.className = 'pin-label';
        label.innerText = item.name;
        el.appendChild(label);
      }
    });

    marker.on('mouseout', function (e) {
      const el = e.target._icon;
      const label = el.querySelector('.pin-label');
      if (label) label.remove();
    });
  }

  const calendars = ${JSON.stringify(calendars)};
  const bounds = [];
  calendars.forEach(c => {
    if (!c.latitude || !c.longitude) return;

    const lat = parseFloat(c.latitude);
    const lng = parseFloat(c.longitude);

    if (isNaN(lat) || isNaN(lng)) return;

    createMarker({
      ...c,
      latitude: lat,
      longitude: lng
    });
    bounds.push([lat, lng]);
  });
  if (bounds.length === 1) {
    map.setView(bounds[0], 10); // single calendar
  }else if (bounds.length > 1) {
    map.fitBounds(bounds, {
        padding: [50, 50]
    });
 }

</script>
</body>
</html>
    `;
  };

  const fetchCalendars = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();

      const calendars = data.calendars || [];

      setHtml(buildMapHTML(calendars));
    } catch (err) {
      console.log('MAP ERROR:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendars();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Header showSearch={false} placeholder="Search Calendars..." />

      <WebView
        source={{ html }}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        onMessage={event => {
          const calendar = JSON.parse(event.nativeEvent.data);

          navigation.navigate('CalendarShow', {
            calendarSlug: calendar.slug,
            calendarName: calendar.name,
            calendarLogo: calendar.logo_url,
            calendarLocation: calendar.location,
            latitude: calendar.latitude,
            longitude: calendar.longitude,
            calendarFull: calendar, // FULL DATA
          });
        }}
      />
    </View>
  );
};

export default MapScreen;
