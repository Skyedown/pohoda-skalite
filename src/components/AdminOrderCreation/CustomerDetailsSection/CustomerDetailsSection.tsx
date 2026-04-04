import React from 'react';
import DeliveryAddressForm from '../../Cart/DeliveryAddressForm/DeliveryAddressForm';
import PaymentMethodSelector from '../../Cart/PaymentMethodSelector/PaymentMethodSelector';
import type { DeliveryMethod } from '../../../types';
import type { FormData } from '../adminHelpers';
import './CustomerDetailsSection.less';

interface CustomerDetailsSectionProps {
  formData: FormData;
  errors: Record<string, string>;
  deliveryMethod: DeliveryMethod;
  paymentMethod: 'cash' | 'card';
  onFormChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onDeliveryMethodChange: (method: DeliveryMethod) => void;
  onPaymentMethodChange: (method: 'cash' | 'card') => void;
}

const CustomerDetailsSection: React.FC<CustomerDetailsSectionProps> = ({
  formData,
  errors,
  deliveryMethod,
  paymentMethod,
  onFormChange,
  onDeliveryMethodChange,
  onPaymentMethodChange,
}) => {
  return (
    <div className="customer-details-section">
      <h3 className="customer-details-section__title">Detaily objednávky</h3>

      {/* Delivery/Pickup Selection */}
      <DeliveryAddressForm
        formData={formData}
        errors={errors}
        onChange={onFormChange}
        onDeliveryMethodChange={onDeliveryMethodChange}
        hideEmail={true}
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
