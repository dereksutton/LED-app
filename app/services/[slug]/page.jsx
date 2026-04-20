import { services, getServiceBySlug, getAllServiceSlugs } from '../../../src/data/services';
import ServicePageLayout from '../../../src/components/ServicePageLayout';

export function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  const title = `${service.name} Jacksonville FL | LED Custom Painting`;
  const description = `Professional ${service.name.toLowerCase()} services in Jacksonville & North Florida. Licensed, insured, 3-year warranty. Free quotes — (904) 385-0426.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/services/${service.slug}`,
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: `https://ledcustompainting.com/services/${service.slug}`,
      images: [
        {
          url: service.image,
          width: 1200,
          height: 630,
          alt: `${service.name} by LED Custom Painting in Jacksonville FL`,
        },
      ],
      locale: 'en_US',
      siteName: 'LED Custom Painting & More',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [
        {
          url: service.image,
          alt: `${service.name} by LED Custom Painting in Jacksonville FL`,
        },
      ],
    },
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return <div>Service not found</div>;
  }

  // Get related services (all except the current one, limit to 3)
  const relatedServices = services
    .filter((s) => s.slug !== service.slug)
    .slice(0, 3);

  // Build structured data for this service page
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description.split('\n\n')[0],
    provider: { '@id': 'https://ledcustompainting.com/#business' },
    areaServed: { '@type': 'City', name: 'Jacksonville', addressRegion: 'FL' },
    serviceType: service.name,
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://ledcustompainting.com/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: 'https://ledcustompainting.com/services/',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: service.name,
        item: `https://ledcustompainting.com/services/${service.slug}/`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ServicePageLayout
        service={service}
        relatedServices={relatedServices}
      />
    </>
  );
}
