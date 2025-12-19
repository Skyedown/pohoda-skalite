import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.less';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const phoneNumber = import.meta.env.VITE_RESTAURANT_PHONE;

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
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

  return (
    <header className="header">
      <div className="container">
        <div className="header__container">
          <Link to="/" className="header__logo" onClick={handleLogoClick}>
            <span className="header__logo-text">
              <img src="/public/images/logo-pohoda.svg" alt="" />
            </span>
          </Link>

          <div className="header__nav-pill">
            <nav
              className="header__nav"
              role="navigation"
              aria-label="Hlavná navigácia"
            >
              <Link
                to="/"
                onClick={scrollToSection('pizza-menu')}
                className={`header__nav-link ${
                  location.pathname === '/' ? 'header__nav-link--active' : ''
                }`}
              >
                Menu
              </Link>
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
              </a>{' '}
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
  );
};

export default Header;
