'use client';

import { useEffect, useRef } from 'react';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  adLayout?: string;
  adLayoutKey?: string;
  style?: React.CSSProperties;
  className?: string;
  fullWidthResponsive?: boolean;
}

export default function AdSense({
  adSlot,
  adFormat = 'auto',
  adLayout,
  adLayoutKey,
  style = { display: 'block' },
  className = '',
  fullWidthResponsive = true
}: AdSenseProps) {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // Only load ads in production or when explicitly enabled
    const adSenseEnabled = process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true';

    if (!adSenseEnabled) {
      return;
    }

    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  // Show placeholder when AdSense is enabled for testing but no real client ID is set
  const showPlaceholder = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true' &&
                          !process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID;

  // Also show placeholder in development unless AdSense is fully configured
  const showDevPlaceholder = process.env.NODE_ENV === 'development' &&
                            process.env.NEXT_PUBLIC_ADSENSE_ENABLED !== 'false';

  if (showPlaceholder || showDevPlaceholder) {
    return (
      <div
        className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${className}`}
        style={{ minHeight: '250px', ...style }}
      >
        <div className="text-center p-4">
          <div className="text-gray-500 text-sm font-medium mb-2">AdSense Placeholder</div>
          <div className="text-gray-400 text-xs">Slot: {adSlot}</div>
          <div className="text-gray-400 text-xs">Format: {adFormat}</div>
          <div className="text-gray-400 text-xs">
            {process.env.NODE_ENV === 'production' ? 'Production' : 'Development'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className}`}
      style={style}
      data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-ad-layout={adLayout}
      data-ad-layout-key={adLayoutKey}
      data-full-width-responsive={fullWidthResponsive.toString()}
    />
  );
}

// Predefined ad slot components for common use cases
export function HeaderBannerAd({ className = '' }: { className?: string }) {
  return (
    <AdSense
      adSlot={process.env.NEXT_PUBLIC_ADSENSE_HEADER_SLOT || ''}
      adFormat="horizontal"
      className={`w-full ${className}`}
      style={{ display: 'block', minHeight: '90px' }}
    />
  );
}

export function SidebarAd({ className = '' }: { className?: string }) {
  return (
    <AdSense
      adSlot={process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT || ''}
      adFormat="rectangle"
      className={className}
      style={{ display: 'block', width: '300px', height: '250px' }}
    />
  );
}

export function ContentAd({ className = '' }: { className?: string }) {
  return (
    <AdSense
      adSlot={process.env.NEXT_PUBLIC_ADSENSE_CONTENT_SLOT || ''}
      adFormat="auto"
      className={`w-full ${className}`}
      style={{ display: 'block', minHeight: '250px' }}
    />
  );
}

export function FooterAd({ className = '' }: { className?: string }) {
  return (
    <AdSense
      adSlot={process.env.NEXT_PUBLIC_ADSENSE_FOOTER_SLOT || ''}
      adFormat="horizontal"
      className={`w-full ${className}`}
      style={{ display: 'block', minHeight: '90px' }}
    />
  );
}

// Declare adsbygoogle for TypeScript
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}