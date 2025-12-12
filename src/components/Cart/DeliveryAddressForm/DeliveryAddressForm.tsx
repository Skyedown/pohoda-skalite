import React from 'react';
import './DeliveryAddressForm.less';

interface FormData {
  street: string;
  city: string;
  phone: string;
  email: string;
  notes: string;
}

interface DeliveryAddressFormProps {
  formData: FormData;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const DeliveryAddressForm: React.FC<DeliveryAddressFormProps> = ({ formData, errors, onChange }) => {
  return (
    <div className="delivery-address">
      <h3 className="delivery-address__title">Adresa doručenia</h3>

      <div className="form-group">
        <label className="form-group__label">Ulica a číslo domu</label>
        <input
          type="text"
          name="street"
          className={`form-group__input ${errors.street ? 'form-group__input--error' : ''}`}
          placeholder="Napr. Hlavná 123"
          value={formData.street}
          onChange={onChange}
        />
        {errors.street && <span className="form-group__error">{errors.street}</span>}
      </div>

      <div className="form-group">
        <label className="form-group__label">Mesto</label>
        <select
          name="city"
          className={`form-group__select ${errors.city ? 'form-group__select--error' : ''}`}
          value={formData.city}
          onChange={onChange}
        >
          <option value="">Vyberte mesto</option>
          <option value="Skalité">Skalité</option>
          <option value="Čierne">Čierne</option>
          <option value="Svrčinovec">Svrčinovec</option>
        </select>
        {errors.city && <span className="form-group__error">{errors.city}</span>}
      </div>

      <div className="form-group">
        <label className="form-group__label">Telefónne číslo</label>
        <input
          type="tel"
          name="phone"
          className={`form-group__input ${errors.phone ? 'form-group__input--error' : ''}`}
          placeholder="+421 XXX XXX XXX"
          value={formData.phone}
          onChange={onChange}
        />
        {errors.phone && <span className="form-group__error">{errors.phone}</span>}
      </div>

      <div className="form-group">
        <label className="form-group__label">Email</label>
        <input
          type="email"
          name="email"
          className={`form-group__input ${errors.email ? 'form-group__input--error' : ''}`}
          placeholder="vas@email.sk"
          value={formData.email}
          onChange={onChange}
        />
        {errors.email && <span className="form-group__error">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label className="form-group__label">Poznámka (voliteľné)</label>
        <textarea
          name="notes"
          className="form-group__textarea"
          placeholder="Napr. poschodie, zvonček..."
          value={formData.notes}
          onChange={onChange}
          rows={3}
        />
      </div>
    </div>
  );
};

export default DeliveryAddressForm;
