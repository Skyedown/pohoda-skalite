import React from 'react';
import type { Product } from '../../../types';
import './ProductGrid.less';

interface ProductGridProps {
  productsByCategory: Record<string, Product[]>;
  categoryLabels: Record<string, string>;
  onProductClick: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  productsByCategory,
  categoryLabels,
  onProductClick,
}) => {
  return (
    <div className="product-grid">
      {Object.entries(productsByCategory).map(([categoryKey, products]) => (
        <div key={categoryKey} className="product-grid__category">
          <h4 className="product-grid__category-title">
            {categoryLabels[categoryKey]}
          </h4>
          <div className="product-grid__items">
            {products.map((product) => (
              <div
                key={product.id}
                className="product-grid__card"
                onClick={() => onProductClick(product)}
              >
                <h5 className="product-grid__product-name">{product.name}</h5>
                <p className="product-grid__product-price">
                  {product.price.toFixed(2)} €
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
