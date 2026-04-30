import React, { useState, useEffect, useCallback } from 'react';
import DateRangeFilter, {
  computePresetRange,
} from '../DateRangeFilter/DateRangeFilter';
import type { DayStat, DeliveryMethodFilter } from './OrderStats.helpers';
import type { ProductStat } from './ProductPerformance/ProductPerformance';
import type { AnalyticsTab } from './AnalyticsTabs/AnalyticsTabs';
import { AnalyticsTabs } from './AnalyticsTabs/AnalyticsTabs';
import { OrdersTab } from './OrdersTab/OrdersTab';
import { ProductsTab } from './ProductsTab/ProductsTab';
import './OrderStats.less';

const API_URL = import.meta.env.VITE_API_URL || '';

const OrderStats: React.FC = () => {
  const { from: defaultFrom, to: defaultTo } = computePresetRange('7d');

  const [activeTab, setActiveTab] = useState<AnalyticsTab>('orders');
  const [fromDate, setFromDate] = useState(defaultFrom);
  const [toDate, setToDate] = useState(defaultTo);
  const [activePreset, setActivePreset] = useState<string | null>('7d');
  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethodFilter>('all');

  const [stats, setStats] = useState<DayStat[]>([]);
  const [productStats, setProductStats] = useState<ProductStat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError('');

    const deliveryParam =
      deliveryMethod !== 'all'
        ? `&deliveryMethod=${encodeURIComponent(deliveryMethod)}`
        : '';

    try {
      const [statsRes, productStatsRes] = await Promise.all([
        fetch(
          `${API_URL}/api/orders/stats?from=${fromDate}&to=${toDate}${deliveryParam}`,
        ),
        // product-stats intentionally fetches all delivery methods for packaging breakdown
        fetch(
          `${API_URL}/api/orders/product-stats?from=${fromDate}&to=${toDate}`,
        ),
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
  }, [fromDate, toDate, deliveryMethod]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="order-stats">
      <DateRangeFilter
        fromDate={fromDate}
        toDate={toDate}
        activePreset={activePreset}
        onFromChange={(v) => {
          setActivePreset(null);
          setFromDate(v);
        }}
        onToChange={(v) => {
          setActivePreset(null);
          setToDate(v);
        }}
        onPresetChange={(preset, from, to) => {
          setActivePreset(preset);
          setFromDate(from);
          setToDate(to);
        }}
        idPrefix="stats"
      />

      <AnalyticsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {error && <p className="order-stats__error">{error}</p>}

      {loading ? (
        <p className="order-stats__loading">Načítavam štatistiky…</p>
      ) : (
        <>
          {activeTab === 'orders' && (
            <OrdersTab
              stats={stats}
              deliveryMethod={deliveryMethod}
              onDeliveryMethodChange={setDeliveryMethod}
            />
          )}
          {activeTab === 'products' && (
            <ProductsTab productStats={productStats} />
          )}
        </>
      )}
    </div>
  );
};

export default OrderStats;
