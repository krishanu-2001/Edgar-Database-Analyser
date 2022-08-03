import React from 'react';

import RouteCrumb from '@/components/base/molecules/RouteCrumb';

const DashboardLayout = ({ description, cta, children }) => {
  return (
    <div className="flex flex-col h-full w-full p-5">
      <div className="flex justify-between items-center">
        <div>
          <RouteCrumb />
          <span className="text-xs">{description}</span>
        </div>
        {cta}
      </div>
      <div className="w-full grow">{children}</div>
    </div>
  );
};

export default DashboardLayout;
