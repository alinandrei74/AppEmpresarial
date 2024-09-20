import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Aside.css';

const Aside = ({ userData }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname.includes(path) ? 'active-link' : '';
  };

  const toggleAside = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="menu-icon" onClick={toggleAside}>☰</div>
      <aside className={`aside ${isOpen ? 'open' : ''}`}>
        <nav>
          <ul className="aside-items">
            <li>
              <Link to="/user-profile/tasks" className={isActive('/user-profile/tasks')}>Tasks</Link>
            </li>
            <li>
              <Link to="/user-profile/notes" className={isActive('/user-profile/notes')}>Notes</Link>
            </li>
            <li>
              <Link to="/user-profile/calendar" className={isActive('/user-profile/calendar')}>Calendar</Link>
            </li>
            <li>
              <Link to="/user-profile/tourist-places" className={isActive('/user-profile/tourist-places')}>Tourist Places</Link>
            </li>
            {userData.role === 'admin' && (
              <>
                <li>
                  <Link to="/user-profile/create-profile" className={isActive('/user-profile/create-profile')}>Create Profile</Link>
                </li>
                <li>
                  <Link to="/user-profile/user-management" className={isActive('/user-profile/user-management')}>User Management</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Aside;