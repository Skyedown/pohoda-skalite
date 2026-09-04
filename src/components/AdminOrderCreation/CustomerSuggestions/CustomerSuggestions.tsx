import React, { useCallback } from 'react';
import type { CustomerMatch } from '../adminHelpers';
import './CustomerSuggestions.less';

interface CustomerSuggestionsProps {
  matches: CustomerMatch[];
  onApply: (match: CustomerMatch) => void;
}

const methodLabels: Record<CustomerMatch['method'], string> = {
  delivery: 'donáška',
  pickup: 'osobný odber',
  'dine-in': 'na mieste',
};

const SuggestionRow: React.FC<{
  match: CustomerMatch;
  onApply: (match: CustomerMatch) => void;
}> = ({ match, onApply }) => {
  const handleClick = useCallback(() => onApply(match), [match, onApply]);

  const address =
    [match.customer.city, match.customer.houseNumber]
      .filter(Boolean)
      .join(' ') || methodLabels[match.method];

  return (
    <button
      type="button"
      className="customer-suggestions__row"
      onClick={handleClick}
    >
      <span className="customer-suggestions__name">
        {match.customer.fullName || 'Bez mena'}
      </span>
      <span className="customer-suggestions__detail">
        {match.customer.phone}
        {' · '}
        {address}
      </span>
      <span className="customer-suggestions__count">{match.orderCount}×</span>
    </button>
  );
};

const CustomerSuggestions: React.FC<CustomerSuggestionsProps> = ({
  matches,
  onApply,
}) => {
  if (matches.length === 0) return null;

  return (
    <div className="customer-suggestions">
      <span className="customer-suggestions__title">Nájdení zákazníci</span>
      <div className="customer-suggestions__list">
        {matches.map((match) => (
          <SuggestionRow
            key={match.customer.phone}
            match={match}
            onApply={onApply}
          />
        ))}
      </div>
    </div>
  );
};

export default CustomerSuggestions;
