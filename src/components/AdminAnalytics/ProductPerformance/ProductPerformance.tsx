import React, { useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import type { Currency } from '../../../i18n/types';
import { CURRENCY_SYMBOL } from '../OrderStats.helpers';

export interface ProductStat {
  _id: string;
  name: string;
  type: string;
  totalQuantity: number;
  totalRevenue: number;
  byDeliveryMethod: { method: string; quantity: number }[];
}

interface ProductPerformanceProps {
  stats: ProductStat[];
  currency: Currency;
}

export const ProductPerformance: React.FC<ProductPerformanceProps> = ({
  stats,
  currency,
}) => {
  const symbol = CURRENCY_SYMBOL[currency];
  const revenueChartRef = useRef<HighchartsReact.RefObject>(null);
  const quantityChartRef = useRef<HighchartsReact.RefObject>(null);

  if (stats.length === 0) {
    return null;
  }

  const names = stats.map((s) => s.name);

  const revenueOptions: Highcharts.Options = {
    chart: { type: 'bar', height: Math.max(300, stats.length * 36) },
    title: { text: `Tržby podľa produktu (${symbol})` },
    xAxis: { categories: names, title: { text: null } },
    yAxis: { min: 0, title: { text: `Tržby (${symbol})` } },
    tooltip: {
      headerFormat: '<b>{point.key}</b><br/>',
      pointFormat: `Tržby: <b>{point.y:.2f} ${symbol}</b>`,
    },
    plotOptions: {
      bar: { dataLabels: { enabled: true, format: `{point.y:.2f} ${symbol}` } },
    },
    series: [
      {
        name: 'Tržby',
        type: 'bar',
        data: stats.map((s) => Math.round(s.totalRevenue * 100) / 100),
        color: '#ff6b35',
      },
    ],
    credits: { enabled: false },
    legend: { enabled: false },
  };

  const quantityOptions: Highcharts.Options = {
    chart: { type: 'bar', height: Math.max(300, stats.length * 36) },
    title: { text: 'Počet predaných kusov podľa produktu' },
    xAxis: { categories: names, title: { text: null } },
    yAxis: {
      min: 0,
      title: { text: 'Počet kusov' },
      allowDecimals: false,
    },
    tooltip: {
      headerFormat: '<b>{point.key}</b><br/>',
      pointFormat: 'Predané: <b>{point.y} ks</b>',
    },
    plotOptions: {
      bar: { dataLabels: { enabled: true, format: '{point.y} ks' } },
    },
    series: [
      {
        name: 'Počet kusov',
        type: 'bar',
        data: stats.map((s) => s.totalQuantity),
        color: '#2196f3',
      },
    ],
    credits: { enabled: false },
    legend: { enabled: false },
  };

  return (
    <div className="order-stats__product-performance">
      <h3 className="order-stats__section-title">Výkon produktov</h3>
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
            options={quantityOptions}
            ref={quantityChartRef}
          />
        </div>
      </div>
    </div>
  );
};
