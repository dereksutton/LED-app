"use client";
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import Analytics from './Analytics';
import MobileActionBar from './MobileActionBar';

// Marketing extras: the phone bar, tracking and the animation player. The
// dashboard and the customer document pages get none of them, so no
// tracking script ever sees a customer's private link.
const PRIVATE = ['/admin', '/d'];

export default function SiteChrome() {
  const pathname = usePathname() || '';
  if (PRIVATE.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null;
  return (
    <>
      <MobileActionBar />
      <Analytics />
      {/* DotLottie Player Web Component */}
      <Script
        src="https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs"
        type="module"
        strategy="afterInteractive"
      />
    </>
  );
}
