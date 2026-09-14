import React from 'react';
import type { DeliveryMethod } from '../../../types';
import type { DeliveryCity } from '../../../utils/adminSettings';
import { useLocale } from '../../../i18n/LocaleContext';
import { DeliveryMethodSelector } from '../DeliveryMethodSelector/DeliveryMethodSelector';
import CustomerSuggestions from '../../AdminOrderCreation/CustomerSuggestions/CustomerSuggestions';
import type { CustomerMatch } from '../../AdminOrderCreation/adminHelpers';
import './DeliveryAddressForm.less';

interface FormData {
  fullName: string;
  deliveryMethod: DeliveryMethod;
  street?: string;
  houseNumber?: string;
  city?: string;
  phone: string;
  email: string;
  notes: string;
}

interface DeliveryAddressFormProps {
  formData: FormData;
  errors: Record<string, string>;
  cities: DeliveryCity[];
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onDeliveryMethodChange: (method: DeliveryMethod) => void;
  /** Slovak villages number houses without a street; Polish ones need one. */
  showStreet?: boolean;
  hideEmail?: boolean;
  customerMatches?: CustomerMatch[];
  lookupField?: 'fullName' | 'phone' | null;
  onCloseSuggestions?: () => void;
}

const DeliveryAddressForm: React.FC<DeliveryAddressFormProps> = ({
  formData,
  errors,
  cities,
  onChange,
  onDeliveryMethodChange,
  showStreet = false,
  hideEmail = false,
  customerMatches = [],
  lookupField = null,
  onCloseSuggestions,
}) => {
  const { t } = useLocale();

  const renderSuggestions = (field: 'fullName' | 'phone') =>
    onCloseSuggestions &&
    lookupField === field &&
    customerMatches.length > 0 ? (
      <CustomerSuggestions
        matches={customerMatches}
        onClose={onCloseSuggestions}
      />
    ) : null;

  return (
    <div className="delivery-address">
      <h3 className="delivery-address__title">{t('form_title')}</h3>

      <DeliveryMethodSelector
        value={formData.deliveryMethod}
        onChange={onDeliveryMethodChange}
      />

      {/* Phone - first so a returning caller is matched immediately */}
      <div className="form-group form-group--anchor">
        <label className="form-group__label">{t('form_phone')}</label>
        <input
          type="tel"
          name="phone"
          className={`form-group__input ${
            errors.phone ? 'form-group__input--error' : ''
          }`}
          placeholder={t('form_phone_placeholder')}
          value={formData.phone}
          onChange={onChange}
        />
        {errors.phone && (
          <span className="form-group__error">{errors.phone}</span>
        )}
        {renderSuggestions('phone')}
      </div>

      <div className="form-group form-group--anchor">
        <label className="form-group__label">{t('form_fullname')}</label>
        <input
          type="text"
          name="fullName"
          className={`form-group__input ${
            errors.fullName ? 'form-group__input--error' : ''
          }`}
          placeholder={t('form_fullname_placeholder')}
          value={formData.fullName}
          onChange={onChange}
        />
        {errors.fullName && (
          <span className="form-group__error">{errors.fullName}</span>
        )}
        {renderSuggestions('fullName')}
      </div>

      {formData.deliveryMethod === 'delivery' && (
        <>
          <div className="form-group">
            <label className="form-group__label">{t('form_city')}</label>
            <select
              name="city"
              className={`form-group__select ${
                errors.city ? 'form-group__select--error' : ''
              }`}
              value={formData.city || ''}
              onChange={onChange}
            >
              <option value="">{t('form_city_placeholder')}</option>
              {cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
            {errors.city && (
              <span className="form-group__error">{errors.city}</span>
            )}
          </div>

          {showStreet && (
            <div className="form-group">
              <label className="form-group__label">{t('form_street')}</label>
              <input
                type="text"
                name="street"
                className={`form-group__input ${
                  errors.street ? 'form-group__input--error' : ''
                }`}
                placeholder={t('form_street_placeholder')}
                value={formData.street || ''}
                onChange={onChange}
              />
              {errors.street && (
                <span className="form-group__error">{errors.street}</span>
              )}
            </div>
          )}

          <div className="form-group">
            <label className="form-group__label">
              {t('form_house_number')}
            </label>
            <input
              type="text"
              inputMode={showStreet ? 'text' : 'numeric'}
              pattern={showStreet ? undefined : '[0-9]*'}
              name="houseNumber"
              className={`form-group__input ${
                errors.houseNumber ? 'form-group__input--error' : ''
              }`}
              placeholder={
                showStreet
                  ? t('form_house_number_placeholder_street')
                  : t('form_house_number_placeholder')
              }
              value={formData.houseNumber || ''}
              onChange={onChange}
            />
            {errors.houseNumber && (
              <span className="form-group__error">{errors.houseNumber}</span>
            )}
          </div>
        </>
      )}

      {!hideEmail && (
        <div className="form-group">
          <label className="form-group__label">{t('form_email')}</label>
          <input
            type="email"
            name="email"
            className={`form-group__input ${
              errors.email ? 'form-group__input--error' : ''
            }`}
            placeholder={t('form_email_placeholder')}
            value={formData.email}
            onChange={onChange}
          />
          {errors.email && (
            <span className="form-group__error">{errors.email}</span>
          )}
        </div>
      )}

      <div className="form-group">
        <label className="form-group__label">{t('form_notes')}</label>
        <textarea
          name="notes"
          className="form-group__textarea"
          placeholder={
            formData.deliveryMethod === 'delivery'
              ? t('form_notes_placeholder_delivery')
              : t('form_notes_placeholder_pickup')
          }
          value={formData.notes}
          onChange={onChange}
          rows={3}
        />
      </div>
    </div>
  );
};

export default DeliveryAddressForm;
