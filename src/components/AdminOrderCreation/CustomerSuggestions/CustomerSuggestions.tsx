import React, { useCallback, useRef } from 'react';
import type { CustomerMatch } from '../adminHelpers';
import './CustomerSuggestions.less';

interface CustomerSuggestionsProps {
  matches: CustomerMatch[];
  onSelect: (match: CustomerMatch) => void;
  onClose: () => void;
}

const methodLabels: Record<CustomerMatch['method'], string> = {
  delivery: 'donáška',
  pickup: 'osobný odber',
  'dine-in': 'na mieste',
};

interface SuggestionRowProps {
  match: CustomerMatch;
  onSelect: (match: CustomerMatch) => void;
}

/** Finger travel beyond this is a scroll of the list, not a tap. */
const TAP_SLOP_PX = 10;

const SuggestionRow: React.FC<SuggestionRowProps> = ({ match, onSelect }) => {
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const handleClick = useCallback(() => onSelect(match), [onSelect, match]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    touchStart.current =
      e.pointerType === 'mouse' ? null : { x: e.clientX, y: e.clientY };
  }, []);

  // iPad Safari can swallow the click synthesized after a touch (keyboard
  // closing, momentum scrolling), so a touch selects on lift instead.
  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      const start = touchStart.current;
      touchStart.current = null;
      if (!start) return;
      const moved = Math.hypot(e.clientX - start.x, e.clientY - start.y);
      if (moved <= TAP_SLOP_PX) onSelect(match);
    },
    [onSelect, match],
  );

  const address =
    [match.customer.street, match.customer.city, match.customer.houseNumber]
      .filter(Boolean)
      .join(' ') || methodLabels[match.method];

  return (
    <button
      type="button"
      className="customer-suggestions__row"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
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
  onSelect,
  onClose,
}) => {
  if (matches.length === 0) return null;

  return (
    <div className="customer-suggestions">
      <div className="customer-suggestions__header">
        <span className="customer-suggestions__title">
          Nájdení zákazníci — kliknutím vyplníte údaje
        </span>
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
          <SuggestionRow
            key={match.customer.phone}
            match={match}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default CustomerSuggestions;
