import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './context/CartContext';
import Header from './sections/Header/Header';
import PizzaMain from './views/PizzaMain/PizzaMain';
import PizzaCart from './views/PizzaCart/PizzaCart';
import PasswordProtection from './views/PasswordProtection/PasswordProtection';
import FloatingCart from './components/FloatingCart/FloatingCart';
import FloatingCall from './components/FloatingCall/FloatingCall';
import OrderingStatusBanner from './components/OrderingStatusBanner/OrderingStatusBanner';
import './styles/global.less';

const App: React.FC = () => {
  const isProtectionEnabled = import.meta.env.VITE_SITE_PROTECTION_ENABLED === 'true';
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    // Check if site was previously unlocked in this session
    if (sessionStorage.getItem('siteUnlocked') === 'true') {
      setIsUnlocked(true);
    }
  }, []);

  // If protection is enabled and site is not unlocked, show password protection
  if (isProtectionEnabled && !isUnlocked) {
    return (
      <HelmetProvider>
        <PasswordProtection onUnlock={() => setIsUnlocked(true)} />
      </HelmetProvider>
    );
  }

  return (
    <HelmetProvider>
      <CartProvider>
        <Router>
          <div className="app">
            <Header />
            <OrderingStatusBanner />
            <main>
              <Routes>
                <Route path="/" element={<PizzaMain />} />
                <Route path="/cart" element={<PizzaCart />} />
              </Routes>
            </main>
            <FloatingCart />
            <FloatingCall />
          </div>
        </Router>
      </CartProvider>
    </HelmetProvider>
  );
};

export default App;
