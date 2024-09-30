// src/components/MapComponent.tsx
import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete, DirectionsRenderer } from '@react-google-maps/api';

const mapContainerStyle = {
  height: '500px',
  width: '100%'
};

const MapComponent: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [origin, setOrigin] = useState<google.maps.LatLngLiteral | null>(null);
  const [destination, setDestination] = useState<google.maps.LatLngLiteral | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [originInput, setOriginInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');

  const mapRef = useRef<google.maps.Map | null>(null);
  const originRef = useRef<google.maps.places.Autocomplete | null>(null);
  const destinationRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(pos);
          map.panTo(pos);
        },
        () => {
          console.error('Error fetching current location.');
        }
      );
    }
  }, []);

  const onDragEndOrigin = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setOrigin({ lat, lng });
    }
  }, []);

  const onDragEndDestination = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setDestination({ lat, lng });
    }
  }, []);

  const calculateRoute = useCallback(() => {
    if (origin && destination) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`Error fetching directions ${result}`);
          }
        }
      );
    }
  }, [origin, destination]);

  const handlePlaceChanged = (type: 'origin' | 'destination') => {
    const place = type === 'origin' ? originRef.current?.getPlace() : destinationRef.current?.getPlace();
    if (place && place.geometry && place.geometry.location) {
      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      if (type === 'origin') {
        setOrigin(location);
        setOriginInput(place.formatted_address || '');
      } else {
        setDestination(location);
        setDestinationInput(place.formatted_address || '');
      }
      mapRef.current?.panTo(location);
    }
  };

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyACbXQoqPUUp3rOIm3vKS_pQxbHzUQfuJo"
    //   libraries={libraries}
    >
      <div>
        <Autocomplete
          onLoad={(ref) => (originRef.current = ref)}
          onPlaceChanged={() => handlePlaceChanged('origin')}
        >
          <input
            type="text"
            placeholder="Enter pick-up address"
            value={originInput}
            onChange={(e) => setOriginInput(e.target.value)}
            style={{ width: '300px', height: '40px', marginBottom: '10px' }}
          />
        </Autocomplete>
        <Autocomplete
          onLoad={(ref) => (destinationRef.current = ref)}
          onPlaceChanged={() => handlePlaceChanged('destination')}
        >
          <input
            type="text"
            placeholder="Enter destination address"
            value={destinationInput}
            onChange={(e) => setDestinationInput(e.target.value)}
            style={{ width: '300px', height: '40px', marginBottom: '10px' }}
          />
        </Autocomplete>
      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={currentLocation || { lat: 0, lng: 0 }}
        onLoad={onMapLoad}
      >
        {origin && (
          <Marker
            position={origin}
            draggable={true}
            onDragEnd={onDragEndOrigin}
            label="A"
          />
        )}
        {destination && (
          <Marker
            position={destination}
            draggable={true}
            onDragEnd={onDragEndDestination}
            label="B"
          />
        )}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
      <div>
        <button onClick={calculateRoute} style={{ marginTop: '10px' }}>
          Confirm Location
        </button>
      </div>
    </LoadScript>
  );
};

export default MapComponent;
