// src/pages/MapPage.tsx
import React, { useContext, useEffect, useRef, useState } from 'react';
import mapboxgl, { LngLat } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button, Input } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { LocationContext } from '../components/Location_det/LocationContext';
// mapboxgl.accessToken = `${import.meta.env.mapboxgl}`; 
mapboxgl.accessToken = 'pk.eyJ1IjoiaGFtemF6YWlkaSIsImEiOiJja3ZtY3RodzgwNGdlMzBwaWdjNWx5cTQ3In0.2s32bZnlSY-Qg5PFmoLrJw'; // Replace with your Mapbox access token

const MapPage: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [, setCurrentLocation] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { from: 'pickup' | 'destination' } | undefined;
  const { setPickupLocation, setDestinationLocation } = useContext(LocationContext);

  useEffect(() => {
    if (!map.current) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const lngLat = new mapboxgl.LngLat(longitude, latitude);
          fetchAddress(lngLat, setCurrentLocation);

          map.current = new mapboxgl.Map({
            container: mapContainer.current!,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [longitude, latitude],
            zoom: 12,
          });

          markerRef.current = new mapboxgl.Marker({
            draggable: true,
          })
            .setLngLat([longitude, latitude])
            .addTo(map.current);

          markerRef.current.on('dragend', () => {
            const lngLat = markerRef.current!.getLngLat();
            fetchAddress(lngLat, setSelectedAddress);
          });

          map.current.on('moveend', () => {
            if (markerRef.current) {
              const center = map.current!.getCenter();
              markerRef.current.setLngLat(center);
              fetchAddress(center, setSelectedAddress);
            }
          });

          fetchAddress(new mapboxgl.LngLat(longitude, latitude), setSelectedAddress);
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        }
      );
    }
  }, []);

  const fetchAddress = (lngLat: LngLat, setAddress: (address: string) => void) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat.lng},${lngLat.lat}.json?access_token=${mapboxgl.accessToken}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.features && data.features.length > 0) {
          setAddress(data.features[0].place_name);
        }
      })
      .catch(error => console.error('Error fetching address:', error));
  };

  const handleSearch = () => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${mapboxgl.accessToken}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.features && data.features.length > 0) {
          const center = data.features[0].center;
          map.current!.flyTo({ center, zoom: 14 });
          markerRef.current!.setLngLat(center);
          setSelectedAddress(data.features[0].place_name);
        } else {
          alert('No results found.');
        }
      })
      .catch(error => console.error('Error fetching search results:', error));
  };

  const handleConfirmLocation = () => {
    if (selectedAddress) {
      if (state?.from === 'pickup') {
        setPickupLocation(selectedAddress);
      } else if (state?.from === 'destination') {
        setDestinationLocation(selectedAddress);
      }
      navigate('/dashboard');
    } else {
      alert('No location selected.');
    }
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '10px',
  };

  const inputStyle = {
    width: '75%',
    padding: '10px',
    marginTop: '10px',
    marginLeft: '10px',
    marginRight: '10px',
    fontSize: '20px',
  };

  const buttonStyle = {
    width: '20%',
    height: '50px',
    marginLeft: '10px',
    marginRight: '10px',
    marginTop: '12px',
    fontSize: '20px',
  };

  const mobileInputStyle = {
    width: '50%',
    fontSize: '16px',
  };

  const mobileButtonStyle = {
    width: '20%',
    height: '40px',
    fontSize: '16px',
    marginLeft: '10px'
  };

  const searchInputStyle = window.innerWidth <= 480 ? mobileInputStyle : inputStyle;
  const searchButtonStyle = window.innerWidth <= 480 ? mobileButtonStyle : buttonStyle;

  return (
    <div>
      <div style={containerStyle}>
        <Input
          type="text"
          placeholder="Search location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={searchInputStyle}
        />
        <Button onClick={handleSearch} style={searchButtonStyle}>
          Search
        </Button>
      </div>

      <div ref={mapContainer} style={{ width: '100%', height: '500px', position: 'relative' }} />

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <Button onClick={handleConfirmLocation} style={{ fontSize: '20px' }}>
          Confirm Location
        </Button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px',marginLeft: '10px', color: 'white' }}>
        <p>{selectedAddress ? `Selected address: ${selectedAddress}` : 'Drag the marker or search to select an address'}</p>
      </div>
    </div>
  );
};

export default MapPage;
