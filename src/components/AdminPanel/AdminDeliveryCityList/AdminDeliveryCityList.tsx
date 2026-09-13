import React, { useCallback } from 'react';
import type { Currency } from '../../../i18n/types';
import type { DeliveryCity } from '../../../utils/adminSettings';
import './AdminDeliveryCityList.less';

interface AdminDeliveryCityListProps {
  title: string;
  flag: string;
  currency: Currency;
  cities: DeliveryCity[];
  onChange: (cities: DeliveryCity[]) => void;
}

export const AdminDeliveryCityList: React.FC<AdminDeliveryCityListProps> = ({
  title,
  flag,
  currency,
  cities,
  onChange,
}) => {
  const updateCity = useCallback(
    (index: number, patch: Partial<DeliveryCity>) => {
      onChange(
        cities.map((city, i) => (i === index ? { ...city, ...patch } : city)),
      );
    },
    [cities, onChange],
  );

  const removeCity = useCallback(
    (index: number) => {
      onChange(cities.filter((_, i) => i !== index));
    },
    [cities, onChange],
  );

  const addCity = useCallback(() => {
    onChange([...cities, { name: '', minOrder: 0, fee: 0 }]);
  }, [cities, onChange]);

  return (
    <div className="admin-delivery-cities">
      <h3 className="admin-delivery-cities__title">
        <span aria-hidden="true">{flag}</span> {title}
      </h3>

      <div className="admin-delivery-cities__head">
        <span>Obec</span>
        <span>Min. objednávka ({currency})</span>
        <span>Poplatok ({currency})</span>
        <span />
      </div>

      {cities.map((city, index) => (
        <div className="admin-delivery-cities__row" key={index}>
          <input
            type="text"
            className="admin-delivery-cities__input"
            value={city.name}
            placeholder="Názov obce"
            onChange={(e) => updateCity(index, { name: e.target.value })}
          />
          <input
            type="number"
            min="0"
            step="0.5"
            className="admin-delivery-cities__input"
            value={city.minOrder}
            onChange={(e) =>
              updateCity(index, { minOrder: Number(e.target.value) })
            }
          />
          <input
            type="number"
            min="0"
            step="0.5"
            className="admin-delivery-cities__input"
            value={city.fee}
            onChange={(e) => updateCity(index, { fee: Number(e.target.value) })}
          />
          <button
            type="button"
            className="admin-delivery-cities__remove"
            onClick={() => removeCity(index)}
            aria-label={`Odstrániť ${city.name || 'obec'}`}
          >
            ✕
          </button>
        </div>
      ))}

      <button
        type="button"
        className="admin-delivery-cities__add"
        onClick={addCity}
      >
        + Pridať obec
      </button>
    </div>
  );
};
