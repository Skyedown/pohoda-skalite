import React, { useState, useEffect, useRef, useCallback } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './OrderStats.less';

interface DayStat {
  date: string;
  totalOrders: number;
  totalValue: number;
}

const API_URL = import.meta.env.VITE_API_URL || '';

const OrderStats: React.FC = () => {
  // Default: last 7 days
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 6);

  const [fromDate, setFromDate] = useState(formatDate(weekAgo));
  const [toDate, setToDate] = useState(formatDate(today));
  const [stats, setStats] = useState<DayStat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activePreset, setActivePreset] = useState<string | null>('7d');

  const revenueChartRef = useRef<HighchartsReact.RefObject>(null);
  const ordersChartRef = useRef<HighchartsReact.RefObject>(null);

  function formatDate(d: Date): string {
    return d.toISOString().split('T')[0];
  }

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

  function setPresetRange(preset: string) {
    const now = new Date();
    let from: Date;
    let to: Date = now;

    switch (preset) {
      case 'today':
        from = new Date(now);
        break;
      case 'yesterday': {
        const y = new Date(now);
        y.setDate(y.getDate() - 1);
        from = y;
        to = y;
        break;
      }
      case '7d':
        from = new Date(now);
        from.setDate(from.getDate() - 6);
        break;
      case '14d':
        from = new Date(now);
        from.setDate(from.getDate() - 13);
        break;
      case '30d':
        from = new Date(now);
        from.setDate(from.getDate() - 29);
        break;
      case '90d':
        from = new Date(now);
        from.setDate(from.getDate() - 89);
        break;
      case 'this-month':
        from = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'last-month':
        from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        to = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      default:
        return;
    }

    setActivePreset(preset);
    setFromDate(formatDate(from));
    setToDate(formatDate(to));
  }

  return (
    <div className="order-stats">
      <div className="order-stats__presets">
        <button
          className={activePreset === 'today' ? 'active' : ''}
          onClick={() => setPresetRange('today')}
        >
          Dnes
        </button>
        <button
          className={activePreset === 'yesterday' ? 'active' : ''}
          onClick={() => setPresetRange('yesterday')}
        >
          Včera
        </button>
        <button
          className={activePreset === '7d' ? 'active' : ''}
          onClick={() => setPresetRange('7d')}
        >
          7 dní
        </button>
        <button
          className={activePreset === '14d' ? 'active' : ''}
          onClick={() => setPresetRange('14d')}
        >
          14 dní
        </button>
        <button
          className={activePreset === '30d' ? 'active' : ''}
          onClick={() => setPresetRange('30d')}
        >
          30 dní
        </button>
        <button
          className={activePreset === '90d' ? 'active' : ''}
          onClick={() => setPresetRange('90d')}
        >
          90 dní
        </button>
        <button
          className={activePreset === 'this-month' ? 'active' : ''}
          onClick={() => setPresetRange('this-month')}
        >
          Tento mesiac
        </button>
        <button
          className={activePreset === 'last-month' ? 'active' : ''}
          onClick={() => setPresetRange('last-month')}
        >
          Minulý mesiac
        </button>
      </div>

      <div className="order-stats__date-picker">
        <div className="order-stats__date-field">
          <label htmlFor="stats-from">Od:</label>
          <input
            type="date"
            id="stats-from"
            value={fromDate}
            onChange={(e) => {
              setActivePreset(null);
              setFromDate(e.target.value);
            }}
            max={toDate}
          />
        </div>
        <div className="order-stats__date-field">
          <label htmlFor="stats-to">Do:</label>
          <input
            type="date"
            id="stats-to"
            value={toDate}
            onChange={(e) => {
              setActivePreset(null);
              setToDate(e.target.value);
            }}
            min={fromDate}
            max={formatDate(today)}
          />
        </div>
      </div>

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
