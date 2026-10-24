import React, { useCallback, useRef, useState } from 'react';
import {
  getAnnouncementImageUrl,
  uploadAnnouncementImage,
} from '../../../utils/adminSettings';
import { compressImage } from '../../../utils/imageCompression';
import './AdminAnnouncementImage.less';

interface AdminAnnouncementImageProps {
  imageId: string;
  onChange: (imageId: string) => void;
}

const ACCEPTED_TYPES = 'image/jpeg,image/png,image/webp';

export const AdminAnnouncementImage: React.FC<AdminAnnouncementImageProps> = ({
  imageId,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = '';
      if (!file) return;

      setIsUploading(true);
      setUploadError('');
      try {
        const uploadedId = await uploadAnnouncementImage(
          await compressImage(file),
        );
        if (uploadedId) {
          onChange(uploadedId);
        } else {
          setUploadError('Obrázok sa nepodarilo nahrať. Skúste to znova.');
        }
      } catch {
        setUploadError('Tento súbor sa nedá spracovať. Použite JPG alebo PNG.');
      } finally {
        setIsUploading(false);
      }
    },
    [onChange],
  );

  const handlePick = useCallback(() => inputRef.current?.click(), []);
  const handleRemove = useCallback(() => onChange(''), [onChange]);

  let buttonLabel = imageId ? 'Zmeniť obrázok' : 'Nahrať obrázok';
  if (isUploading) buttonLabel = 'Nahrávam…';

  return (
    <div className="admin-panel__section">
      <h2 className="admin-panel__section-title">Obrázok k oznámeniu</h2>
      <p className="admin-panel__section-description">
        Voliteľné — napríklad leták promo akcie. Zobrazí sa zákazníkom spolu s
        textom. Zmena sa prejaví po uložení.
      </p>

      <div className="admin-announcement-image">
        {imageId && (
          <img
            src={getAnnouncementImageUrl(imageId)}
            alt="Náhľad obrázka oznámenia"
            className="admin-announcement-image__preview"
          />
        )}

        <div className="admin-announcement-image__actions">
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_TYPES}
            onChange={handleFileChange}
            className="admin-announcement-image__input"
          />
          <button
            type="button"
            onClick={handlePick}
            disabled={isUploading}
            className="admin-announcement-image__button"
          >
            {buttonLabel}
          </button>
          {imageId && !isUploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="admin-announcement-image__button admin-announcement-image__button--remove"
            >
              Odstrániť obrázok
            </button>
          )}
        </div>

        {uploadError && (
          <div className="admin-panel__error-message">✗ {uploadError}</div>
        )}
      </div>
    </div>
  );
};
