import React, { useEffect } from 'react';
import { useOrderingStatus } from '../../../hooks/useOrderingStatus';
import './OrderingStatusBanner.less';

interface OrderingStatusBannerProps {
  onVisibilityChange?: (isVisible: boolean) => void;
}

const OrderingStatusBanner: React.FC<OrderingStatusBannerProps> = ({
  onVisibilityChange,
}) => {
  const statusInfo = useOrderingStatus();

  const isVisible =
    (statusInfo.status !== 'open' && !!statusInfo.message) ||
    statusInfo.disabledProductTypes.length > 0;

  useEffect(() => {
    onVisibilityChange?.(isVisible);
  }, [isVisible, onVisibilityChange]);

  if (!isVisible) {
    return null;
  }

  const getBannerClass = () => {
    if (
      statusInfo.status === 'open' &&
      statusInfo.disabledProductTypes.length
    ) {
      return 'ordering-status-banner--info';
    }

    switch (statusInfo.status) {
      case 'before_preorder':
      case 'orders_closed':
      case 'closed':
      case 'admin_disabled':
        return 'ordering-status-banner--closed';
      case 'preorder':
      case 'admin_wait_time':
        return 'ordering-status-banner--preorder';
      default:
        return '';
    }
  };

  return (
    <div className={`ordering-status-banner ${getBannerClass()}`}>
      <div className="container">
        <div className="ordering-status-banner__content">
          <span className="ordering-status-banner__icon">
            <img
              src={statusInfo.canOrder ? '/icons/info.svg' : '/icons/clock.svg'}
              alt=""
              aria-hidden="true"
              className="ordering-status-banner__icon-svg"
            />
          </span>
          <p className="ordering-status-banner__message">
            {statusInfo.message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderingStatusBanner;
