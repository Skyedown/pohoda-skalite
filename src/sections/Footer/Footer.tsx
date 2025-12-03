import React from 'react';
import './Footer.less';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p className="footer__credits">
          Vytvoril{' '}
          <a 
            href="https://peterlehocky.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer__link"
          >
            Peter Lehocký
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
