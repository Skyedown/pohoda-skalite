import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DateRangeFilter, {
  computePresetRange,
} from '../DateRangeFilter/DateRangeFilter';
import type { Locale } from '../../i18n/types';
import { config } from '../../config';
import type {
  DayStat,
  DeliveryMethodFilter,
  PaymentMethodFilter,
} from './OrderStats.helpers';
import { CURRENCY_BY_TENANT } from './OrderStats.helpers';
import type { ProductStat } from './ProductPerformance/ProductPerformance';
import type { AnalyticsTab } from './AnalyticsTabs/AnalyticsTabs';
import { AnalyticsTabs } from './AnalyticsTabs/AnalyticsTabs';
import { AnalyticsTenantFilter } from './AnalyticsTenantFilter/AnalyticsTenantFilter';
import { OrdersTab } from './OrdersTab/OrdersTab';
import { ProductsTab } from './ProductsTab/ProductsTab';
import './OrderStats.less';

const API_URL = config.apiUrl;

const OrderStats: React.FC = () => {
  const { from: defaultFrom, to: defaultTo } = computePresetRange('7d');

  const [activeTab, setActiveTab] = useState<AnalyticsTab>('orders');
  const [fromDate, setFromDate] = useState(defaultFrom);
  const [toDate, setToDate] = useState(defaultTo);
  const [activePreset, setActivePreset] = useState<string | null>('7d');
  const [tenant, setTenant] = useState<Locale>('sk');
  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethodFilter>('all');
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodFilter>('all');

  const [stats, setStats] = useState<DayStat[]>([]);
  const [productStats, setProductStats] = useState<ProductStat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currency = CURRENCY_BY_TENANT[tenant];

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError('');

    const baseParams = new URLSearchParams({
      from: fromDate,
      to: toDate,
      tenant,
    });
    if (paymentMethod !== 'all') {
      baseParams.set('paymentMethod', paymentMethod);
    }

    const statsParams = new URLSearchParams(baseParams);
    if (deliveryMethod !== 'all') {
      statsParams.set('deliveryMethod', deliveryMethod);
    }

    try {
      const [statsRes, productStatsRes] = await Promise.all([
        fetch(`${API_URL}/api/orders/stats?${statsParams.toString()}`),
        // product-stats intentionally keeps all delivery methods for the packaging breakdown
        fetch(`${API_URL}/api/orders/product-stats?${baseParams.toString()}`),
      ]);
      if (!statsRes.ok) throw new Error(`HTTP ${statsRes.status}`);
      if (!productStatsRes.ok)
        throw new Error(`HTTP ${productStatsRes.status}`);
      const [data, productData] = await Promise.all([
        statsRes.json() as Promise<DayStat[]>,
        productStatsRes.json() as Promise<ProductStat[]>,
      ]);
      setStats(data);
      setProductStats(productData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(`Nepodarilo sa načítať štatistiky: ${msg}`);
      setStats([]);
      setProductStats([]);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, tenant, deliveryMethod, paymentMethod]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleFromChange = useCallback((value: string) => {
    setActivePreset(null);
    setFromDate(value);
  }, []);

  const handleToChange = useCallback((value: string) => {
    setActivePreset(null);
    setToDate(value);
  }, []);

  const handlePresetChange = useCallback(
    (preset: string, from: string, to: string) => {
      setActivePreset(preset);
      setFromDate(from);
      setToDate(to);
    },
    [],
  );

  const ordersTab = useMemo(
    () => (
      <OrdersTab
        stats={stats}
        currency={currency}
        deliveryMethod={deliveryMethod}
        paymentMethod={paymentMethod}
        onDeliveryMethodChange={setDeliveryMethod}
        onPaymentMethodChange={setPaymentMethod}
      />
    ),
    [stats, currency, deliveryMethod, paymentMethod],
  );

  return (
    <div className="order-stats">
      <AnalyticsTenantFilter tenant={tenant} onChange={setTenant} />

      <DateRangeFilter
        fromDate={fromDate}
        toDate={toDate}
        activePreset={activePreset}
        onFromChange={handleFromChange}
        onToChange={handleToChange}
        onPresetChange={handlePresetChange}
        idPrefix="stats"
      />

      <AnalyticsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {error && <p className="order-stats__error">{error}</p>}

      {loading ? (
        <p className="order-stats__loading">Načítavam štatistiky…</p>
      ) : (
        <>
          {activeTab === 'orders' && ordersTab}
          {activeTab === 'products' && (
            <ProductsTab productStats={productStats} currency={currency} />
          )}
        </>
      )}
    </div>
  );
};

export default OrderStats;
