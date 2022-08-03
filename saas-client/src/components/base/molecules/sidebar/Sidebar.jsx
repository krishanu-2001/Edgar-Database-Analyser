import React, { useContext } from 'react';

import SidebarLogo from './SidebarLogo';
import SidebarTopItem from './SidebarTopItem';
import SidebarBottomItem from './SidebarBottomItem';
import CompanyProfile from './CompanyProfile';
import Context from '../../../../context/context-config';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const myContext = useContext(Context);
  const curCompany = myContext.selectedCompanies[0];
  const navigate = useNavigate();
  console.log('cur', curCompany);
  return (
    <div className="flex flex-col items-center justify-between w-80 h-full overflow-hidden bg-saas-accent text-saas-main pr-3 pl-3">
      <div className="w-full">
        <SidebarLogo />
        <div className="flex flex-col w-full pl-2 items-center mt-2 border-t border-saas-header">
          {curCompany ? (
            <CompanyProfile onClick={() => navigate('/info')}>
              <div className="text-lg">{curCompany.CompanyName}</div>
            </CompanyProfile>
          ) : null}
          <div className="flex flex-col w-full pl-3 items-center">
            <SidebarTopItem to="/charts" icon="chart-line">
              Charts
            </SidebarTopItem>
            <SidebarTopItem to="/analysis" icon="brain">
              Analysis
            </SidebarTopItem>
            <SidebarTopItem to="/secfilling" icon="database">
              SEC Fillings
            </SidebarTopItem>
            <SidebarTopItem to="/summary" icon="file-lines">
              8K Summary
            </SidebarTopItem>
          </div>
        </div>
      </div>
      {curCompany && curCompany.score && curCompany.score.length && (
        <div
          onClick={() => navigate('/info')}
          className="flex flex-col justify-center items-center pt-10 cursor-pointer"
        >
          <div className="text-2xl font-bold ">Investability Score</div>
          <SidebarBottomItem
            score={curCompany.score[curCompany.score.length - 1].score}
          />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
