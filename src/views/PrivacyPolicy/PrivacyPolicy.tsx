import React from 'react';
import { useLocale } from '../../i18n/LocaleContext';
import { PRIVACY_CONTENT } from '../../legal/privacy';
import { LEGAL_PATHS } from '../../legal/paths';
import LegalPage from '../LegalPage/LegalPage';

const PrivacyPolicy: React.FC = () => {
  const { t } = useLocale();

  return (
    <LegalPage
      content={PRIVACY_CONTENT}
      title={t('privacy_title')}
      headTitle={`${t('privacy_head_title')} | ${t('seo_site_name')}`}
      description={t('privacy_head_description')}
      pathByLocale={LEGAL_PATHS.privacy}
      lastUpdatedLabel={t('privacy_last_update')}
    />
  );
};

export default PrivacyPolicy;
