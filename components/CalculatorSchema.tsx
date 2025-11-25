import Script from 'next/script';

interface FAQItem {
  question: string;
  answer: string;
}

interface CalculatorSchemaProps {
  name: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  faqItems?: FAQItem[];
}

export default function CalculatorSchema({
  name,
  description,
  url,
  datePublished = '2024-01-01',
  dateModified = '2024-11-24',
  faqItems = []
}: CalculatorSchemaProps) {
  const baseUrl = 'https://calculily.com';

  // WebApplication schema for the calculator
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: name,
    description: description,
    url: `${baseUrl}${url}`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Calculily',
      url: baseUrl
    },
    datePublished,
    dateModified
  };

  // FAQPage schema if FAQ items are provided
  const faqSchema = faqItems.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  } : null;

  // BreadcrumbList schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Calculators',
        item: `${baseUrl}/calculators`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: name,
        item: `${baseUrl}${url}`
      }
    ]
  };

  return (
    <>
      <Script
        id={`schema-webapp-${url.replace(/\//g, '-')}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      {faqSchema && (
        <Script
          id={`schema-faq-${url.replace(/\//g, '-')}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <Script
        id={`schema-breadcrumb-${url.replace(/\//g, '-')}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
