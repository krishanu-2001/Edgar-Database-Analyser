import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SidebarTopItem = ({ icon, children, ...nativeProps }) => {
  return (
    <NavLink
      {...nativeProps}
      className={(navbar) =>
        'flex flex-row items-center w-full pt-3 pb-3 text-lg hover:text-saas-primary ' +
        (navbar.isActive ? 'text-saas-primary' : '')
      }
    >
      <div className="mr-5">{icon && <FontAwesomeIcon icon={icon} />}</div>
      {children}
    </NavLink>
  );
};

export default SidebarTopItem;
