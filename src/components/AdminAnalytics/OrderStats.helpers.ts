import Highcharts from 'highcharts';
import { prilohy } from '../../data/prilohy';
import type { ProductStat } from './ProductPerformance/ProductPerformance';

export interface DayStat {
  date: string;
  totalOrders: number;
  totalValue: number;
}

export interface SummaryStats {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
}

export type DeliveryMethodFilter =
  | 'all'
  | 'pickup'
  | 'dine-in'
  | 'delivery'
  | 'pickup,delivery';

export interface ProductTypeSummary {
  key: string;
  label: string;
  total: number;
  delivery: number;
  pickup: number;
  dineIn: number;
}

const SAUCE_IDS: ReadonlySet<string> = new Set(
  prilohy.filter((p) => p.weight?.includes('ml')).map((p) => p.id),
);

const SUMMARY_TEMPLATE: ProductTypeSummary[] = [
  { key: 'pizza', label: 'Pizze', total: 0, delivery: 0, pickup: 0, dineIn: 0 },
  {
    key: 'burger',
    label: 'Burgre',
    total: 0,
    delivery: 0,
    pickup: 0,
    dineIn: 0,
  },
  {
    key: 'langos',
    label: 'Langoše',
    total: 0,
    delivery: 0,
    pickup: 0,
    dineIn: 0,
  },
  {
    key: 'fries',
    label: 'Hranolky',
    total: 0,
    delivery: 0,
    pickup: 0,
    dineIn: 0,
  },
  {
    key: 'sauces',
    label: 'Omáčky',
    total: 0,
    delivery: 0,
    pickup: 0,
    dineIn: 0,
  },
];

export function computeProductTypeSummaries(
  productStats: ProductStat[],
): ProductTypeSummary[] {
  const map = new Map<string, ProductTypeSummary>(
    SUMMARY_TEMPLATE.map((s) => [s.key, { ...s }]),
  );

  for (const stat of productStats) {
    let key: string;
    if (
      stat.type === 'pizza' ||
      stat.type === 'burger' ||
      stat.type === 'langos'
    ) {
      key = stat.type;
    } else if (stat.type === 'sides') {
      key = SAUCE_IDS.has(stat._id) ? 'sauces' : 'fries';
    } else {
      continue;
    }

    const entry = map.get(key)!;
    entry.total += stat.totalQuantity;
    for (const dm of stat.byDeliveryMethod) {
      if (dm.method === 'delivery') entry.delivery += dm.quantity;
      else if (dm.method === 'pickup') entry.pickup += dm.quantity;
      else if (dm.method === 'dine-in') entry.dineIn += dm.quantity;
    }
  }

  return Array.from(map.values());
}

export function computeCategories(stats: DayStat[]): string[] {
  return stats.map((s) => {
    const d = new Date(s.date);
    return d.toLocaleDateString('sk-SK', { day: '2-digit', month: '2-digit' });
  });
}

export function computeSummaryStats(stats: DayStat[]): SummaryStats {
  const totalRevenue = stats.reduce((sum, s) => sum + s.totalValue, 0);
  const totalOrders = stats.reduce((sum, s) => sum + s.totalOrders, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  return { totalRevenue, totalOrders, avgOrderValue };
}

export function buildRevenueOptions(
  categories: string[],
  stats: DayStat[],
): Highcharts.Options {
  return {
    chart: { type: 'column', height: 300 },
    title: { text: 'Denné tržby (€)' },
    xAxis: { categories, crosshair: true },
    yAxis: { min: 0, title: { text: 'Tržby (€)' } },
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
}

export function buildOrdersOptions(
  categories: string[],
  stats: DayStat[],
): Highcharts.Options {
  return {
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
}

export function buildAvgOrderOptions(
  categories: string[],
  stats: DayStat[],
): Highcharts.Options {
  return {
    chart: { type: 'line', height: 300 },
    title: { text: 'Priemerná hodnota objednávky (€)' },
    xAxis: { categories, crosshair: true },
    yAxis: { min: 0, title: { text: 'Priemerná hodnota (€)' } },
    tooltip: {
      headerFormat: '<b>{point.key}</b><br/>',
      pointFormat: 'Priemer: <b>{point.y:.2f} €</b>',
    },
    series: [
      {
        name: 'Priemerná hodnota',
        type: 'line',
        data: stats.map((s) =>
          s.totalOrders > 0
            ? Math.round((s.totalValue / s.totalOrders) * 100) / 100
            : null,
        ),
        color: '#4caf50',
        marker: { enabled: true },
      },
    ],
    credits: { enabled: false },
    legend: { enabled: false },
  };
}
