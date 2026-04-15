import React, { useState, useEffect, useCallback } from 'react';
import DateRangeFilter, {
  computePresetRange,
} from '../DateRangeFilter/DateRangeFilter';
import type { DayStat } from './OrderStats.helpers';
import { computeCategories, computeSummaryStats } from './OrderStats.helpers';
import { OrderSummaryCards } from './OrderSummaryCards/OrderSummaryCards';
import { OrderCharts } from './OrderCharts/OrderCharts';
import type { ProductStat } from './ProductPerformance/ProductPerformance';
import { ProductPerformance } from './ProductPerformance/ProductPerformance';
import './OrderStats.less';

const API_URL = import.meta.env.VITE_API_URL || '';

const OrderStats: React.FC = () => {
  const { from: defaultFrom, to: defaultTo } = computePresetRange('7d');

  const [fromDate, setFromDate] = useState(defaultFrom);
  const [toDate, setToDate] = useState(defaultTo);
  const [stats, setStats] = useState<DayStat[]>([]);
  const [productStats, setProductStats] = useState<ProductStat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activePreset, setActivePreset] = useState<string | null>('7d');

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, productStatsRes] = await Promise.all([
        fetch(`${API_URL}/api/orders/stats?from=${fromDate}&to=${toDate}`),
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
  }, [fromDate, toDate]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const categories = computeCategories(stats);
  const summaryStats = computeSummaryStats(stats);

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

      {error && <p className="order-stats__error">{error}</p>}

      {loading ? (
        <p className="order-stats__loading">Načítavam štatistiky…</p>
      ) : (
        <>
          <OrderSummaryCards stats={summaryStats} />
          <OrderCharts stats={stats} categories={categories} />
          <ProductPerformance stats={productStats} />
        </>
      )}
    </div>
  );
};

export default OrderStats;
