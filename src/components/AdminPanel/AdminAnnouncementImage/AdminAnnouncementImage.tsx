import React, { useCallback } from 'react';
import type { LocalizedText } from '../../../i18n/types';
import { AdminImageUpload } from '../AdminImageUpload/AdminImageUpload';
import './AdminAnnouncementImage.less';

interface AdminAnnouncementImageProps {
  imageIds: LocalizedText;
  onChange: (imageIds: LocalizedText) => void;
}

export const AdminAnnouncementImage: React.FC<AdminAnnouncementImageProps> = ({
  imageIds,
  onChange,
}) => {
  const handleSkChange = useCallback(
    (sk: string) => onChange({ ...imageIds, sk }),
    [onChange, imageIds],
  );

  const handlePlChange = useCallback(
    (pl: string) => onChange({ ...imageIds, pl }),
    [onChange, imageIds],
  );

  return (
    <div className="admin-panel__section">
      <h2 className="admin-panel__section-title">Obrázok k oznámeniu</h2>
      <p className="admin-panel__section-description">
        Voliteľné — napríklad leták promo akcie. Slovenský obrázok sa zobrazí na
        pizzapohoda.sk, poľský na pizzapohoda.pl. Zmena sa prejaví po uložení.
      </p>

      <div className="admin-announcement-image">
        <AdminImageUpload
          label="🇸🇰 Obrázok (slovensky)"
          imageId={imageIds.sk}
          onChange={handleSkChange}
        />
        <AdminImageUpload
          label="🇵🇱 Obrázok (po poľsky)"
          imageId={imageIds.pl}
          onChange={handlePlChange}
        />
      </div>
    </div>
  );
};
