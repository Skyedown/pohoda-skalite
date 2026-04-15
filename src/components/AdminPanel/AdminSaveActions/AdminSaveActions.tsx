import React from 'react';
import './AdminSaveActions.less';

interface AdminSaveActionsProps {
  onSave: () => void;
  saveSuccess: boolean;
  saveError: string;
}

export const AdminSaveActions: React.FC<AdminSaveActionsProps> = ({
  onSave,
  saveSuccess,
  saveError,
}) => {
  return (
    <div className="admin-panel__actions">
      <button
        onClick={onSave}
        className="admin-panel__button admin-panel__button--primary"
      >
        Uložiť zmeny
      </button>
      {saveSuccess && (
        <div className="admin-panel__success">✓ Zmeny boli úspešne uložené</div>
      )}
      {saveError && (
        <div className="admin-panel__error-message">✗ {saveError}</div>
      )}
    </div>
  );
};
