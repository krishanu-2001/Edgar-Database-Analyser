import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/base/molecules/sidebar';
import DashboardLayout from './Dashboard';
import Searchbar from '../base/atoms/Searchbar';
import Context from '../../context/context-config';
import { useNavigate } from 'react-router-dom';

const AppLayout = () => {
  const myContext = useContext(Context);
  const navigate = useNavigate();
  const curCompany = myContext.selectedCompanies;
  if (!curCompany) {
    navigate('/app');
  }
  return (
    <div className="flex h-screen overflow-hidden bg-saas-background text-saas-accent ">
      <div className="flex h-full">
        <Sidebar />
      </div>
      <div className="flex flex-col h-full w-full   overflow-x-hidden ">
        <DashboardLayout cta={<Searchbar style_prop={{ width: '450px' }} />}>
          <Outlet />
        </DashboardLayout>
      </div>
    </div>
  );
};

export default AppLayout;
