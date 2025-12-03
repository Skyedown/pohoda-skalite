import React from 'react';
import './LocationSection.less';

const LocationSection: React.FC = () => {
  return (
    <section className="location-section">
      <div className="container">
        <div className="location-section__content">
          <div className="location-section__image">
            <img src="/images/shop.png" alt="Pizza Pohoda" />
          </div>
          <div className="location-section__info">
            <h2 className="location-section__title">Pizza Pohoda</h2>
            <p className="location-section__address">Skalité 172, 023 14</p>

            <h3 className="location-section__hours-title">Otváracie hodiny</h3>
            <div className="location-section__hours">
              <div className="location-section__hours-row">
                <span>Po - Pi</span>
                <span>8:00 - 18:00</span>
              </div>
              <div className="location-section__hours-row">
                <span>So</span>
                <span>10:00 - 18:00</span>
              </div>
              <div className="location-section__hours-row">
                <span>Ne</span>
                <span>12:00 - 18:00</span>
              </div>
            </div>

            <a
            target='blank'
              href="https://maps.app.goo.gl/AykejpnffCGyhjin6"
              className="location-section__map-button"
            >
              <svg width="23" height="23" viewBox="0 0 23 23" fill="none">
                <path
                  d="M11.5 2C8.5 2 6 4.5 6 7.5C6 12 11.5 19 11.5 19C11.5 19 17 12 17 7.5C17 4.5 14.5 2 11.5 2ZM11.5 10C10.12 10 9 8.88 9 7.5C9 6.12 10.12 5 11.5 5C12.88 5 14 6.12 14 7.5C14 8.88 12.88 10 11.5 10Z"
                  fill="white"
                />
              </svg>
              Zobraziť na mape
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
