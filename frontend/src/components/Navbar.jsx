import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from './LanguageContext';
import { NavLink, useLocation } from 'react-router-dom';
import logo from '../content/images/logo.png';

const Navbar = () => {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [menuHeight, setMenuHeight] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const menuRef = useRef(null);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen && menuRef.current) {
      setMenuHeight(menuRef.current.scrollHeight);
    } else {
      setMenuHeight(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };

  const navItems = [
    [
      { name: 'FEDERATION', path: '/federation' },
      { name: 'CALENDAR', path: '/calendar' },
      { name: 'TOURNAMENTS', path: '/tournaments' },
      { name: 'GALLERY', path: '/gallery' },
      { name: 'PARTNERS', path: '/partners' },
      { name: 'ARCHIVE', path: '/archive' },
      { name: 'CONTACTS', path: '/contact' }
    ],
    [
      { name: 'ფედერაცია', path: '/federation' },
      { name: 'კალენდარი', path: '/calendar' },
      { name: 'ტურნირები', path: '/tournaments' },
      { name: 'გალერეა', path: '/gallery' },
      { name: 'პარტნიორები', path: '/partners' },
      { name: 'არქივი', path: '/archive' },
      { name: 'კონტაქტი', path: '/contact' }
    ]
  ];

  const logoText = language === 'en' ? 'GSBF' : 'სსნფ';
  const navItemsForCurrentLanguage = language === 'en' ? navItems[0] : navItems[1];

  const isHomePage = location.pathname === '/';

  return (
    <nav className="fixed top-0 left-0 right-0 shadow-md z-50" style={{ backgroundColor: '#195c72' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 xl:h-[110px] mt-0">
          <div className="flex items-center space-x-2 group">
            <NavLink to="/" className="flex flex-col items-center">
              <img src={logo} alt="Logo" className="w-16" />
              <span
                className={`hidden xl:block text-white group-hover:text-hovercolor text-lg font-medium transition duration-300 ${
                  isHomePage ? '!text-hovercolor' : 'group-hover:text-hovercolor'
                }`}
              >
                {logoText}
              </span>
            </NavLink>
          </div>

          <div className="ml-10 hidden xl:flex items-center space-x-7">
            {navItemsForCurrentLanguage.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? 'text-hovercolor border-b-2 border-hovercolor font-medium transition duration-200 px-2 py-2 text-sm'
                    : 'text-white hover:text-hovercolor hover:border-b-2 hover:border-hovercolor font-medium transition duration-200 px-2 py-2 text-sm'
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          <div className="hidden xl:flex items-center space-x-4 ml-auto">
            <div className="text-white pr-4">
              <span>{formatTime(currentTime)}</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => changeLanguage('ka-GE')}
                className={`text-sm font-medium px-2 py-1 transition duration-200 ${
                  language === 'ka-GE' ? 'text-hovercolor border-b-2 border-hovercolor' : 'text-white hover:border-b-2 hover:border-hovercolor hover:text-hovercolor'
                }`}
              >
                GEO
              </button>
              <span className="text-white">|</span>
              <button
                onClick={() => changeLanguage('en')}
                className={`text-sm font-medium px-2 py-1 transition duration-200 ${
                  language === 'en' ? 'text-hovercolor border-b-2 border-hovercolor' : 'text-white hover:border-b-2 hover:border-hovercolor hover:text-hovercolor'
                }`}
              >
                ENG
              </button>
            </div>
          </div>

          <div className="xl:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        ref={menuRef}
        style={{ backgroundColor: '#195c72', maxHeight: menuHeight !== null ? `${menuHeight}px` : undefined }}
        className={`xl:hidden fixed inset-x-0 top-[70px] shadow-md transition-all duration-100 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="px-2 pt-4 pb-3 space-y-1 flex flex-col items-center">
          {navItemsForCurrentLanguage.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? 'text-hovercolor transition duration-200 px-2 py-2 rounded-md text-sm font-medium'
                  : 'text-white hover:text-hovercolor transition duration-200 px-2 py-2 rounded-md text-sm font-medium'
              }
            >
              {item.name}
            </NavLink>
          ))}

          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => changeLanguage('ka-GE')}
              className={`text-white hover:text-hovercolor transition duration-200 px-4 py-1 rounded-md text-sm font-medium ${
                language === 'ka-GE' ? 'text-hovercolor' : ''
              }`}
            >
              GEO
            </button>
            <span className="text-white">|</span>
            <button
              onClick={() => changeLanguage('en')}
              className={`text-white hover:text-hovercolor transition duration-200 px-4 py-1 rounded-md text-sm font-medium ${
                language === 'en' ? 'text-hovercolor' : ''
              }`}
            >
              ENG
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
