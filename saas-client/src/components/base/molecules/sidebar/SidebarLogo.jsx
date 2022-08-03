import React from 'react';

import Logo from '@/assets/img/logo512.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SidebarLogo = () => {
  return (
    <a
      href="/app"
      className="flex items-center content-center justify-center pt-5 pb-5 text-white"
    >
      <FontAwesomeIcon
        fontSize={60}
        height={60}
        width={60}
        icon={'chart-pie'}
      />
    </a>
  );
};

export default SidebarLogo;
