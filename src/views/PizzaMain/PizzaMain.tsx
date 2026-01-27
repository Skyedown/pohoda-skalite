import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import type { Pizza, ProductType } from '../../types';
import { pizzas } from '../../data/pizzas';
import PizzaCard from '../../components/PizzaCard/PizzaCard';
import ProductModal from '../../components/ProductModal/ProductModal';
import Toast from '../../components/Toast/Toast';
import LaunchAnnouncementPopup from '../../components/LaunchAnnouncementPopup/LaunchAnnouncementPopup';
import BurgerSection from '../../sections/BurgerSection/BurgerSection';
import LangosSection from '../../sections/LangosSection/LangosSection';
import PrilohySection from '../../sections/PrilohySection/PrilohySection';
import DeliveryInfoSection from '../../sections/DeliveryInfoSection/DeliveryInfoSection';
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
  const [selectedFilter] = useState<ProductType | 'all'>('all');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Initialize GSAP animations
  const heroPizzaRef = useHeroPizzaAnimation();
  useAllMenuAnimations();

  // Only show pizzas in the top menu section
  const filteredItems =
    selectedFilter === 'all'
      ? pizzas
      : pizzas.filter((item) => item.type === selectedFilter);

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

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Pizza Pohoda',
    description:
      'Pizzeria a reštaurácia s donáškou v Skalitom. Špecializujeme sa na napoletánsku pizzu, burgre a langoše.',
    image: 'https://pizzapohoda.sk/images/logo-social.png',
    url: 'https://pizzapohoda.sk',
    telephone: '+421-XXX-XXX-XXX',
    priceRange: '€€',
    servesCuisine: ['Pizza', 'Italian', 'European'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Skalité',
      addressLocality: 'Skalité',
      addressRegion: 'Žilina',
      postalCode: '02314',
      addressCountry: 'SK',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 49.4167,
      longitude: 19.0167,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '11:00',
        closes: '22:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '12:00',
        closes: '22:00',
      },
    ],
    sameAs: ['https://www.facebook.com/profile.php?id=61585409280116'],
    hasMenu: {
      '@type': 'Menu',
      hasMenuSection: [
        {
          '@type': 'MenuSection',
          name: 'Pizza',
          description: 'Naše výborné pizze pripravené z čerstvých surovín',
        },
        {
          '@type': 'MenuSection',
          name: 'Burgre & Langoše',
          description: 'Šťavnaté burgre a chrumkavé langoše',
        },
      ],
    },
    acceptsReservations: false,
    paymentAccepted: 'Cash, Card',
  };

  return (
    <div className="pizza-main">
      <Helmet>
        <title>Pizza Pohoda - Pizza, Burger & Langos | Skalité</title>
        <meta
          name="description"
          content="Pizza Pohoda - Najlepšia napoletánska pizza, burgre a lángoše v Skalitom. Donáška zadarmo do Skalitého, Čierneho, Oščadnice a Svrčinovca. Čerstvé ingrediencie a tradičná príprava."
        />
        <meta
          name="keywords"
          content="pizza pohoda, pizza Skalité, burger Skalité, lángoš Skalité, pizzeria Skalité, rozvoz jedla Skalité, napoletánska pizza, donáška pizze zadarmo, pizza Čierne, pizza Oščadnica"
        />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* Launch Announcement Popup */}
      <LaunchAnnouncementPopup />

      {/* Hero Section */}
      <section className="pizza-main__hero">
        <div className="container">
          <div className="pizza-main__hero-content">
            <h1 className="pizza-main__title">Pizza? V Pohode!</h1>
            <p className="pizza-main__subtitle">
              Vyskúšaj pravé chrumkavé a nadýchané neapolské cesto u nás alebo
              ti pizzu dovezieme až domov!
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
            src="/images/large-hero-pizza.png"
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
            id="pizza-menu"
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

      {/* Burger Section */}
      <BurgerSection />

      {/* Langoš Section */}
      <LangosSection />

      {/* Prílohy Section */}
      <PrilohySection />

      {/* Delivery Info Section */}
      <DeliveryInfoSection />

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

      {/* Product Modal */}
      <ProductModal
        product={selectedPizza}
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
