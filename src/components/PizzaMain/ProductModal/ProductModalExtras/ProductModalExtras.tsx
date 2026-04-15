import React from 'react';
import type { Extra } from '../../../../types';

interface ProductModalExtrasProps {
  extras: Extra[];
  selectedExtras: string[];
  ingredients: string[];
  removedIngredients: string[];
  productType: string;
  onToggleExtra: (extraId: string) => void;
  onToggleIngredient: (ingredient: string) => void;
}

export const ProductModalExtras: React.FC<ProductModalExtrasProps> = ({
  extras,
  selectedExtras,
  ingredients,
  removedIngredients,
  productType,
  onToggleExtra,
  onToggleIngredient,
}) => (
  <div className="product-modal__extras-section">
    <h3 className="product-modal__section-title">
      Pridať alebo odobrať ingrediencie
    </h3>
    <div className="product-modal__extras-container">
      <div className="product-modal__extras-list">
        {productType !== 'sides' && ingredients.length > 0 && (
          <>
            {ingredients.map((ingredient) => {
              const isRemoved = removedIngredients.includes(ingredient);
              const isIncluded = !isRemoved;
              return (
                <label
                  key={ingredient}
                  className={`product-modal__extra-item product-modal__extra-item--ingredient ${
                    isIncluded
                      ? 'product-modal__extra-item--selected'
                      : 'product-modal__extra-item--removed'
                  }`}
                >
                  <div className="product-modal__extra-checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={isIncluded}
                      onChange={() => onToggleIngredient(ingredient)}
                      className="product-modal__extra-checkbox"
                    />
                    <span className="product-modal__extra-checkbox-custom">
                      {isIncluded && (
                        <svg
                          width="10"
                          height="8"
                          viewBox="0 0 10 8"
                          fill="none"
                        >
                          <path
                            d="M1 4L3.5 6.5L9 1"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                    <span
                      className={`product-modal__extra-name ${isRemoved ? 'product-modal__extra-name--removed' : ''}`}
                    >
                      {ingredient}
                    </span>
                  </div>
                  <span className="product-modal__extra-price product-modal__extra-price--included">
                    v cene
                  </span>
                </label>
              );
            })}
            {extras.length > 0 && (
              <div className="product-modal__extras-divider">
                <span>Extra prílohy</span>
              </div>
            )}
          </>
        )}

        {extras.map((extra) => {
          const isSelected = selectedExtras.includes(extra.id);
          return (
            <label
              key={extra.id}
              className={`product-modal__extra-item ${isSelected ? 'product-modal__extra-item--selected' : ''}`}
            >
              <div className="product-modal__extra-checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleExtra(extra.id)}
                  className="product-modal__extra-checkbox"
                />
                <span className="product-modal__extra-checkbox-custom">
                  {isSelected && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <span className="product-modal__extra-name">{extra.name}</span>
              </div>
              <span className="product-modal__extra-price">
                +{extra.price.toFixed(2)} €
              </span>
            </label>
          );
        })}
      </div>
    </div>
  </div>
);
