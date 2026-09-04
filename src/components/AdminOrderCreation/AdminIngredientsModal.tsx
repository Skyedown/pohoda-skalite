import React from 'react';
import './AdminIngredientsModal.less';

interface AdminIngredientsModalProps {
  productName: string;
  ingredients: string[];
  removedIngredients: string[];
  onToggleIngredient: (ingredient: string) => void;
  onClose: () => void;
}

const AdminIngredientsModal: React.FC<AdminIngredientsModalProps> = ({
  productName,
  ingredients,
  removedIngredients,
  onToggleIngredient,
  onClose,
}) => {
  return (
    <div className="admin-ingredients-modal" onClick={onClose}>
      <div
        className="admin-ingredients-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-ingredients-modal__header">
          <h3 className="admin-ingredients-modal__title">
            Úprava ingrediencií - {productName}
          </h3>
          <button
            type="button"
            className="admin-ingredients-modal__close"
            onClick={onClose}
            aria-label="Zavrieť"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <p className="admin-ingredients-modal__description">
          Odškrtnite ingrediencie, ktoré chcete odstrániť z produktu
        </p>

        <div className="admin-ingredients-modal__list">
          {ingredients.map((ingredient) => {
            const isRemoved = removedIngredients.includes(ingredient);
            return (
              <label
                key={ingredient}
                className={`admin-ingredients-modal__item ${
                  isRemoved ? 'admin-ingredients-modal__item--removed' : ''
                }`}
              >
                <div className="admin-ingredients-modal__checkbox-wrapper">
                  <input
                    type="checkbox"
                    checked={!isRemoved}
                    onChange={() => onToggleIngredient(ingredient)}
                    className="admin-ingredients-modal__checkbox"
                  />
                  <span className="admin-ingredients-modal__checkbox-custom">
                    {!isRemoved && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                </div>
                <span className="admin-ingredients-modal__ingredient-name">
                  {ingredient}
                </span>
              </label>
            );
          })}
        </div>

        <div className="admin-ingredients-modal__footer">
          <button
            type="button"
            className="admin-ingredients-modal__done-btn"
            onClick={onClose}
          >
            Hotovo
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminIngredientsModal;
