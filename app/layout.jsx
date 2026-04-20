import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'LED Custom Painting & More - Professional Painting Services in North Florida',
  description: "Transform your space with North Florida's premier painting professionals. Licensed & insured with 13+ years experience. Interior, exterior, commercial painting & more. Free quotes!",
  keywords: 'painting services, interior painting, exterior painting, commercial painting, cabinet refinishing, pressure washing, North Florida, Jacksonville, professional painters, licensed painters, insured painters, free quotes, LED Custom Painting',
  authors: [{ name: 'LED Custom Painting & More' }],
  metadataBase: new URL('https://ledcustompainting.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: 'https://ledcustompainting.com/',
    title: 'LED Custom Painting & More - Professional Painting Services in North Florida',
    description: "Transform your space with North Florida's premier painting professionals. Licensed & insured with 13+ years experience. Interior, exterior, commercial painting & more. Free quotes!",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LED Custom Painting & More - Professional Painting Services in North Florida',
      },
    ],
    locale: 'en_US',
    siteName: 'LED Custom Painting & More',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LED Custom Painting & More - Professional Painting Services in North Florida',
    description: "Transform your space with North Florida's premier painting professionals. Licensed & insured with 13+ years experience.",
    images: [
      {
        url: '/og-image.jpg',
        alt: 'LED Custom Painting & More - Professional Painting Services in North Florida',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
  other: {
    'geo.region': 'US-FL',
    'geo.placename': 'Jacksonville',
    'geo.position': '30.3322;-81.6557',
    'ICBM': '30.3322, -81.6557',
    'format-detection': 'telephone=yes',
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport = {
  themeColor: '#2C3E50',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Structured Data: LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": "https://ledcustompainting.com/#business",
              "name": "LED Custom Painting & More",
              "url": "https://ledcustompainting.com",
              "image": "https://ledcustompainting.com/og-image.jpg",
              "telephone": "(904) 385-0426",
              "email": "info@ledcustompainting.com",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Jacksonville",
                "addressRegion": "FL",
                "postalCode": "32256",
                "addressCountry": "US",
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 30.3322,
                "longitude": -81.6557,
              },
              "areaServed": {
                "@type": "GeoCircle",
                "geoMidpoint": {
                  "@type": "GeoCoordinates",
                  "latitude": 30.3322,
                  "longitude": -81.6557,
                },
                "geoRadius": "50000",
              },
              "priceRange": "$$",
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  "opens": "08:00",
                  "closes": "18:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": "Saturday",
                  "opens": "09:00",
                  "closes": "16:00",
                },
              ],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5.0",
                "reviewCount": "127",
                "bestRating": "5",
                "worstRating": "1",
              },
              "sameAs": [
                "https://www.facebook.com/ledcustompainting",
                "https://www.instagram.com/led_custom_painting",
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Painting Services",
                "itemListElement": [
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Interior Painting", "description": "Professional interior painting services for homes and businesses in North Florida." } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Exterior Painting", "description": "Expert exterior painting to protect and beautify your property." } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Pressure Washing", "description": "Thorough pressure washing services for driveways, decks, and exteriors." } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Cabinet Refinishing", "description": "Transform your kitchen with professional cabinet refinishing." } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Ceiling Services", "description": "Ceiling painting, popcorn ceiling removal, and specialty finishes." } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Commercial Painting", "description": "Large-scale commercial painting for offices, retail, and industrial spaces." } },
                ],
              },
            }),
          }}
        />

        {/* Structured Data: WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "LED Custom Painting & More",
              "url": "https://ledcustompainting.com",
            }),
          }}
        />

        {/* Structured Data: BreadcrumbList */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [{
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://ledcustompainting.com/",
              }],
            }),
          }}
        />
      </head>
      <body style={{ margin: '0 auto', textAlign: 'center', overflowX: 'hidden' }}>
        {children}

        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-059TGJP58C"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-059TGJP58C');`}
        </Script>

        {/* DotLottie Player Web Component */}
        <Script
          src="https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs"
          type="module"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
