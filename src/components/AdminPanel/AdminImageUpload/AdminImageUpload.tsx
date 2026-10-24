import React, { useCallback, useRef, useState } from 'react';
import {
  getAnnouncementImageUrl,
  uploadAnnouncementImage,
} from '../../../utils/adminSettings';
import { compressImage } from '../../../utils/imageCompression';
import './AdminImageUpload.less';

interface AdminImageUploadProps {
  label: string;
  imageId: string;
  onChange: (imageId: string) => void;
}

const ACCEPTED_TYPES = 'image/jpeg,image/png,image/webp';

export const AdminImageUpload: React.FC<AdminImageUploadProps> = ({
  label,
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
    <div className="admin-image-upload">
      <span className="admin-image-upload__label">{label}</span>

      {imageId && (
        <img
          src={getAnnouncementImageUrl(imageId)}
          alt="Náhľad obrázka oznámenia"
          className="admin-image-upload__preview"
        />
      )}

      <div className="admin-image-upload__actions">
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          onChange={handleFileChange}
          className="admin-image-upload__input"
        />
        <button
          type="button"
          onClick={handlePick}
          disabled={isUploading}
          className="admin-image-upload__button"
        >
          {buttonLabel}
        </button>
        {imageId && !isUploading && (
          <button
            type="button"
            onClick={handleRemove}
            className="admin-image-upload__button admin-image-upload__button--remove"
          >
            Odstrániť obrázok
          </button>
        )}
      </div>

      {uploadError && (
        <div className="admin-panel__error-message">✗ {uploadError}</div>
      )}
    </div>
  );
};
