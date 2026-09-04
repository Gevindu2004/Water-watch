import React, { createContext, useContext, useState, useEffect } from 'react';

const DistrictContext = createContext();

export const DRY_ZONE_DISTRICTS = [
  { id: 'All', name: 'All Dry Zone Districts', region: 'Sri Lanka Nationwide' },
  { id: 'Polonnaruwa', name: 'Polonnaruwa', region: 'North Central Province' },
  { id: 'Anuradhapura', name: 'Anuradhapura', region: 'North Central Province' },
  { id: 'Hambantota', name: 'Hambantota', region: 'Southern Province' },
  { id: 'Puttalam', name: 'Puttalam', region: 'North Western Province' },
  { id: 'Mannar', name: 'Mannar', region: 'Northern Province' },
  { id: 'Vavuniya', name: 'Vavuniya', region: 'Northern Province' },
  { id: 'Mullaitivu', name: 'Mullaitivu', region: 'Northern Province' },
  { id: 'Kilinochchi', name: 'Kilinochchi', region: 'Northern Province' },
  { id: 'Jaffna', name: 'Jaffna', region: 'Northern Province' },
  { id: 'Trincomalee', name: 'Trincomalee', region: 'Eastern Province' },
  { id: 'Batticaloa', name: 'Batticaloa', region: 'Eastern Province' },
  { id: 'Ampara', name: 'Ampara', region: 'Eastern Province' },
  { id: 'Moneragala', name: 'Moneragala', region: 'Uva Province' }
];

export function DistrictProvider({ children }) {
  const [selectedDistrict, setSelectedDistrict] = useState(() => {
    return localStorage.getItem('waterwatch_selected_district') || 'All';
  });

  useEffect(() => {
    localStorage.setItem('waterwatch_selected_district', selectedDistrict);
  }, [selectedDistrict]);

  return (
    <DistrictContext.Provider value={{ selectedDistrict, setSelectedDistrict, DRY_ZONE_DISTRICTS }}>
      {children}
    </DistrictContext.Provider>
  );
}

export function useDistrict() {
  const context = useContext(DistrictContext);
  if (!context) {
    throw new Error('useDistrict must be used within a DistrictProvider');
  }
  return context;
}

export default DistrictContext;
