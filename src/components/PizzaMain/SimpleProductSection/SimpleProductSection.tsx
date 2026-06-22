import React, { useCallback } from 'react';
import { useCart } from '../../../context/CartContext';
import { useAdminSettings } from '../../../hooks/useAdminSettings';
import { isProductDisabled } from '../../../utils/productAvailability';
import { SimpleProductCard } from './SimpleProductCard/SimpleProductCard';
import type { Product } from '../../../types';
import './SimpleProductSection.less';

interface SimpleProductSectionProps {
  id: string;
  title: string;
  subtitle?: string;
  items: Product[];
}

export const SimpleProductSection: React.FC<SimpleProductSectionProps> = ({
  id,
  title,
  subtitle,
  items,
}) => {
  const adminSettings = useAdminSettings();
  const { cart, addToCart, updateQuantity } = useCart();

  const getCartIndex = useCallback(
    (productId: string) =>
      cart.findIndex((ci) => ci.product.id === productId && !ci.extras?.length),
    [cart],
  );

  const handleIncrement = useCallback(
    (item: Product) => {
      const idx = getCartIndex(item.id);
      if (idx === -1) {
        addToCart(item, 1);
      } else {
        updateQuantity(idx, cart[idx].quantity + 1);
      }
    },
    [cart, addToCart, updateQuantity, getCartIndex],
  );

  const handleDecrement = useCallback(
    (item: Product) => {
      const idx = getCartIndex(item.id);
      if (idx !== -1) {
        updateQuantity(idx, cart[idx].quantity - 1);
      }
    },
    [cart, updateQuantity, getCartIndex],
  );

  return (
    <section id={id} className="simple-product-section">
      <div className="container">
        {subtitle && (
          <p className="simple-product-section__subtitle">{subtitle}</p>
        )}
        <h2 className="simple-product-section__title">{title}</h2>
        <div className="simple-product-section__grid">
          {items.map((item) => {
            const cartIdx = getCartIndex(item.id);
            const quantity = cartIdx !== -1 ? cart[cartIdx].quantity : 0;
            return (
              <SimpleProductCard
                key={item.id}
                item={item}
                isDisabled={isProductDisabled(item, adminSettings)}
                quantity={quantity}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SimpleProductSection;
