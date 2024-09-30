import React, { useEffect, useRef, useState } from 'react';
import {  useLocation, useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import './Location.css';
import { Button } from 'antd';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
// import Navbar from '../Navbar/Navbar';

mapboxgl.accessToken = 'pk.eyJ1IjoiaGFtemF6YWlkaSIsImEiOiJja3ZtY3RodzgwNGdlMzBwaWdjNWx5cTQ3In0.2s32bZnlSY-Qg5PFmoLrJw';

interface RouteProps {
  pickup: string;
  destination: string;
}

const Route: React.FC<RouteProps> = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [addToFav, setAddToFav] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { pickupLocation, destinationLocation } = location.state;


  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddToFav(e.target.checked);
  };

  const getCoordinates = async (location: string) => {
    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${mapboxgl.accessToken}`);
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      return data.features[0].geometry.coordinates;
    }
    throw new Error('Location not found');
  };

  useEffect(() => {
    if (mapContainer.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [77.5946, 12.9716], // Default center (Bangalore)
        zoom: 10,
      });

      const fetchRoute = async () => {
        try {
          const start = await getCoordinates(pickupLocation);
          const end = await getCoordinates(destinationLocation);

          const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

          const response = await fetch(url);
          const data = await response.json();
          const route = data.routes[0];
          const distance = route.distance;
          const duration = route.duration;

          setDistance(distance);
          setDuration(duration);

          map.on('load', () => {
            map.addLayer({
              id: 'route',
              type: 'line',
              source: {
                type: 'geojson',
                data: {
                  type: 'Feature',
                  properties: {},
                  geometry: route.geometry,
                },
              },
              layout: {
                'line-join': 'round',
                'line-cap': 'round',
              },
              paint: {
                'line-color': '#3887be',
                'line-width': 5,
                'line-opacity': 0.75,
              },
            });

            new mapboxgl.Marker().setLngLat(start).addTo(map);
            new mapboxgl.Marker().setLngLat(end).addTo(map);

            map.fitBounds([start, end], { padding: 50 });
          });
        } catch (err) {
          console.error('Error fetching route:', err);
        }
      };

      fetchRoute();
    }
  }, [pickupLocation, destinationLocation]);

  const handleClick = async () => {
    if (addToFav && user) {
      try {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/favorite_routes/`, {
          user_id: user.user_id,
          pickup_location: pickupLocation,
          destination_location: destinationLocation,
        });
      } catch (error) {
        console.error('Error adding favorite route:', error);
      }
    }

    navigate('/compare', {
      state: {
        distance: distance !== null ? (distance / 1000).toFixed(2) : null,
        duration: duration !== null ? (duration / 60).toFixed(2) : null,
        pickupLocation: pickupLocation,
        destinationLocation: destinationLocation,
      },
    });
  };

  return (
      <div className="route-container">
  <div ref={mapContainer} className="map-container" />
  <div className="info-container">
    {distance !== null && duration !== null && (
      <div className="details-container">
        <p className="distance">Estimated Distance: {(distance / 1000).toFixed(2)} km</p>
        <div className="checkbox-container">
              <input type="checkbox" id="fav-route" onChange={handleCheckboxChange} />
              <label htmlFor="fav-route">Add this Route as your Favorite route</label>
        </div>
        <p className="duration">Estimated Duration: {(duration / 60).toFixed(2)} minutes</p>
      </div>
    )}
    <Button className="compare-button" onClick={handleClick}>Click to See Prices</Button>
  </div>
</div>
  );
};

export default Route;
