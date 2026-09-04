import React from 'react';
import './EmptyCart.less';

const EmptyCart: React.FC = () => {
  return (
    <div className="empty-cart">
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      <p className="empty-cart__title">Žiadne produkty</p>
      <p className="empty-cart__hint">Kliknite na produkt vľavo pre pridanie</p>
    </div>
  );
};

export default EmptyCart;
