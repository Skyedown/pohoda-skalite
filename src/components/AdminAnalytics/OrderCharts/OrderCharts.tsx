import React, { useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import type { Currency } from '../../../i18n/types';
import type { DayStat } from '../OrderStats.helpers';
import {
  buildRevenueOptions,
  buildOrdersOptions,
  buildAvgOrderOptions,
  buildPaymentSplitOptions,
} from '../OrderStats.helpers';

interface OrderChartsProps {
  stats: DayStat[];
  categories: string[];
  currency: Currency;
}

export const OrderCharts: React.FC<OrderChartsProps> = ({
  stats,
  categories,
  currency,
}) => {
  const revenueChartRef = useRef<HighchartsReact.RefObject>(null);
  const ordersChartRef = useRef<HighchartsReact.RefObject>(null);
  const avgOrderChartRef = useRef<HighchartsReact.RefObject>(null);
  const paymentChartRef = useRef<HighchartsReact.RefObject>(null);

  return (
    <div className="order-stats__charts">
      <div className="order-stats__chart">
        <HighchartsReact
          highcharts={Highcharts}
          options={buildRevenueOptions(categories, stats, currency)}
          ref={revenueChartRef}
        />
      </div>
      <div className="order-stats__chart">
        <HighchartsReact
          highcharts={Highcharts}
          options={buildOrdersOptions(categories, stats)}
          ref={ordersChartRef}
        />
      </div>
      <div className="order-stats__chart">
        <HighchartsReact
          highcharts={Highcharts}
          options={buildAvgOrderOptions(categories, stats, currency)}
          ref={avgOrderChartRef}
        />
      </div>
      <div className="order-stats__chart">
        <HighchartsReact
          highcharts={Highcharts}
          options={buildPaymentSplitOptions(categories, stats)}
          ref={paymentChartRef}
        />
      </div>
    </div>
  );
};
