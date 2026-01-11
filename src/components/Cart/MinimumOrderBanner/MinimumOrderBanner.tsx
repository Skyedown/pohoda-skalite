import React from 'react';
import './MinimumOrderBanner.less';

interface MinimumOrderBannerProps {
  message: string;
}

const MinimumOrderBanner: React.FC<MinimumOrderBannerProps> = ({ message }) => {
  return (
    <div className="minimum-order-banner">
      <div className="minimum-order-banner__icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 8v4M12 16h.01"/>
        </svg>
      </div>
      <p className="minimum-order-banner__message">{message}</p>
    </div>
  );
};

export default MinimumOrderBanner;
