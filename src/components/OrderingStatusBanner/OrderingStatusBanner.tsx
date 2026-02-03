import React, { useState, useEffect } from 'react';
import { getOrderingStatus, getOrderingStatusAsync, type OrderingStatusInfo } from '../../utils/orderingStatus';
import './OrderingStatusBanner.less';

interface OrderingStatusBannerProps {
  onVisibilityChange?: (isVisible: boolean) => void;
}

const OrderingStatusBanner: React.FC<OrderingStatusBannerProps> = ({ onVisibilityChange }) => {
  const [statusInfo, setStatusInfo] = useState<OrderingStatusInfo>(getOrderingStatus());

  useEffect(() => {
    // Fetch initial status with admin settings
    const fetchStatus = async () => {
      const status = await getOrderingStatusAsync();
      setStatusInfo(status);
    };
    fetchStatus();

    // Update status every minute
    const interval = setInterval(async () => {
      const status = await getOrderingStatusAsync();
      setStatusInfo(status);
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, []);

  // Determine if banner should be visible
  const isVisible = statusInfo.status !== 'open' && !!statusInfo.message;

  // Notify parent about visibility changes
  useEffect(() => {
    onVisibilityChange?.(isVisible);
  }, [isVisible, onVisibilityChange]);

  // Don't show banner if we're open and operating normally
  if (!isVisible) {
    return null;
  }

  const getBannerClass = () => {
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
              alt={statusInfo.canOrder ? 'Info' : 'Clock'}
              className="ordering-status-banner__icon-svg"
            />
          </span>
          <p className="ordering-status-banner__message">{statusInfo.message}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderingStatusBanner;
