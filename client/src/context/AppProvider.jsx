/**
 * Shukla Industrial — Application Context
 * Location: client/src/context/AppProvider.jsx
 *
 * Fetches company info and site settings from API; falls back to constants.
 */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchSiteBootstrap } from '@api/site';
import { COMPANY, CONTACT, SOCIAL_LINKS, MAP_EMBED_URL, MAP_LINK, SEO_DEFAULT } from '@utils/constants';
import { mergeSiteData } from '@utils/siteDataMapper';

const AppContext = createContext(null);

const defaultValue = {
  company: COMPANY,
  contact: CONTACT,
  social: SOCIAL_LINKS,
  mapEmbedUrl: MAP_EMBED_URL,
  mapLink: MAP_LINK,
  seo: SEO_DEFAULT,
  isLoading: true,
};

export const AppProvider = ({ children }) => {
  const [siteData, setSiteData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchSiteBootstrap()
      .then(({ company, settings }) => {
        if (cancelled) return;
        if (company || settings) {
          setSiteData(mergeSiteData(company || {}, settings || {}));
        }
      })
      .catch(() => {
        /* Use constants fallback */
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      company: siteData?.company ?? COMPANY,
      contact: siteData?.contact ?? CONTACT,
      social: siteData?.social ?? SOCIAL_LINKS,
      mapEmbedUrl: siteData?.mapEmbedUrl ?? MAP_EMBED_URL,
      mapLink: siteData?.mapLink ?? MAP_LINK,
      seo: siteData?.seo ?? SEO_DEFAULT,
      isLoading,
    }),
    [siteData, isLoading]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
