import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartIcon from '../CartIcon/CartIcon';
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
      <CartIcon width={32} height={32} />
      
      <span className="floating-cart__badge">{itemsCount}</span>
    </Link>
  );
};

export default FloatingCart;
