import React from 'react';
import OrderTypeSelector from '../OrderTypeSelector/OrderTypeSelector';
import ProductGrid from '../ProductGrid/ProductGrid';
import CustomerDetailsSection from '../CustomerDetailsSection/CustomerDetailsSection';
import DineInNotesSection from '../DineInNotesSection/DineInNotesSection';
import type { Product, DeliveryMethod } from '../../../types';
import type { FormData } from '../adminHelpers';
import './OrderFormSection.less';

interface OrderFormSectionProps {
  orderType: 'dine-in' | 'customer';
  productsByCategory: Record<string, Product[]>;
  categoryLabels: Record<string, string>;
  formData: FormData;
  errors: Record<string, string>;
  deliveryMethod: DeliveryMethod;
  paymentMethod: 'cash' | 'card';
  onOrderTypeChange: (type: 'dine-in' | 'customer') => void;
  onProductClick: (product: Product) => void;
  onFormChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onDeliveryMethodChange: (method: DeliveryMethod) => void;
  onPaymentMethodChange: (method: 'cash' | 'card') => void;
  onSubmit: (e: React.FormEvent) => void;
}

const OrderFormSection: React.FC<OrderFormSectionProps> = ({
  orderType,
  productsByCategory,
  categoryLabels,
  formData,
  errors,
  deliveryMethod,
  paymentMethod,
  onOrderTypeChange,
  onProductClick,
  onFormChange,
  onDeliveryMethodChange,
  onPaymentMethodChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="order-form-section">
      {/* Order Type Selection */}
      <div className="order-form-section__block">
        <h3 className="order-form-section__title">Typ objednávky</h3>
        <OrderTypeSelector value={orderType} onChange={onOrderTypeChange} />
      </div>

      {/* Product Selection */}
      <div className="order-form-section__block">
        <h3 className="order-form-section__title">Výber produktov</h3>
        {errors.items && (
          <p className="order-form-section__error">{errors.items}</p>
        )}
        <ProductGrid
          productsByCategory={productsByCategory}
          categoryLabels={categoryLabels}
          onProductClick={onProductClick}
        />
      </div>

      {/* Order Details Form - only show for customer orders */}
      {orderType === 'customer' && (
        <div className="order-form-section__block">
          <CustomerDetailsSection
            formData={formData}
            errors={errors}
            deliveryMethod={deliveryMethod}
            paymentMethod={paymentMethod}
            onFormChange={onFormChange}
            onDeliveryMethodChange={onDeliveryMethodChange}
            onPaymentMethodChange={onPaymentMethodChange}
          />
        </div>
      )}

      {/* For dine-in orders, show notes field */}
      {orderType === 'dine-in' && (
        <div className="order-form-section__block">
          <DineInNotesSection notes={formData.notes} onChange={onFormChange} />
        </div>
      )}
    </form>
  );
};

export default OrderFormSection;
