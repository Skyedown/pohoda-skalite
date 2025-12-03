import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './context/CartContext';
import Header from './sections/Header/Header';
import PizzaMain from './views/PizzaMain/PizzaMain';
import PizzaCart from './views/PizzaCart/PizzaCart';
import FloatingCart from './components/FloatingCart/FloatingCart';
import './styles/global.less';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <CartProvider>
        <Router>
          <div className="app">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<PizzaMain />} />
                <Route path="/cart" element={<PizzaCart />} />
              </Routes>
            </main>
            <FloatingCart />
          </div>
        </Router>
      </CartProvider>
    </HelmetProvider>
  );
};

export default App;
