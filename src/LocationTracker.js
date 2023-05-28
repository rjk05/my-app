import React, { useEffect, useState } from 'react';
import L from 'leaflet';

function LocationTracker() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    
    const updateMarkerPosition = (lat, lng) => {
    if (map) {
      map.panTo([lat, lng]);

      const marker = L.marker([lat, lng]);
      marker.addTo(map);
    }
  };
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          fetchLocationName(position.coords.latitude, position.coords.longitude);
          updateMarkerPosition(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }, [updateMarkerPosition]);

  useEffect(() => {
    if (latitude && longitude) {
      initializeMap();
    }
  }, [initializeMap ,latitude, longitude]);

  const initializeMap = () => {
    const mapInstance = L.map('map').setView([latitude, longitude], 13);
    setMap(mapInstance);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance);

    const marker = L.marker([latitude, longitude]).addTo(mapInstance);

    // Optional: Add a popup to the marker
    marker.bindPopup('You are here').openPopup();
  };

  const fetchLocationName = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      const placeName = data.display_name;
      setLocationName(placeName);
    } catch (error) {
      console.error('Error fetching location name:', error);
    }
  };

  const updateMarkerPosition = (lat, lng) => {
    if (map) {
      map.panTo([lat, lng]);

      const marker = L.marker([lat, lng]);
      marker.addTo(map);
    }
  };

  return (
    <div>
      <h1>Location Tracker</h1>
      {latitude && longitude ? (
        <div>
          <p>
            Latitude: {latitude}, Longitude: {longitude}
          </p>
          {locationName ? <p>Location: {locationName}</p> : <p>Fetching location name...</p>}
          <div id="map" style={{ height: '400px' }}></div>
        </div>
      ) : (
        <p>Fetching location...</p>
      )}
    </div>
  );
}

export default LocationTracker;
