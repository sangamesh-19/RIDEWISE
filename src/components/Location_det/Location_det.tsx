import  { useContext, useState, useEffect } from 'react';
import './Location_det.css';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CiLocationOn } from "react-icons/ci";
import { LocationContext } from './LocationContext';
import { Input } from 'antd';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

interface Route {
  id: number; // Assuming id is of type number, adjust if it's different
  pickup_location: string;
  destination_location: string;
  // Add other properties as per your API response
}

const Location_det = () => {
  const navigate = useNavigate();
  const { pickupLocation, setPickupLocation, destinationLocation, setDestinationLocation } = useContext(LocationContext);
  const { user } = useAuth();
  const [favRoutes, setFavRoutes] = useState<Route[]>([]); 

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/favorite_routes/`, {
            params: {
              user_id: user.user_id,
            },
          });

          setFavRoutes(response.data);
        } catch (error) {
          console.error('Error fetching Favorite routes:', error);
        }
      }
    };

    fetchData();
  }, [user]);
  const handleSearch = () => {
    navigate('/route', {
      state: {
        pickupLocation,
        destinationLocation
      }
    });
  };

  const handleLocationClick = (type: 'pickup' | 'destination') => {
    navigate('/map', { state: { from: type } });
  };

  const handleRouteSelect = (route: Route) => {
    setPickupLocation(route.pickup_location);
    setDestinationLocation(route.destination_location);
  };

  return (
    <>
    <div className='box'>
      <div className='Input'>
        <Input
          type="text"
          placeholder='Enter Pickup Location'
          value={pickupLocation || ''}
          onChange={(e) => setPickupLocation(e.target.value)}
        />
        <CiLocationOn className="location-icon" onClick={() => handleLocationClick('pickup')} />

        <Input
          type='text'
          placeholder='Enter Destination'
          value={destinationLocation || ''}
          onChange={(e) => setDestinationLocation(e.target.value)}
        />
        <CiLocationOn className="location-icon" onClick={() => handleLocationClick('destination')} />

        <div>
          <motion.button
            className='Search'
            onClick={handleSearch}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            Preview Location
          </motion.button>
        </div>

        
      </div>
    </div>
    <div className='fav'>
    <h3>Favourite Routes:</h3>
    <ul style={{width:'100%'}}>
      {favRoutes.map((route) => (
        <li key={route.id} onClick={() => handleRouteSelect(route)}>
          {route.pickup_location} to {route.destination_location}
        </li>
      ))}
    </ul>
  </div>
  </>
  );
};

export default Location_det;
