import React from 'react';
import './TestimonialsSection.less';

const testimonials = [
  {
    id: 1,
    name: 'Martin A.',
    rating: 5,
    text: 'Najlepšia pizza na Kysuciach! Vždy čerstvá, chrumkavá a chutná. Odporúčam každému!',
  },
  {
    id: 2,
    name: 'Lucia K.',
    rating: 5,
    text: 'Úžasná a rýchla obsluha. Pizza bola perfektná, určite prídeme znova.',
  },
  {
    id: 3,
    name: 'Samuel L.',
    rating: 5,
    text: 'Skvelé ceny a výborná kvalita. Burgre sú tiež fantastické. Naša nová obľúbená pizzeria!',
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="testimonials-section">
      <div className="container">
        <h2 className="testimonials-section__title">
          ...a vedia to aj naší zákazníci
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
