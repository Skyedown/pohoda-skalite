import Highcharts from 'highcharts';

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
