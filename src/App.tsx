import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './context/CartContext';
import Header from './sections/Header/Header';
import PizzaMain from './views/PizzaMain/PizzaMain';
import PizzaCart from './views/PizzaCart/PizzaCart';
import ThankYou from './views/ThankYou/ThankYou';
import PrivacyPolicy from './views/PrivacyPolicy/PrivacyPolicy';
import FloatingCart from './components/FloatingCart/FloatingCart';
import FloatingCall from './components/FloatingCall/FloatingCall';
import OrderingStatusBanner from './components/OrderingStatusBanner/OrderingStatusBanner';
import CookieConsent from './components/CookieConsent/CookieConsent';
import { setDefaultConsent, initGA, trackPageView } from './utils/analytics';
import './styles/global.less';

// Component to handle page tracking
const PageTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
};

const App: React.FC = () => {
  const [isBannerVisible, setIsBannerVisible] = useState(false);

  useEffect(() => {
    // Set default consent before any tracking
    setDefaultConsent();

    // Check if user has already consented, then initialize GA
    const consent = localStorage.getItem('cookie-consent');
    if (consent === 'accepted') {
      initGA();
    }
  }, []);

  return (
    <HelmetProvider>
      <CartProvider>
        <Router>
          <PageTracker />
          <div className="app">
            <Header />
            <OrderingStatusBanner onVisibilityChange={setIsBannerVisible} />
            <main>
              <Routes>
                <Route path="/" element={<PizzaMain />} />
                <Route path="/cart" element={<PizzaCart />} />
                <Route path="/thank-you" element={<ThankYou />} />
                <Route path="/ochrana-osobnych-udajov" element={<PrivacyPolicy />} />
              </Routes>
            </main>
            <FloatingCart bannerVisible={isBannerVisible} />
            <FloatingCall bannerVisible={isBannerVisible} />
            <CookieConsent />
          </div>
        </Router>
      </CartProvider>
    </HelmetProvider>
  );
};

export default App;
