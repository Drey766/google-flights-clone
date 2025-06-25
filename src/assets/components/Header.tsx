import React, { useState, useEffect } from 'react';
import './Header.css';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Close menu when clicking outside or on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 640) {
        setIsMenuOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const header = document.querySelector('.header');
      if (header && !header.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="logo">
        <span>✈️</span> Flights
      </div>
      
      <button 
        className="menu-toggle"
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
        aria-expanded={isMenuOpen}
      >
        {isMenuOpen ? '✕' : '☰'}
      </button>
      
      <nav className={`nav ${isMenuOpen ? 'open' : ''}`} role="navigation" aria-label="Main navigation">
        <a href="#" onClick={closeMenu}>Flights</a>
        <a href="#" onClick={closeMenu}>Hotels</a>
        <a href="#" onClick={closeMenu}>Cars</a>
      </nav>
    </header>
  );
};

export default Header;