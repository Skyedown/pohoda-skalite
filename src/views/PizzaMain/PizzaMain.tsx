import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import type { LocalizedProduct } from '../../types';
import {
  usePizzas,
  useCapovane,
  useDrinks,
  useSnacks,
} from '../../hooks/useMenu';
import { useAdminSettings } from '../../hooks/useAdminSettings';
import { useLocale } from '../../i18n/LocaleContext';
import { isProductDisabled } from '../../utils/productAvailability';
import {
  buildAlternates,
  buildDeliverySchema,
  buildRestaurantSchema,
  canonicalUrl,
} from '../../utils/seo';
import ProductCard from '../../components/PizzaMain/ProductCard/ProductCard';
import ProductModal from '../../components/PizzaMain/ProductModal/ProductModal';
import Toast from '../../components/shared/Toast/Toast';
import OrderOverloadModal from '../../components/PizzaMain/OrderOverloadModal/OrderOverloadModal';
import BurgerSection from '../../components/PizzaMain/BurgerSection/BurgerSection';
import LangosSection from '../../components/PizzaMain/LangosSection/LangosSection';
import PrilohySection from '../../components/PizzaMain/PrilohySection/PrilohySection';
import SimpleProductSection from '../../components/PizzaMain/SimpleProductSection/SimpleProductSection';
import DeliveryInfoSection from '../../components/PizzaMain/DeliveryInfoSection/DeliveryInfoSection';
import LocationSection from '../../components/PizzaMain/LocationSection/LocationSection';
import QualitySection from '../../components/PizzaMain/QualitySection/QualitySection';
import TestimonialsSection from '../../components/PizzaMain/TestimonialsSection/TestimonialsSection';
import ContactSection from '../../components/PizzaMain/ContactSection/ContactSection';
import Footer from '../../components/PizzaMain/Footer/Footer';
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
  const { t, locale } = useLocale();
  const adminSettings = useAdminSettings();
  const pizzas = usePizzas();
  const capovane = useCapovane();
  const drinks = useDrinks();
  const snacks = useSnacks();

  const [selectedPizza, setSelectedPizza] = useState<LocalizedProduct | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showOverloadModal, setShowOverloadModal] = useState(false);

  const heroPizzaRef = useHeroPizzaAnimation();
  useAllMenuAnimations();

  useEffect(() => {
    if (adminSettings.mode !== 'off') {
      setShowOverloadModal(true);
    }
  }, [adminSettings.mode]);

  const handleAddToCart = useCallback((pizza: LocalizedProduct) => {
    setSelectedPizza(pizza);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedPizza(null), 300);
  }, []);

  const handlePizzaAddedToCart = useCallback(
    (pizzaName: string) => {
      setToastMessage(t('product_added_toast', { name: pizzaName }));
      setShowToast(true);
    },
    [t],
  );

  const restaurantSchema = useMemo(
    () => buildRestaurantSchema(locale, t),
    [locale, t],
  );

  const deliverySchema = useMemo(
    () =>
      buildDeliverySchema(
        adminSettings.deliveryCities[locale].map((city) => city.name),
        locale,
      ),
    [adminSettings.deliveryCities, locale],
  );

  const alternates = useMemo(() => buildAlternates({ sk: '/', pl: '/' }), []);

  return (
    <div className="pizza-main">
      <Helmet>
        <title>{t('seo_home_title')}</title>
        <meta name="description" content={t('seo_home_description')} />
        <meta name="keywords" content={t('seo_home_keywords')} />
        <meta property="og:title" content={t('seo_home_title')} />
        <meta property="og:description" content={t('seo_home_description')} />
        <meta property="og:url" content={canonicalUrl(locale, '/')} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={canonicalUrl(locale, '/')} />
        {alternates.map((alternate) => (
          <link
            key={alternate.hrefLang}
            rel="alternate"
            hrefLang={alternate.hrefLang}
            href={alternate.href}
          />
        ))}
        <script type="application/ld+json">
          {JSON.stringify(restaurantSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(deliverySchema)}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="pizza-main__hero">
        <div className="container">
          <div className="pizza-main__hero-content">
            <h1 className="pizza-main__title">{t('hero_title')}</h1>
            <p className="pizza-main__subtitle">{t('hero_subtitle')}</p>
            <button
              className="pizza-main__cta-button"
              onClick={() => scrollTo('#pizza-menu')}
            >
              {t('hero_cta')}
            </button>
          </div>
        </div>
        <div className="pizza-main__hero-pizza" ref={heroPizzaRef}>
          <img
            src="/images/large-hero-pizza.png"
            alt="Pizza Pohoda"
            className="pizza-main__hero-pizza-image"
          />
        </div>
      </section>

      {/* Pizza Menu Section */}
      <section id="pizza-menu" className="pizza-main__menu-section">
        <div className="container">
          <div className="pizza-main__menu-header">
            <p className="pizza-main__menu-subtitle">{t('menu_subtitle')}</p>
            <h2 className="pizza-main__menu-title">{t('menu_title')}</h2>
          </div>

          <div
            className="pizza-main__grid"
            role="list"
            aria-label={t('menu_aria_items')}
          >
            {pizzas.map((item) => (
              <div
                key={item.id}
                className="pizza-main__grid-item"
                role="listitem"
              >
                <ProductCard
                  product={item}
                  onAddToCart={handleAddToCart}
                  isDisabled={isProductDisabled(item, adminSettings)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <BurgerSection />
      <LangosSection />
      <PrilohySection />

      <SimpleProductSection
        id="capovane-menu"
        title={t('section_tap_title')}
        subtitle={t('section_tap_subtitle')}
        items={capovane}
      />

      <SimpleProductSection
        id="drinks-menu"
        title={t('section_drinks_title')}
        items={drinks}
      />

      <SimpleProductSection
        id="snacks-menu"
        title={t('section_snacks_title')}
        items={snacks}
      />

      <DeliveryInfoSection />
      <LocationSection />
      <QualitySection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />

      <ProductModal
        product={selectedPizza}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddToCart={handlePizzaAddedToCart}
        isDisabled={
          selectedPizza
            ? isProductDisabled(selectedPizza, adminSettings)
            : false
        }
      />

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      <OrderOverloadModal
        isOpen={showOverloadModal}
        onClose={() => setShowOverloadModal(false)}
        mode={adminSettings.mode}
        waitTimeMinutes={adminSettings.waitTimeMinutes}
        customNote={adminSettings.customNote[locale]}
        disabledReason={adminSettings.disabledReason[locale]}
      />
    </div>
  );
};

export default PizzaMain;
