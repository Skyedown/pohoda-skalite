import React, { useState, useEffect, useRef, useCallback } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import DateRangeFilter, {
  formatDateParam,
  computePresetRange,
} from '../DateRangeFilter/DateRangeFilter';
import './OrderStats.less';

interface DayStat {
  date: string;
  totalOrders: number;
  totalValue: number;
}

const API_URL = import.meta.env.VITE_API_URL || '';

const OrderStats: React.FC = () => {
  // Default: last 7 days
  const { from: defaultFrom, to: defaultTo } = computePresetRange('7d');

  const [fromDate, setFromDate] = useState(defaultFrom);
  const [toDate, setToDate] = useState(defaultTo);
  const [stats, setStats] = useState<DayStat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activePreset, setActivePreset] = useState<string | null>('7d');

  const revenueChartRef = useRef<HighchartsReact.RefObject>(null);
  const ordersChartRef = useRef<HighchartsReact.RefObject>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `${API_URL}/api/orders/stats?from=${fromDate}&to=${toDate}`,
      );
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data: DayStat[] = await res.json();
      setStats(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(`Nepodarilo sa načítať štatistiky: ${msg}`);
      setStats([]);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const categories = stats.map((s) => {
    const d = new Date(s.date);
    return d.toLocaleDateString('sk-SK', { day: '2-digit', month: '2-digit' });
  });

  const revenueOptions: Highcharts.Options = {
    chart: { type: 'column', height: 300 },
    title: { text: 'Denné tržby (€)' },
    xAxis: { categories, crosshair: true },
    yAxis: {
      min: 0,
      title: { text: 'Tržby (€)' },
    },
    tooltip: {
      headerFormat: '<b>{point.key}</b><br/>',
      pointFormat: 'Tržby: <b>{point.y:.2f} €</b>',
    },
    series: [
      {
        name: 'Tržby',
        type: 'column',
        data: stats.map((s) => s.totalValue),
        color: '#ff6b35',
      },
    ],
    credits: { enabled: false },
    legend: { enabled: false },
  };

  const ordersOptions: Highcharts.Options = {
    chart: { type: 'column', height: 300 },
    title: { text: 'Počet objednávok za deň' },
    xAxis: { categories, crosshair: true },
    yAxis: {
      min: 0,
      title: { text: 'Počet objednávok' },
      allowDecimals: false,
    },
    tooltip: {
      headerFormat: '<b>{point.key}</b><br/>',
      pointFormat: 'Objednávky: <b>{point.y}</b>',
    },
    series: [
      {
        name: 'Objednávky',
        type: 'column',
        data: stats.map((s) => s.totalOrders),
        color: '#2196f3',
      },
    ],
    credits: { enabled: false },
    legend: { enabled: false },
  };

  // Summary totals
  const totalRevenue = stats.reduce((sum, s) => sum + s.totalValue, 0);
  const totalOrders = stats.reduce((sum, s) => sum + s.totalOrders, 0);

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
          {/* Summary Cards */}
          <div className="order-stats__summary">
            <div className="order-stats__summary-card order-stats__summary-card--revenue">
              <p className="order-stats__summary-label">Celkové tržby</p>
              <p className="order-stats__summary-value">
                {totalRevenue.toFixed(2)} €
              </p>
            </div>
            <div className="order-stats__summary-card order-stats__summary-card--orders">
              <p className="order-stats__summary-label">Celkom objednávok</p>
              <p className="order-stats__summary-value">{totalOrders}</p>
            </div>
          </div>

          {/* Highcharts Graphs */}
          <div className="order-stats__charts">
            <div className="order-stats__chart">
              <HighchartsReact
                highcharts={Highcharts}
                options={revenueOptions}
                ref={revenueChartRef}
              />
            </div>
            <div className="order-stats__chart">
              <HighchartsReact
                highcharts={Highcharts}
                options={ordersOptions}
                ref={ordersChartRef}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderStats;
