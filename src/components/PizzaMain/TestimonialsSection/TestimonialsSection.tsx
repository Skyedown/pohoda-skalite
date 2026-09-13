import React from 'react';
import { useLocale } from '../../../i18n/LocaleContext';
import './TestimonialsSection.less';

const TestimonialsSection: React.FC = () => {
  const { t } = useLocale();

  const testimonials = [
    { id: 1, name: t('testimonial_1_name'), text: t('testimonial_1_text') },
    { id: 2, name: t('testimonial_2_name'), text: t('testimonial_2_text') },
    { id: 3, name: t('testimonial_3_name'), text: t('testimonial_3_text') },
  ];

  return (
    <section className="testimonials-section">
      <div className="container">
        <h2 className="testimonials-section__title">
          {t('testimonials_title')}
        </h2>

        <div className="testimonials-section__grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-card__stars">
                <img src="/images/5stars.svg" alt="5 stars" />
              </div>
              <h3 className="testimonial-card__name">{testimonial.name}</h3>
              <p className="testimonial-card__text">{testimonial.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
