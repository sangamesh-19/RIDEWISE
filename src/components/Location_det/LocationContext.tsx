import React, { createContext, useState, ReactNode } from 'react';

interface LocationContextProps {
  pickupLocation: string | null;
  setPickupLocation: (location: string | null) => void;
  destinationLocation: string | null;
  setDestinationLocation: (location: string | null) => void;
}

export const LocationContext = createContext<LocationContextProps>({
  pickupLocation: null,
  setPickupLocation: () => {},
  destinationLocation: null,
  setDestinationLocation: () => {},
});

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pickupLocation, setPickupLocation] = useState<string | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<string | null>(null);

  return (
    <LocationContext.Provider value={{ pickupLocation, setPickupLocation, destinationLocation, setDestinationLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
