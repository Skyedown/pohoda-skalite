import React from 'react';
import './AnalyticsTabs.less';

export type AnalyticsTab = 'orders' | 'products';

const TABS: { value: AnalyticsTab; label: string }[] = [
  { value: 'orders', label: 'Objednávky' },
  { value: 'products', label: 'Produkty' },
];

interface AnalyticsTabsProps {
  activeTab: AnalyticsTab;
  onTabChange: (tab: AnalyticsTab) => void;
}

export const AnalyticsTabs: React.FC<AnalyticsTabsProps> = ({
  activeTab,
  onTabChange,
}) => (
  <div className="analytics-tabs">
    {TABS.map((tab) => (
      <button
        key={tab.value}
        className={`analytics-tabs__tab${activeTab === tab.value ? ' analytics-tabs__tab--active' : ''}`}
        onClick={() => onTabChange(tab.value)}
      >
        {tab.label}
      </button>
    ))}
  </div>
);
