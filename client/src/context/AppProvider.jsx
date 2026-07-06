/**
 * Shukla Industrial — Application Context
 * Location: client/src/context/AppProvider.jsx
 *
 * Provides global site settings and company info.
 * Will fetch from API in later modules; uses constants as defaults for now.
 */
import { createContext, useContext, useMemo } from 'react';
import { COMPANY, CONTACT, SOCIAL_LINKS, MAP_EMBED_URL, MAP_LINK } from '@utils/constants';

const AppContext = createContext(null);

export const AppProvider = ({ children, siteSettings = null }) => {
  const value = useMemo(
    () => ({
      company: siteSettings?.company ?? COMPANY,
      contact: siteSettings?.contact ?? CONTACT,
      social: siteSettings?.social ?? SOCIAL_LINKS,
      mapEmbedUrl: siteSettings?.mapEmbedUrl ?? MAP_EMBED_URL,
      mapLink: siteSettings?.mapLink ?? MAP_LINK,
      isLoading: false,
    }),
    [siteSettings]
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
