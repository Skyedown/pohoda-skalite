import React from 'react';
import type { DeliveryMethod } from '../../../types';
import './DeliveryAddressForm.less';

interface FormData {
  fullName: string;
  deliveryMethod: DeliveryMethod;
  street?: string;
  city?: string;
  phone: string;
  email: string;
  notes: string;
}

interface DeliveryAddressFormProps {
  formData: FormData;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onDeliveryMethodChange: (method: DeliveryMethod) => void;
}

const DeliveryAddressForm: React.FC<DeliveryAddressFormProps> = ({
  formData,
  errors,
  onChange,
  onDeliveryMethodChange
}) => {
  return (
    <div className="delivery-address">
      <h3 className="delivery-address__title">Kontaktné údaje</h3>

      {/* Delivery Method Selection */}
      <div className="delivery-method">
        <h4 className="delivery-method__subtitle">Spôsob prevzatia</h4>

        <label className="delivery-method__option">
          <div className="delivery-method__radio">
            <input
              type="radio"
              name="deliveryMethod"
              checked={formData.deliveryMethod === 'delivery'}
              onChange={() => onDeliveryMethodChange('delivery')}
            />
            <span className="delivery-method__radio-custom"></span>
          </div>
          <div className="delivery-method__content">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="3" width="15" height="13"/>
              <path d="M16 8h5l3 3v5h-2m-4 0H2"/>
              <circle cx="5.5" cy="18.5" r="2.5"/>
              <circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
            <span>Donáška</span>
          </div>
        </label>

        <label className="delivery-method__option">
          <div className="delivery-method__radio">
            <input
              type="radio"
              name="deliveryMethod"
              checked={formData.deliveryMethod === 'pickup'}
              onChange={() => onDeliveryMethodChange('pickup')}
            />
            <span className="delivery-method__radio-custom"></span>
          </div>
          <div className="delivery-method__content">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>Vyzdvihnutie v reštaurácii</span>
          </div>
        </label>
      </div>

      {/* Full Name */}
      <div className="form-group">
        <label className="form-group__label">Celé meno</label>
        <input
          type="text"
          name="fullName"
          className={`form-group__input ${
            errors.fullName ? 'form-group__input--error' : ''
          }`}
          placeholder="Napr. Ján Novák"
          value={formData.fullName}
          onChange={onChange}
        />
        {errors.fullName && (
          <span className="form-group__error">{errors.fullName}</span>
        )}
      </div>

      {/* Address fields - only show for delivery */}
      {formData.deliveryMethod === 'delivery' && (
        <>
          <div className="form-group">
            <label className="form-group__label">Ulica a číslo domu</label>
            <input
              type="text"
              name="street"
              className={`form-group__input ${
                errors.street ? 'form-group__input--error' : ''
              }`}
              placeholder="Napr. Hlavná 123"
              value={formData.street || ''}
              onChange={onChange}
            />
            {errors.street && (
              <span className="form-group__error">{errors.street}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-group__label">Mesto</label>
            <select
              name="city"
              className={`form-group__select ${
                errors.city ? 'form-group__select--error' : ''
              }`}
              value={formData.city || ''}
              onChange={onChange}
            >
              <option value="">Vyberte mesto</option>
              <option value="Skalité">Skalité</option>
              <option value="Čierne">Čierne</option>
              <option value="Svrčinovec">Svrčinovec</option>
              <option value="Oščadnica">Oščadnica</option>
            </select>
            {errors.city && (
              <span className="form-group__error">{errors.city}</span>
            )}
          </div>
        </>
      )}

      {/* Contact fields - always show */}
      <div className="form-group">
        <label className="form-group__label">Telefónne číslo</label>
        <input
          type="tel"
          name="phone"
          className={`form-group__input ${
            errors.phone ? 'form-group__input--error' : ''
          }`}
          placeholder="+421 XXX XXX XXX"
          value={formData.phone}
          onChange={onChange}
        />
        {errors.phone && (
          <span className="form-group__error">{errors.phone}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-group__label">Email</label>
        <input
          type="email"
          name="email"
          className={`form-group__input ${
            errors.email ? 'form-group__input--error' : ''
          }`}
          placeholder="vas@email.sk"
          value={formData.email}
          onChange={onChange}
        />
        {errors.email && (
          <span className="form-group__error">{errors.email}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-group__label">Poznámka (voliteľné)</label>
        <textarea
          name="notes"
          className="form-group__textarea"
          placeholder={formData.deliveryMethod === 'delivery' ? 'Napr. poschodie, zvonček...' : 'Napr. čas vyzdvihnutia...'}
          value={formData.notes}
          onChange={onChange}
          rows={3}
        />
      </div>
    </div>
  );
};

export default DeliveryAddressForm;
