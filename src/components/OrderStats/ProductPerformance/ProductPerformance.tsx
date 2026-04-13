import React, { useRef, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './ProductPerformance.less';

export interface ProductStat {
  _id: string;
  name: string;
  type: string;
  totalQuantity: number;
  totalRevenue: number;
}

type CategoryFilter = 'vsetky' | 'pizze' | 'burgre' | 'langose' | 'prilohy';

const CATEGORY_OPTIONS: {
  value: CategoryFilter;
  label: string;
  type?: string;
}[] = [
  { value: 'vsetky', label: 'Všetky' },
  { value: 'pizze', label: 'Pizze', type: 'pizza' },
  { value: 'burgre', label: 'Burgre', type: 'burger' },
  { value: 'langose', label: 'Langoše', type: 'langos' },
  { value: 'prilohy', label: 'Prílohy', type: 'priloha' },
];

interface ProductPerformanceProps {
  stats: ProductStat[];
}

export const ProductPerformance: React.FC<ProductPerformanceProps> = ({
  stats,
}) => {
  const revenueChartRef = useRef<HighchartsReact.RefObject>(null);
  const quantityChartRef = useRef<HighchartsReact.RefObject>(null);
  const [category, setCategory] = useState<CategoryFilter>('vsetky');

  if (stats.length === 0) {
    return null;
  }

  const selectedOption = CATEGORY_OPTIONS.find((o) => o.value === category);
  const filteredStats =
    category === 'vsetky'
      ? stats
      : stats.filter((s) => s.type === selectedOption?.type);

  const names = filteredStats.map((s) => s.name);

  const revenueOptions: Highcharts.Options = {
    chart: { type: 'bar', height: Math.max(300, filteredStats.length * 36) },
    title: { text: 'Tržby podľa produktu (€)' },
    xAxis: { categories: names, title: { text: null } },
    yAxis: { min: 0, title: { text: 'Tržby (€)' } },
    tooltip: {
      headerFormat: '<b>{point.key}</b><br/>',
      pointFormat: 'Tržby: <b>{point.y:.2f} €</b>',
    },
    plotOptions: {
      bar: { dataLabels: { enabled: true, format: '{point.y:.2f} €' } },
    },
    series: [
      {
        name: 'Tržby',
        type: 'bar',
        data: filteredStats.map((s) => Math.round(s.totalRevenue * 100) / 100),
        color: '#ff6b35',
      },
    ],
    credits: { enabled: false },
    legend: { enabled: false },
  };

  const quantityOptions: Highcharts.Options = {
    chart: { type: 'bar', height: Math.max(300, filteredStats.length * 36) },
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
        data: filteredStats.map((s) => s.totalQuantity),
        color: '#2196f3',
      },
    ],
    credits: { enabled: false },
    legend: { enabled: false },
  };

  return (
    <div className="order-stats__product-performance">
      <div className="product-performance__header">
        <h3 className="order-stats__section-title">Výkon produktov</h3>
        <select
          className="product-performance__filter"
          value={category}
          onChange={(e) => setCategory(e.target.value as CategoryFilter)}
        >
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
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
