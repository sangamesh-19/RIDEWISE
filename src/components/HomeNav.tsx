import React from 'react';
import { NavLink } from 'react-router-dom';

interface NavItems {
  name: string;
  path: string;
}

const HomeNav: React.FC = () => {
  const navItems: NavItems[] = [
    { name: 'Sign In', path: '/Login' },
  ];

  return (
    <nav className="navbar">
      <h2 className="navbar-logo">RideWise</h2>
      <ul className="navbar-list">
        {/* Render other navbar items here if needed */}
      </ul>
      <ul className="navbar-list navbar-right"> {/* Add navbar-right class here */}
        {navItems.map((item, index) => (
          <li key={index} className="navbar-item">
            <NavLink
              to={item.path}
              className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}
              end // Add end for home page
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default HomeNav;
