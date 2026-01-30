import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.less';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const phoneNumber = import.meta.env.VITE_RESTAURANT_PHONE || '+421918175571';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuClosing, setIsMenuClosing] = useState(false);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    if (isMobileMenuOpen) {
      handleMenuClose();
    }
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleMenuClose = () => {
    setIsMenuClosing(true);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsMenuClosing(false);
    }, 500); // Wait for animations to complete
  };

  const handleMenuToggle = () => {
    if (isMobileMenuOpen) {
      handleMenuClose();
    } else {
      setIsMobileMenuOpen(true);
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isMobileMenuOpen) {
      handleMenuClose();
    }
    // If we're already on the main page, scroll to top
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Otherwise, Link will navigate to "/" naturally
  };

  const scrollToSection =
    (sectionId: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (isMobileMenuOpen) {
        handleMenuClose(); // Close mobile menu with animation
      }

      if (location.pathname === '/') {
        // We're on the main page, just scroll to the section
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Navigate to main page first, then scroll after navigation
        navigate('/');
        // Wait for navigation to complete, then scroll
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    };

  const menuItems = [
    { label: 'Pizza', id: 'pizza-menu' },
    { label: 'Burger', id: 'burger-menu' },
    { label: 'Langoš', id: 'langos-menu' },
    { label: 'Prílohy', id: 'prilohy-menu' },
  ];

  return (
    <>
      <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
        <div className="container">
          <div className="header__container">
            <Link to="/" className="header__logo" onClick={handleLogoClick}>
              <span className="header__logo-text">
                <img src="/images/logo-pohoda.svg" alt="Pizza Pohoda" />
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="header__nav-pill">
              <nav
                className="header__nav"
                role="navigation"
                aria-label="Hlavná navigácia"
              >
                <div
                  className="header__nav-dropdown"
                  onMouseEnter={() => setIsMenuDropdownOpen(true)}
                  onMouseLeave={() => setIsMenuDropdownOpen(false)}
                >
                  <Link
                    to="/"
                    onClick={scrollToSection('pizza-menu')}
                    className={`header__nav-link ${
                      location.pathname === '/' ? 'header__nav-link--active' : ''
                    }`}
                  >
                    Menu
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="header__nav-arrow">
                      <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                  <div className={`header__dropdown-menu ${isMenuDropdownOpen ? 'header__dropdown-menu--visible' : ''}`}>
                    {menuItems.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={scrollToSection(item.id)}
                        className="header__dropdown-item"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
                <a
                  href="#about"
                  onClick={scrollToSection('about')}
                  className="header__nav-link"
                >
                  O nás
                </a>
                <a
                  href="#contact"
                  onClick={scrollToSection('contact')}
                  className="header__nav-link"
                >
                  Kontakt
                </a>
                <Link
                  to="/cart"
                  className={`header__nav-link ${
                    location.pathname === '/cart'
                      ? 'header__nav-link--active'
                      : ''
                  }`}
                >
                  Online Objednávka
                </Link>
              </nav>
            </div>

            <a
              href={`tel:${phoneNumber}`}
              className="header__call-button"
              aria-label="Zavolať"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Hamburger Button - Rendered outside header - Hidden on cart page */}
      {location.pathname !== '/cart' && (
        <button
          className={`header__hamburger ${isMobileMenuOpen ? 'header__hamburger--open' : ''}`}
          onClick={handleMenuToggle}
          aria-label="Menu"
        >
          <span className="header__hamburger-line"></span>
          <span className="header__hamburger-line"></span>
        </button>
      )}

      {/* Mobile Menu - Rendered outside header */}
      {isMobileMenuOpen && (
        <>
          <div className={`header__mobile-bg header__mobile-bg--white ${isMenuClosing ? 'header__mobile-bg--closing' : ''}`}></div>
          <div className={`header__mobile-bg header__mobile-bg--orange ${isMenuClosing ? 'header__mobile-bg--closing' : ''}`}></div>
          <nav className={`header__mobile-menu ${isMenuClosing ? 'header__mobile-menu--closing' : ''}`}>
            <div className="header__mobile-menu-content">
              <Link to="/" className="header__mobile-menu-logo" onClick={handleLogoClick}>
                <img src="/images/logo-pohoda-white.svg" alt="Pizza Pohoda" />
              </Link>

              <div className="header__mobile-menu-section">
                <span className="header__mobile-menu-label">Menu</span>
                {menuItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={scrollToSection(item.id)}
                    className="header__mobile-menu-sublink"
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              <a
                href="#about"
                onClick={scrollToSection('about')}
                className="header__mobile-menu-link"
              >
                O nás
              </a>

              <a
                href="#contact"
                onClick={scrollToSection('contact')}
                className="header__mobile-menu-link"
              >
                Kontakt
              </a>

              <Link
                to="/cart"
                className="header__mobile-menu-link"
              >
                Online Objednávka
              </Link>
            </div>
          </nav>
        </>
      )}
    </>
  );
};

export default Header;
