import React, { useMemo } from 'react';
import { useAdminSettings } from '../../../hooks/useAdminSettings';
import { useLocale } from '../../../i18n/LocaleContext';
import {
  formatCityList,
  groupCitiesByMinOrder,
} from './DeliveryInfoSection.helpers';
import './DeliveryInfoSection.less';

const ICONS = ['/icons/pizza.svg', '/icons/car.svg'];

const DeliveryInfoSection: React.FC = () => {
  const { t, locale, price } = useLocale();
  const settings = useAdminSettings();

  const groups = useMemo(
    () => groupCitiesByMinOrder(settings.deliveryCities[locale]),
    [settings.deliveryCities, locale],
  );

  return (
    <section className="delivery-info-section">
      <div className="container">
        <div className="delivery-info-section__content">
          <h2 className="delivery-info-section__title">
            {t('delivery_info_title')}
          </h2>
          <p className="delivery-info-section__subtitle">
            {t('delivery_info_subtitle')}
          </p>

          <div className="delivery-info-section__grid">
            {groups.map((group, index) => (
              <div className="delivery-info-card" key={group.minOrder}>
                <div className="delivery-info-card__icon">
                  <img
                    src={ICONS[index % ICONS.length]}
                    alt=""
                    aria-hidden="true"
                  />
                </div>
                <h3 className="delivery-info-card__title">
                  {formatCityList(group.cities)}
                </h3>
                <p className="delivery-info-card__min-order">
                  {t('delivery_info_min_order')}{' '}
                  <strong>{price(group.minOrder)}</strong>
                </p>
                <p className="delivery-info-card__fee">
                  {t('delivery_info_fee')}{' '}
                  {group.fee > 0 ? (
                    <strong>{price(group.fee)}</strong>
                  ) : (
                    <strong className="delivery-info-card__free">
                      {t('common_free')}
                    </strong>
                  )}
                </p>
              </div>
            ))}
          </div>

          <div className="delivery-info-section__note">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <p>{t('delivery_info_note')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeliveryInfoSection;
