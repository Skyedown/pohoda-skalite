import React from 'react';
import type { CustomerMatch } from '../adminHelpers';
import './CustomerSuggestions.less';

interface CustomerSuggestionsProps {
  matches: CustomerMatch[];
  onClose: () => void;
}

const methodLabels: Record<CustomerMatch['method'], string> = {
  delivery: 'donáška',
  pickup: 'osobný odber',
  'dine-in': 'na mieste',
};

const SuggestionRow: React.FC<{ match: CustomerMatch }> = ({ match }) => {
  const address =
    [match.customer.city, match.customer.houseNumber]
      .filter(Boolean)
      .join(' ') || methodLabels[match.method];

  return (
    <div className="customer-suggestions__row">
      <span className="customer-suggestions__name">
        {match.customer.fullName || 'Bez mena'}
      </span>
      <span className="customer-suggestions__detail">
        {match.customer.phone}
        {' · '}
        {address}
      </span>
      <span className="customer-suggestions__count">{match.orderCount}×</span>
    </div>
  );
};

const CustomerSuggestions: React.FC<CustomerSuggestionsProps> = ({
  matches,
  onClose,
}) => {
  if (matches.length === 0) return null;

  return (
    <div className="customer-suggestions">
      <div className="customer-suggestions__header">
        <span className="customer-suggestions__title">Nájdení zákazníci</span>
        <button
          type="button"
          className="customer-suggestions__close"
          onClick={onClose}
          aria-label="Zavrieť návrhy"
        >
          ✕
        </button>
      </div>
      <div className="customer-suggestions__list">
        {matches.map((match) => (
          <SuggestionRow key={match.customer.phone} match={match} />
        ))}
      </div>
    </div>
  );
};

export default CustomerSuggestions;
