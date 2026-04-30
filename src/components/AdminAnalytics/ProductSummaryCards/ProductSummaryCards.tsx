import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import type { ProductTypeSummary } from '../OrderStats.helpers';
import './ProductSummaryCards.less';

const PIE_COLORS = {
  delivery: '#ff6b35',
  pickup: '#2196f3',
  dineIn: '#27ae60',
};

interface SummaryCardPieProps {
  delivery: number;
  pickup: number;
  dineIn: number;
}

const SummaryCardPie: React.FC<SummaryCardPieProps> = ({
  delivery,
  pickup,
  dineIn,
}) => {
  const options = useMemo<Highcharts.Options>(
    () => ({
      chart: {
        type: 'pie',
        height: 120,
        margin: [0, 0, 0, 0],
        spacing: [0, 0, 0, 0],
        backgroundColor: 'transparent',
      },
      title: { text: undefined },
      tooltip: {
        pointFormat:
          '<b>{point.name}</b>: {point.y} ks ({point.percentage:.0f}%)',
      },
      plotOptions: {
        pie: {
          size: '100%',
          dataLabels: { enabled: false },
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.4)',
        },
      },
      series: [
        {
          type: 'pie',
          data: [
            { name: 'Dovoz', y: delivery, color: PIE_COLORS.delivery },
            { name: 'Odber', y: pickup, color: PIE_COLORS.pickup },
            { name: 'Prevádzka', y: dineIn, color: PIE_COLORS.dineIn },
          ].filter((d) => d.y > 0),
        },
      ],
      credits: { enabled: false },
      legend: { enabled: false },
      accessibility: { enabled: false },
    }),
    [delivery, pickup, dineIn],
  );

  const hasData = delivery > 0 || pickup > 0 || dineIn > 0;
  if (!hasData) return null;

  return (
    <div className="product-summary-cards__pie">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

interface ProductSummaryCardsProps {
  summaries: ProductTypeSummary[];
}

export const ProductSummaryCards: React.FC<ProductSummaryCardsProps> = ({
  summaries,
}) => {
  return (
    <div className="product-summary-cards">
      {summaries.map((summary) => (
        <div
          key={summary.key}
          className={`product-summary-cards__card product-summary-cards__card--${summary.key}`}
        >
          <p className="product-summary-cards__label">{summary.label}</p>
          <p className="product-summary-cards__total">{summary.total} ks</p>
          <div className="product-summary-cards__breakdown">
            <span className="product-summary-cards__method product-summary-cards__method--delivery">
              Dovoz: {summary.delivery}
              {summary.total > 0 && (
                <span className="product-summary-cards__pct">
                  {' '}
                  ({Math.round((summary.delivery / summary.total) * 100)}%)
                </span>
              )}
            </span>
            <span className="product-summary-cards__method product-summary-cards__method--pickup">
              Odber: {summary.pickup}
              {summary.total > 0 && (
                <span className="product-summary-cards__pct">
                  {' '}
                  ({Math.round((summary.pickup / summary.total) * 100)}%)
                </span>
              )}
            </span>
            <span className="product-summary-cards__method product-summary-cards__method--dine-in">
              Prevádzka: {summary.dineIn}
              {summary.total > 0 && (
                <span className="product-summary-cards__pct">
                  {' '}
                  ({Math.round((summary.dineIn / summary.total) * 100)}%)
                </span>
              )}
            </span>
          </div>
          <SummaryCardPie
            delivery={summary.delivery}
            pickup={summary.pickup}
            dineIn={summary.dineIn}
          />
        </div>
      ))}
    </div>
  );
};
