import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component
 * Automatically scrolls window to top upon route changes.
 * If hash is present (e.g. #faq), smoothly scrolls to the element with that id.
 */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior,
    });
  }, [pathname, search, hash]);

  return null;
}
