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
            <p>Skalité 172</p>
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
