import React from 'react';
import DeliveryAddressForm from '../../PizzaCart/DeliveryAddressForm/DeliveryAddressForm';
import PaymentMethodSelector from '../../PizzaCart/PaymentMethodSelector/PaymentMethodSelector';
import type { DeliveryMethod } from '../../../types';
import type { Locale } from '../../../i18n/types';
import { OrderTenantSelector } from '../OrderTenantSelector/OrderTenantSelector';
import type { FormData, CustomerMatch } from '../adminHelpers';
import { useAdminSettings } from '../../../hooks/useAdminSettings';
import './CustomerDetailsSection.less';

interface CustomerDetailsSectionProps {
  formData: FormData;
  errors: Record<string, string>;
  deliveryMethod: DeliveryMethod;
  paymentMethod: 'cash' | 'card';
  customerMatches: CustomerMatch[];
  lookupField: 'fullName' | 'phone' | null;
  onFormChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onDeliveryMethodChange: (method: DeliveryMethod) => void;
  onPaymentMethodChange: (method: 'cash' | 'card') => void;
  onCloseSuggestions: () => void;
  tenant: Locale;
  onTenantChange: (tenant: Locale) => void;
}

const CustomerDetailsSection: React.FC<CustomerDetailsSectionProps> = ({
  formData,
  errors,
  deliveryMethod,
  paymentMethod,
  customerMatches,
  lookupField,
  onFormChange,
  onDeliveryMethodChange,
  onPaymentMethodChange,
  onCloseSuggestions,
  tenant,
  onTenantChange,
}) => {
  const adminSettings = useAdminSettings();

  return (
    <div className="customer-details-section">
      <h3 className="customer-details-section__title">Detaily objednávky</h3>

      {deliveryMethod === 'delivery' && (
        <div className="customer-details-section__tenant">
          <span className="customer-details-section__tenant-label">
            Oblasť rozvozu
          </span>
          <OrderTenantSelector value={tenant} onChange={onTenantChange} />
        </div>
      )}

      {/* Delivery/Pickup Selection */}
      <DeliveryAddressForm
        formData={formData}
        errors={errors}
        cities={adminSettings.deliveryCities[tenant]}
        showStreet={tenant === 'pl'}
        onChange={onFormChange}
        onDeliveryMethodChange={onDeliveryMethodChange}
        hideEmail={true}
        customerMatches={customerMatches}
        lookupField={lookupField}
        onCloseSuggestions={onCloseSuggestions}
      />

      {/* Payment Method */}
      <PaymentMethodSelector
        value={paymentMethod}
        onChange={onPaymentMethodChange}
        deliveryMethod={deliveryMethod}
      />
    </div>
  );
};

export default CustomerDetailsSection;
