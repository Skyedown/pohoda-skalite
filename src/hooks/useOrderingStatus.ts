import { useEffect, useMemo, useState } from 'react';
import { useLocale } from '../i18n/LocaleContext';
import {
  resolveOrderingStatus,
  type OrderingStatusInfo,
} from '../utils/orderingStatus';
import { useAdminSettings } from './useAdminSettings';

const REFRESH_INTERVAL_MS = 60000;

export function useOrderingStatus(): OrderingStatusInfo {
  const settings = useAdminSettings();
  const { locale, t } = useLocale();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setTick((value) => value + 1),
      REFRESH_INTERVAL_MS,
    );
    return () => clearInterval(interval);
  }, []);

  return useMemo(
    () => resolveOrderingStatus(settings, locale, t),
    // `tick` re-evaluates the time-of-day branch every minute
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [settings, locale, t, tick],
  );
}
