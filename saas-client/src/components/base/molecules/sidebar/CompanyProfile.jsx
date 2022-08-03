import React from 'react';

const CompanyProfile = ({ children, ...nativeProps }) => {
  return (
    <div
      {...nativeProps}
      className="flex items-center cursor-pointer justify-center w-full h-20 mt-5 rounded-2xl drop-shadow-lg mb-4 bg-saas-header transition hover:drop-shadow-xl hover:scale-105 duration-100"
    >
      {children}
    </div>
  );
};

export default CompanyProfile;
