import React from 'react';
import './ContactSection.less';

const ContactSection: React.FC = () => {
  const restaurantEmail = import.meta.env.VITE_RESTAURANT_EMAIL;
  const restaurantPhone = import.meta.env.VITE_RESTAURANT_PHONE;

  // Format phone for display (add spaces)
  const formattedPhone = restaurantPhone.replace(/(\+\d{3})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <h2 className="contact-section__title">Kontakt</h2>

        <div className="contact-section__grid">
          <div className="contact-section__column">
            <p>Skalité 1386</p>
            <p>023 14</p>
            <p>Pohoda Skalite, s.r.o.</p>
          </div>

          <div className="contact-section__column">
            <p>
              <strong>email:</strong>{' '}
              <a href={`mailto:${restaurantEmail}`}>{restaurantEmail}</a>
            </p>
            <p>
              <strong>Tel. č.:</strong>{' '}
              <a href={`tel:${restaurantPhone}`}>{formattedPhone}</a>
            </p>
            <div className="contact-section__social">
              <a
                href="https://www.instagram.com/pizzapohoda.sk?igsh=MWZieWI2bWRkaGFqYg%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-section__social-link"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61585409280116"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-section__social-link"
                aria-label="Facebook"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* <div className="contact-section__column">
            <p>FIRMA</p>
            <p>IČO:</p>
            <p>DIČ:</p>
            <p>IČ DPH:</p>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
