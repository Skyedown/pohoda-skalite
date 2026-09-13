import React, { useCallback } from 'react';
import type { LocalizedText } from '../../../i18n/types';
import '../AdminTextareaSection/AdminTextareaSection.less';
import './AdminLocalizedTextareaSection.less';

interface AdminLocalizedTextareaSectionProps {
  id: string;
  title: string;
  label: string;
  placeholderSk: string;
  placeholderPl: string;
  value: LocalizedText;
  onChange: (value: LocalizedText) => void;
}

const MAX_LENGTH = 500;

export const AdminLocalizedTextareaSection: React.FC<
  AdminLocalizedTextareaSectionProps
> = ({ id, title, label, placeholderSk, placeholderPl, value, onChange }) => {
  const handleSkChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      onChange({ ...value, sk: e.target.value }),
    [onChange, value],
  );

  const handlePlChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      onChange({ ...value, pl: e.target.value }),
    [onChange, value],
  );

  return (
    <div className="admin-panel__section">
      <h2 className="admin-panel__section-title">{title}</h2>
      <p className="admin-panel__section-description">
        Text sa zobrazí na oboch weboch — slovenská verzia na pizzapohoda.sk,
        poľská na pizzapohoda.pl.
      </p>

      <div className="admin-localized-textarea">
        <div className="admin-localized-textarea__field">
          <div className="admin-panel__textarea-group">
            <label htmlFor={`${id}-sk`}>
              <span className="admin-localized-textarea__flag">🇸🇰</span> {label}{' '}
              (slovensky)
            </label>
            <textarea
              id={`${id}-sk`}
              value={value.sk}
              onChange={handleSkChange}
              className="admin-panel__textarea"
              rows={4}
              maxLength={MAX_LENGTH}
              placeholder={placeholderSk}
            />
            <div className="admin-panel__char-counter">
              {value.sk.length} / {MAX_LENGTH} znakov
            </div>
          </div>
        </div>

        <div className="admin-localized-textarea__field">
          <div className="admin-panel__textarea-group">
            <label htmlFor={`${id}-pl`}>
              <span className="admin-localized-textarea__flag">🇵🇱</span> {label}{' '}
              (po poľsky)
            </label>
            <textarea
              id={`${id}-pl`}
              value={value.pl}
              onChange={handlePlChange}
              className="admin-panel__textarea"
              rows={4}
              maxLength={MAX_LENGTH}
              placeholder={placeholderPl}
            />
            <div className="admin-panel__char-counter">
              {value.pl.length} / {MAX_LENGTH} znakov
            </div>
            {!value.pl.trim() && (
              <p className="admin-localized-textarea__warning">
                Poľský text chýba — poľským zákazníkom sa nezobrazí nič.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
