import React, { useEffect, useState } from 'react';
import './Compare.css';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar/Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

interface Car {
  imgUrl: string;
  service: string;
  multiplier: number;
  details: string;
  time: string;
  fare?: number;
}

const uberCarList: Car[] = [
  {
    imgUrl: 'https://d1a3f4spazzrp4.cloudfront.net/car-types/haloProductImages/v1.1/TukTuk_Green_v1.png',
    service: 'Auto',
    multiplier: 1.5,
    details: "Auto rickshaws at the tap of a button",
    time: "15 min away"
  },
  {
    imgUrl: 'https://i.ibb.co/cyvcpfF/uberx.png',
    service: 'Go',
    multiplier: 2,
    details: "Everyday rides with AC",
    time: "30 min away"
  },
  {
    imgUrl: 'https://d1a3f4spazzrp4.cloudfront.net/car-types/haloProductImages/v1.1/Moto_v1.png',
    service: 'Moto',
    multiplier: 1,
    details: "Affordable and quick motorcycle rides",
    time: "10 min away"
  },
  {
    imgUrl: 'https://i.ibb.co/cyvcpfF/uberx.png',
    service: 'Premier',
    multiplier: 2.5,
    details: "Premium rides with more comfort",
    time: "20 min away"
  },
  {
    imgUrl: 'https://i.ibb.co/cyvcpfF/uberx.png',
    service: 'UberXL',
    multiplier: 3,
    details: "Spacious rides for groups",
    time: "25 min away"
  },
  {
    imgUrl: 'https://i.ibb.co/cyvcpfF/uberx.png',
    service: 'GoSedan',
    multiplier: 2.2,
    details: "Sedan rides with extra comfort",
    time: "22 min away"
  },
  {
    imgUrl: 'https://i.ibb.co/cyvcpfF/uberx.png',
    service: 'UberXS',
    multiplier: 1.8,
    details: "Compact rides for everyday use",
    time: "18 min away"
  },
  {
    imgUrl: 'https://d1a3f4spazzrp4.cloudfront.net/car-types/haloProductImages/v1.1/TukTuk_Green_v1.png',
    service: 'Pool',
    multiplier: 1.5,
    details: "Shared rides to save cost",
    time: "16 min away"
  },
  {
    imgUrl: 'https://i.ibb.co/cyvcpfF/uberx.png',
    service: 'XLPlus',
    multiplier: 3.5,
    details: "Extra spacious rides for large groups",
    time: "25 min away"
  }
];

const olaCarList: Car[] = [
  {
    imgUrl: 'https://d1a3f4spazzrp4.cloudfront.net/car-types/haloProductImages/v1.1/TukTuk_Green_v1.png',
    service: 'Auto',
    multiplier: 1.5,
    details: "Affordable auto rides",
    time: "10 min away"
  },
  {
    imgUrl: 'https://i.ibb.co/cyvcpfF/uberx.png',
    service: 'Mini',
    multiplier: 1.2,
    details: "Affordable, compact rides with AC",
    time: "15 min away"
  },
  {
    imgUrl: 'https://i.ibb.co/cyvcpfF/uberx.png',
    service: 'Prime_Sedan',
    multiplier: 2,
    details: "Comfortable sedan rides",
    time: "20 min away"
  },
  {
    imgUrl: 'https://i.ibb.co/cyvcpfF/uberx.png',
    service: 'Share',
    multiplier: 1.1,
    details: "Share rides to save cost",
    time: "12 min away"
  },
  {
    imgUrl: 'https://i.ibb.co/cyvcpfF/uberx.png',
    service: 'Rentals',
    multiplier: 3,
    details: "Rent a car for multiple hours",
    time: "30 min away"
  },
  {
    imgUrl: 'https://i.ibb.co/cyvcpfF/uberx.png',
    service: 'Outstation',
    multiplier: 4,
    details: "Travel out of the city",
    time: "40 min away"
  },
  {
    imgUrl: 'https://i.ibb.co/cyvcpfF/uberx.png',
    service: 'Luxury',
    multiplier: 5,
    details: "Premium luxury rides",
    time: "45 min away"
  },
  {
    imgUrl: 'https://i.ibb.co/cyvcpfF/uberx.png',
    service: 'Taxi_for_Sure',
    multiplier: 1.8,
    details: "Economical taxi rides",
    time: "18 min away"
  }
];

const rapidoCarList: Car[] = [
  {
    imgUrl: 'https://d1a3f4spazzrp4.cloudfront.net/car-types/haloProductImages/v1.1/TukTuk_Green_v1.png',
    service: 'Auto',
    multiplier: 1.5,
    details: "Affordable auto rides",
    time: "8 min away"
  },

  {
    imgUrl: 'https://d1a3f4spazzrp4.cloudfront.net/car-types/haloProductImages/v1.1/Moto_v1.png',
    service: 'Bike',
    multiplier: 1,
    details: "Quick bike rides",
    time: "5 min away"
  },

];


const ComparePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { distance, duration, pickupLocation, destinationLocation } = location.state;
  const { user } = useAuth();
  const [ola, setOla] = useState<Car[]>([]);
  const [uber, setUber] = useState<Car[]>([]);
  const [rapido, setRapido] = useState<Car[]>([]);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/estimate_fare/`, {
            distance_km: distance,
            user_id: user.user_id,
            time_min: duration,
            surge_multiplier: 1,
          });

          const mapServices = (serviceData: any, carList: Car[]) => {
            return carList.map(car => ({
              ...car,
              fare: serviceData[car.service.toLowerCase()]
            }));
          };

          setOla(mapServices(response.data.fares.ola, olaCarList));
          setUber(mapServices(response.data.fares.uber, uberCarList));
          setRapido(mapServices(response.data.fares.rapido, rapidoCarList));
        } catch (error) {
          console.error('Error fetching car data:', error);
        }
      }
    };

    fetchData();
  }, [distance, duration, user]);

  const handleSelectService = (service: string) => {
    setSelectedService(service);
  };

  const handleBookNow = async () => {
    if (selectedService && user) {
      let [serviceName, serviceType, fare] = selectedService.split(' ');
      const payload = {
        user_id: user.user_id,
        pickup_location: pickupLocation,
        destination_location: destinationLocation,
        distance_km: distance,
        time_minutes: duration,
        surge_multiplier: 1.5,
        service_name: serviceName,
        vehicle_type: serviceType,
        price: fare
      };

      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/trips/`, payload);
        console.log('Booking response:', response.data);
        // Redirect to the specific service's website
        const serviceUrls: { [key: string]: string } = {
          'Uber': 'https://www.uber.com',
          'Ola': 'https://www.olacabs.com',
          'Rapido': 'https://www.rapido.bike'
        };
        window.open(serviceUrls[serviceName], '_blank');
        // Navigate to the dashboard on the current tab
        navigate('/dashboard');
      } catch (error) {
        console.error('Error booking service:', error);
      }
    }
  };

  const handleCancelRide = () => {
    navigate('/dashboard');
  };

  return (
    <>
      <Navbar />
      <motion.div
        className="compare-container"
        initial={{ opacity: 0, x: '100vw' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '-100vw' }}
        transition={{ duration: 0.6 }}
      >
        <div className="compare-content">
          <div className="compare-box">
            <h3>Uber</h3>
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber Logo" className="service-logo" />
            {uber.map((car, index) => (
              <div
                key={index}
                className={`car ${selectedService === `Uber ${car.service} ${car.fare}` ? 'selected' : ''}`}
                onClick={() => handleSelectService(`Uber ${car.service} ${car.fare}`)}
              >
                <img src={car.imgUrl} alt={car.service} className="car-img" />
                <div className="car-details">
                  <span className="service">{car.service}</span>
                  <span className="details">{car.details}</span>
                  <span className="time">{car.time}</span>
                  <span className="fare">₹{car.fare?.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="compare-box">
            <h3>Ola</h3>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGfpXJEukauSGD7cV6jEloG_APEYiWhDwieg&s" alt="Ola Logo" className="service-logo" />
            {ola.map((car, index) => (
              <div
                key={index}
                className={`car ${selectedService === `Ola ${car.service} ${car.fare}` ? 'selected' : ''}`}
                onClick={() => handleSelectService(`Ola ${car.service} ${car.fare}`)}
              >
                <img src={car.imgUrl} alt={car.service} className="car-img" />
                <div className="car-details">
                  <span className="service">{car.service}</span>
                  <span className="details">{car.details}</span>
                  <span className="time">{car.time}</span>
                  <span className="fare">₹{car.fare?.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="compare-box">
            <h3>Rapido</h3>
            <img src="https://1000logos.net/wp-content/uploads/2023/09/Rapido-Logo.jpg" alt="Rapido Logo" className="service-logo" />
            {rapido.map((car, index) => (
              <div
                key={index}
                className={`car ${selectedService === `Rapido ${car.service} ${car.fare}` ? 'selected' : ''}`}
                onClick={() => handleSelectService(`Rapido ${car.service} ${car.fare}`)}
              >
                <img src={car.imgUrl} alt={car.service} className="car-img" />
                <div className="car-details">
                  <span className="service">{car.service}</span>
                  <span className="details">{car.details}</span>
                  <span className="time">{car.time}</span>
                  <span className="fare">₹{car.fare?.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="button-container">
          <button
            className="book"
            disabled={!selectedService}
            onClick={handleBookNow}
          >
            {selectedService ? `Book ${selectedService}` : 'BOOK'}
          </button>
          {selectedService && (
            <button
              className="cancel"
              onClick={handleCancelRide}
            >
              Cancel Ride
            </button>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default ComparePage;