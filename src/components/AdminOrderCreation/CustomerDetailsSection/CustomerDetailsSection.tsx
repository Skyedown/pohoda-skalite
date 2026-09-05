import React from 'react';
import DeliveryAddressForm from '../../PizzaCart/DeliveryAddressForm/DeliveryAddressForm';
import PaymentMethodSelector from '../../PizzaCart/PaymentMethodSelector/PaymentMethodSelector';
import type { DeliveryMethod } from '../../../types';
import type { FormData, CustomerMatch } from '../adminHelpers';
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
