// src/Home.tsx

import React from 'react';
import HomeNav from '../components/HomeNav';
const Home: React.FC = () => {
  
  return (
    
    <div className="home-container">
        <HomeNav />
    <div className='home-content'>
      <div className="justified-text">
        <h3>
          Search and Compare cabs from 
           <br />Uber, Ola and Rapido  
          in one go
        </h3>
        <h5>The best ride, every time</h5>
      
      </div>
    </div>
    {/* <About/> */}
    </div>

  );
};


export default Home;
