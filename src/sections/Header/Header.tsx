import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.less';
import { scrollTo } from '../../utils/scroll';

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="container">
        <div className="header__container">
          <Link to="/" className="header__logo">
            <span className="header__logo-text">🍕</span>
          </Link>

          <div className="header__nav-pill">
            <nav
              className="header__nav"
              role="navigation"
              aria-label="Hlavná navigácia"
            >
              <Link
                to="/"
                className={`header__nav-link ${
                  location.pathname === '/' ? 'header__nav-link--active' : ''
                }`}
              >
                Menu
              </Link>
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
              <a
                href="#about"
                // onClick={() => scrollTo('#about')}
                className="header__nav-link"
              >
                O nás
              </a>
              <a
                href="#contact"
                // onClick={() => scrollTo('#contact')}
                className="header__nav-link"
              >
                Kontakt
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
