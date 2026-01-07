import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './FloatingCart.less';

interface FloatingCartProps {
  bannerVisible?: boolean;
}

const FloatingCart: React.FC<FloatingCartProps> = ({ bannerVisible = false }) => {
  const { cart } = useCart();
  const location = useLocation();

  const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Don't show if cart is empty or on cart page
  if (itemsCount === 0 || location.pathname === '/cart') {
    return null;
  }

  return (
    <Link
      to="/cart"
      className={`floating-cart ${bannerVisible ? 'floating-cart--with-banner' : ''}`}
      aria-label={`Košík s ${itemsCount} položkami`}
    >
      <svg 
        width="32" 
        height="32" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1"/>
        <circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
      
      <span className="floating-cart__badge">{itemsCount}</span>
    </Link>
  );
};

export default FloatingCart;
