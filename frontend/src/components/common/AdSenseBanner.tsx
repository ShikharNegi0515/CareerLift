import React, { useEffect, useRef } from 'react';

interface AdSenseBannerProps {
  /** The Ad Slot ID from Google AdSense */
  slot?: string;
  /** Format of the ad: auto, fluid, rectangle, horizontal, etc. */
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  /** Whether the ad should be responsive (default: true) */
  responsive?: boolean;
  /** Layout key for in-feed / native ads */
  layoutKey?: string;
  /** Optional custom CSS classes */
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

/**
 * Reusable Google AdSense Banner Component for React / Vite SPAs.
 * Safely initializes ads without causing duplicate push errors during client-side navigation.
 */
export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  slot = '1234567890', // Default placeholder slot
  format = 'auto',
  responsive = true,
  layoutKey,
  className = '',
}) => {
  const adRef = useRef<HTMLModElement | null>(null);

  // You can set VITE_ADSENSE_CLIENT in your .env or replace with your ca-pub ID
  const adClient = import.meta.env.VITE_ADSENSE_CLIENT || 'ca-pub-XXXXXXXXXXXXXXXX';
  const isProduction = import.meta.env.PROD;

  useEffect(() => {
    // Check if script exists and element has not been populated yet
    if (typeof window !== 'undefined') {
      try {
        if (adRef.current && !adRef.current.getAttribute('data-adsbygoogle-status')) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (err) {
        console.warn('AdSense rendering warning:', err);
      }
    }
  }, []);

  return (
    <div
      className={`adsense-wrapper overflow-hidden my-4 text-center ${className}`}
      style={{ minHeight: '90px' }}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
        {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
        {...(!isProduction ? { 'data-adtest': 'on' } : {})}
      />
    </div>
  );
};

export default AdSenseBanner;
