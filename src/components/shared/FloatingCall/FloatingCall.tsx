import React from 'react';
import { useLocation } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useLocale } from '../../../i18n/LocaleContext';
import { COMPANY } from '../../../constants/company';
import './FloatingCall.less';

interface FloatingCallProps {
  bannerVisible?: boolean;
}

const FloatingCall: React.FC<FloatingCallProps> = ({
  bannerVisible = false,
}) => {
  const location = useLocation();
  const { cart } = useCart();
  const { t } = useLocale();

  const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isCartVisible = itemsCount > 0 && location.pathname !== '/cart';

  if (location.pathname === '/cart') {
    return null;
  }

  const className = [
    'floating-call',
    !isCartVisible && 'floating-call--no-cart',
    bannerVisible && 'floating-call--with-banner',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <a
      href={`tel:${COMPANY.phone}`}
      className={className}
      aria-label={t('floating_call_aria')}
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
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    </a>
  );
};

export default FloatingCall;
