import React, { useState, useEffect } from 'react';
import { getOrderingStatus, type OrderingStatusInfo } from '../../utils/orderingStatus';
import './OrderingStatusBanner.less';

const OrderingStatusBanner: React.FC = () => {
  const [statusInfo, setStatusInfo] = useState<OrderingStatusInfo>(getOrderingStatus());

  useEffect(() => {
    // Update status every minute
    const interval = setInterval(() => {
      setStatusInfo(getOrderingStatus());
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, []);

  // Don't show banner if we're open and operating normally
  if (statusInfo.status === 'open' || !statusInfo.message) {
    return null;
  }

  const getBannerClass = () => {
    switch (statusInfo.status) {
      case 'before_preorder':
      case 'closed':
        return 'ordering-status-banner--closed';
      case 'preorder':
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
            {statusInfo.canOrder ? 'ℹ️' : '⏰'}
          </span>
          <p className="ordering-status-banner__message">{statusInfo.message}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderingStatusBanner;
