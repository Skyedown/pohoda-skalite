import React from 'react';
import type { DeliveryMethod } from '../../../types';
import { DeliveryMethodSelector } from '../DeliveryMethodSelector/DeliveryMethodSelector';
import './DeliveryAddressForm.less';

interface FormData {
  fullName: string;
  deliveryMethod: DeliveryMethod;
  houseNumber?: string;
  city?: string;
  phone: string;
  email: string;
  notes: string;
}

interface DeliveryAddressFormProps {
  formData: FormData;
  errors: Record<string, string>;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onDeliveryMethodChange: (method: DeliveryMethod) => void;
  hideEmail?: boolean;
}

const DeliveryAddressForm: React.FC<DeliveryAddressFormProps> = ({
  formData,
  errors,
  onChange,
  onDeliveryMethodChange,
  hideEmail = false,
}) => {
  return (
    <div className="delivery-address">
      <h3 className="delivery-address__title">Kontaktné údaje</h3>

      <DeliveryMethodSelector
        value={formData.deliveryMethod}
        onChange={onDeliveryMethodChange}
      />

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

          <div className="form-group">
            <label className="form-group__label">Číslo domu</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              name="houseNumber"
              className={`form-group__input ${
                errors.houseNumber ? 'form-group__input--error' : ''
              }`}
              placeholder="Zadajte len číslo domu (napr. 123)"
              value={formData.houseNumber || ''}
              onChange={onChange}
            />
            {errors.houseNumber && (
              <span className="form-group__error">{errors.houseNumber}</span>
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

      {!hideEmail && (
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
      )}

      <div className="form-group">
        <label className="form-group__label">Poznámka (voliteľné)</label>
        <textarea
          name="notes"
          className="form-group__textarea"
          placeholder={
            formData.deliveryMethod === 'delivery'
              ? 'Napr. poschodie, zvonček...'
              : 'Napr. čas vyzdvihnutia...'
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
