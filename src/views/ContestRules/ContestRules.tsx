import React from 'react';
import { Navigate } from 'react-router-dom';
import { useLocale } from '../../i18n/LocaleContext';
import { CONTEST_CONTENT } from '../../legal/contest';
import { CONTEST_PATH } from '../../legal/paths';
import LegalPage from '../LegalPage/LegalPage';

const CONTENT = { sk: CONTEST_CONTENT, pl: CONTEST_CONTENT };
const PATHS = { sk: CONTEST_PATH };

/** The contest runs on the Slovak Instagram only; the Polish site redirects home. */
const ContestRules: React.FC = () => {
  const { locale, t } = useLocale();

  if (locale !== 'sk') {
    return <Navigate to="/" replace />;
  }

  return (
    <LegalPage
      content={CONTENT}
      title={t('contest_title')}
      headTitle={`${t('contest_head_title')} | ${t('seo_site_name')}`}
      description={t('contest_head_description')}
      pathByLocale={PATHS}
    />
  );
};

export default ContestRules;
