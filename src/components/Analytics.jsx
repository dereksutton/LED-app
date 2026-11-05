"use client";
import { useEffect } from 'react';
import Script from 'next/script';
import { GA_ID, ADS_ID, META_PIXEL_ID, recordContactIntent, trackCall, trackEmail, trackText } from '../lib/analytics';
import { getRefCode, readAttribution } from '../lib/attribution';

// Loads GA4 (plus Google Ads and Meta Pixel when their IDs are set) and
// reports every tel:/sms:/mailto: click site-wide, so individual links don't
// need their own handlers. Call and text taps are also recorded for the
// owner's dashboard.
export default function Analytics() {
  useEffect(() => {
    const onClick = (e) => {
      const link = e.target.closest && e.target.closest('a[href^="tel:"], a[href^="sms:"], a[href^="mailto:"]');
      if (!link) return;
      const location = window.location.pathname;
      const href = link.getAttribute('href');
      if (href.startsWith('tel:') || href.startsWith('sms:')) {
        const kind = href.startsWith('tel:') ? 'call' : 'text';
        if (kind === 'call') trackCall({ location });
        else trackText({ location });
        recordContactIntent({ kind, refCode: getRefCode(), attribution: readAttribution() });
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
