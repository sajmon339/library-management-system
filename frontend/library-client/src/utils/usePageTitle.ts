import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

type UseTitleOptions = {
  prefix?: string;
  suffix?: string;
};

/**
 * A hook that sets the document title based on translation keys
 * @param titleKey The translation key for the title
 * @param options Configuration options
 */
export const usePageTitle = (titleKey: string, options: UseTitleOptions = {}) => {
  const { t } = useTranslation();
  const { prefix, suffix } = options;

  useEffect(() => {
    const translatedTitle = t(titleKey);
    let fullTitle = translatedTitle;
    
    if (prefix) {
      fullTitle = `${prefix} ${fullTitle}`;
    }
    
    if (suffix) {
      fullTitle = `${fullTitle} ${suffix}`;
    }
    
    document.title = fullTitle;
  }, [t, titleKey, prefix, suffix]);
};

/**
 * Updates the page title using the app title from translations
 */
export const useAppTitle = () => {
  const { t, i18n } = useTranslation();
  
  useEffect(() => {
    document.title = t('app.title');
  }, [t, i18n.language]);
};