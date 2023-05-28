import React, { useEffect, useState } from 'react';

function LocationTracker() {
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [locationName, setLocationName] = useState(null);
  
    useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            fetchLocationName(position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            console.error(error);
          }
        );
      } else {
        console.log('Geolocation is not supported by this browser.');
      }
  }, []);

  const fetchLocationName = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://api.tomtom.com/search/2/reverseGeocode/${lat},${lng}.json?key=alLLxGKMYCDvGTVAcgJVaBxui0lHSc6A`
      );
      const data = await response.json();
      console.log(data)
      const {country, localName , postalCode} = data.addresses[0].address;
      const addr = country+ "," +localName + "," + postalCode;
      setLocationName(addr);
    } catch (error) {
      console.error('Error fetching location name:', error);
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
        </div>
      ) : (
        <p>Fetching location..</p>
      )}
    </div>
  );
}

export default LocationTracker;
