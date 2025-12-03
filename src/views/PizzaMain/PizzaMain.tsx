import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import type { Pizza, ProductType } from '../../types';
import { menuItems } from '../../data/menu';
import PizzaCard from '../../components/PizzaCard/PizzaCard';
import PizzaModal from '../../components/PizzaModal/PizzaModal';
import Toast from '../../components/Toast/Toast';
import BurgerSection from '../../sections/BurgerSection/BurgerSection';
import DrinksSection from '../../sections/DrinksSection/DrinksSection';
import LocationSection from '../../sections/LocationSection/LocationSection';
import QualitySection from '../../sections/QualitySection/QualitySection';
import TestimonialsSection from '../../sections/TestimonialsSection/TestimonialsSection';
import ContactSection from '../../sections/ContactSection/ContactSection';
import Footer from '../../sections/Footer/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollTo } from '../../utils/scroll';
import {
  useHeroPizzaAnimation,
  useAllMenuAnimations,
} from '../../hooks/useGsapAnimations';
import './PizzaMain.less';

gsap.registerPlugin(ScrollTrigger);

const PizzaMain: React.FC = () => {
  const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<ProductType | 'all'>(
    'all'
  );
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Initialize GSAP animations
  const heroPizzaRef = useHeroPizzaAnimation();
  useAllMenuAnimations();

  const filteredItems =
    selectedFilter === 'all'
      ? menuItems
      : menuItems.filter((item) => item.type === selectedFilter);

  const handleAddToCart = (pizza: Pizza) => {
    setSelectedPizza(pizza);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedPizza(null), 300);
  };

  const handlePizzaAddedToCart = (pizzaName: string) => {
    setToastMessage(`${pizzaName} pridaný do košíka!`);
    setShowToast(true);
  };

  return (
    <div className="pizza-main">
      <Helmet>
        <title>Pohoda Skalite - Pizzeria, Burger & Lángoš | Skalité</title>
        <meta
          name="description"
          content="Najlepšia napoletánska pizza, burgre a lángoše v Skalitom. Rýchle dodanie do Skalitého, Čierneho a Svrčinovca. Čerstvé ingrediencie a tradičná príprava."
        />
        <meta
          name="keywords"
          content="pizza Skalité, burger Skalité, lángoš Skalité, pizzeria Skalité, rozvoz jedla Skalité, napoletánska pizza"
        />
      </Helmet>

      {/* Hero Section */}
      <section className="pizza-main__hero">
        <div className="container">
          <div className="pizza-main__hero-content">
            <h1 className="pizza-main__title">Všetko je lepšie s pizzou</h1>
            <p className="pizza-main__subtitle">
              Vyskúšajte našu domácu pizzu, ktorú pre Vás pripravujeme priamo v
              srdci Kysúc.
            </p>
            <button
              className="pizza-main__cta-button"
              onClick={() => scrollTo('#pizza-menu')}
            >
              Objednaj si pizzu
            </button>
          </div>
        </div>
        {/* Hero Pizza with rotation animation */}
        <div className="pizza-main__hero-pizza" ref={heroPizzaRef}>
          <img
            src="/images/hero-pizza.png"
            alt="Otáčajúca sa pizza"
            className="pizza-main__hero-pizza-image"
          />
        </div>
      </section>

      {/* Pizza Menu Section with Crumbs */}
      <section id="pizza-menu" className="pizza-main__menu-section">
        <div className="container">
          <div className="pizza-main__menu-header">
            <p className="pizza-main__menu-subtitle">Nájdi tú pravú pre seba</p>
            <h2 className="pizza-main__menu-title">Pizza Menu</h2>
          </div>

          <div
            className="pizza-main__grid"
            role="list"
            aria-label="Položky menu"
          >
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="pizza-main__grid-item"
                role="listitem"
              >
                <PizzaCard pizza={item} onAddToCart={handleAddToCart} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Burger & Langoš Section */}
      <BurgerSection />

      {/* Drinks & Snacks Section */}
      <DrinksSection />

      {/* Location & Hours Section */}
      <LocationSection />

      {/* Quality Section - "Záleží nám na kvalite" */}
      <QualitySection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer with Credits */}
      <Footer />

      {/* Pizza Modal */}
      <PizzaModal
        pizza={selectedPizza}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddToCart={handlePizzaAddedToCart}
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default PizzaMain;
