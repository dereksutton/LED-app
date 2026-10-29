"use client";
import { useEffect } from 'react';
import Script from 'next/script';
import { GA_ID, ADS_ID, META_PIXEL_ID, trackCall, trackEmail } from '../lib/analytics';

// Loads GA4 (plus Google Ads and Meta Pixel when their IDs are set) and
// reports every tel:/mailto: click site-wide, so individual links don't need
// their own handlers.
export default function Analytics() {
  useEffect(() => {
    const onClick = (e) => {
      const link = e.target.closest && e.target.closest('a[href^="tel:"], a[href^="mailto:"]');
      if (!link) return;
      const location = window.location.pathname;
      if (link.getAttribute('href').startsWith('tel:')) {
        trackCall({ location });
      } else {
        trackEmail({ location });
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
          ${ADS_ID ? `gtag('config', '${ADS_ID}');` : ''}`}
      </Script>
      {META_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
          document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');`}
        </Script>
      )}
    </>
  );
}
