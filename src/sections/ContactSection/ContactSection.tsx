import React from 'react';
import './ContactSection.less';

const ContactSection: React.FC = () => {
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
              <a href="mailto:pizza@pohodaskalite.sk">pizza@pohodaskalite.sk</a>
            </p>
            <p>
              <strong>Tel. č.:</strong>{' '}
              <a href="tel:+421 948 293 923">+421 948 293 923</a>
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
