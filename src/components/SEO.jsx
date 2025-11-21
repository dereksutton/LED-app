import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = () => {
    const siteData = {
        title: "LED Custom Painting & More - Professional Painting Services in North Florida",
        description: "Transform your space with North Florida's premier painting professionals. Licensed & insured with 13+ years experience. Interior, exterior, commercial painting & more. Free quotes!",
        url: "https://ledcustompainting.com",
        image: "/src/assets/led-hero.png",
        phone: "(904) 385-0426",
        email: "info@ledcustompainting.com",
        address: {
            streetAddress: "North Florida",
            addressLocality: "Jacksonville",
            addressRegion: "FL",
            postalCode: "32256",
            addressCountry: "US"
        }
    };

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "LED Custom Painting & More",
        "image": siteData.image,
        "url": siteData.url,
        "telephone": siteData.phone,
        "email": siteData.email,
        "address": siteData.address,
        "priceRange": "$$",
        "servesCuisineArea": "North Florida",
        "areaServed": {
            "@type": "GeoCircle",
            "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": "30.3322",
                "longitude": "-81.6557"
            },
            "geoRadius": "50000"
        },
        "sameAs": [
            "https://www.facebook.com/ledcustompainting",
            "https://www.instagram.com/led_custom_painting"
        ],
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "08:00",
                "closes": "18:00"
            },
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": "Saturday",
                "opens": "09:00",
                "closes": "16:00"
            }
        ],
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5.0",
            "reviewCount": "127"
        }
    };

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{siteData.title}</title>
            <meta name="title" content={siteData.title} />
            <meta name="description" content={siteData.description} />
            <meta name="keywords" content="painting services, interior painting, exterior painting, commercial painting, cabinet refinishing, pressure washing, North Florida, Jacksonville, professional painters, licensed painters, insured painters, free quotes, LED Custom Painting" />
            <meta name="robots" content="index, follow" />
            <meta name="language" content="English" />
            <meta name="author" content="LED Custom Painting & More" />
            <link rel="canonical" href={siteData.url} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={siteData.url} />
            <meta property="og:title" content={siteData.title} />
            <meta property="og:description" content={siteData.description} />
            <meta property="og:image" content={siteData.image} />
            <meta property="og:locale" content="en_US" />
            <meta property="og:site_name" content="LED Custom Painting & More" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={siteData.url} />
            <meta property="twitter:title" content={siteData.title} />
            <meta property="twitter:description" content={siteData.description} />
            <meta property="twitter:image" content={siteData.image} />

            {/* Additional SEO Tags */}
            <meta name="theme-color" content="#2C3E50" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <meta name="format-detection" content="telephone=yes" />

            {/* Geo Tags for Local SEO */}
            <meta name="geo.region" content="US-FL" />
            <meta name="geo.placename" content="Jacksonville" />
            <meta name="geo.position" content="30.3322;-81.6557" />
            <meta name="ICBM" content="30.3322, -81.6557" />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>

            {/* Preconnect to external domains for performance */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

            {/* DNS Prefetch for performance */}
            <link rel="dns-prefetch" href="https://www.google-analytics.com" />
            <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        </Helmet>
    );
};

export default SEO;