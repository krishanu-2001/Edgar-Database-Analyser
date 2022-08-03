import React, { useContext } from 'react';
import Searchbar from '../base/atoms/Searchbar';

const LandingPage = () => {
  return (
    <div className="flex flex-col h-screen justify-center items-center bg-gradient-to-br from-saas-primary to-saas-accent">
      <div className="p-2 text-white text-5xl hover:drop-shadow-6xl font-serif">
        SEC Filing Analyzer for Saas Companies
      </div>
      <div className="p-2 text-white text-4xl font-serif">Team 17</div>
      <div className="p-4">
        <Searchbar style_prop={{ width: '350px' }} />
      </div>
    </div>
  );
};

export default LandingPage;
