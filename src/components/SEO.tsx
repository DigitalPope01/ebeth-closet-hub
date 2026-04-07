import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  schema?: object | object[];
}

const siteOrigin = typeof window !== "undefined" ? window.location.origin : "";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  "@id": `${siteOrigin}/#organization`,
  name: "Ebeth Boutique and Exquisite Store",
  alternateName: "EBETH Boutique",
  url: siteOrigin,
  logo: `${siteOrigin}/ebeth-logo.jpg`,
  image: `${siteOrigin}/ebeth-logo.jpg`,
  description:
    "Premium fashion boutique in Abuja offering designer clothing, luxury accessories, and household essentials. Boutique elegance meets everyday convenience.",
  telephone: "+2349092034816",
  email: "ebethstores@gmail.com",
  priceRange: "₦₦-₦₦₦",
  currenciesAccepted: "NGN",
  paymentAccepted: "Cash, Bank Transfer, Card Payment",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Atlantic Mall, 40 Ajose Adeogun St, Near Peace Mass Park",
    addressLocality: "Utako, Abuja",
    postalCode: "900108",
    addressRegion: "FCT",
    addressCountry: "NG",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 9.0579,
    longitude: 7.4467,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
    ],
    opens: "07:00",
    closes: "22:00",
  },
  sameAs: [
    "https://web.facebook.com/ebethstores",
    "https://www.instagram.com/ebeth_stores",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+2349092034816",
    contactType: "customer service",
    areaServed: "NG",
    availableLanguage: "English",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteOrigin}/#website`,
  name: "Ebeth Boutique and Exquisite Store",
  url: siteOrigin,
  publisher: { "@id": `${siteOrigin}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteOrigin}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const breadcrumbHome = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: siteOrigin,
    },
  ],
};

export default function SEO({
  title,
  description,
  keywords = "fashion, boutique, Abuja, exquisite, accessories, women's wear, men's fashion, household, luxury",
  image = "/ebeth-logo.jpg",
  url = typeof window !== "undefined" ? window.location.href : "",
  type = "website",
  schema,
}: SEOProps) {
  const siteName = "Ebeth Boutique and Exquisite Store";
  const fullTitle = `${title} | ${siteName}`;

  const schemas = Array.isArray(schema) ? schema : schema ? [schema] : [];

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_NG" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Organization Schema */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>

      {/* WebSite Schema with SearchAction */}
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>

      {/* Breadcrumb Schema */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbHome)}
      </script>

      {/* Page-specific schemas */}
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}

// Helper to build FAQ schema from Q&A pairs
export function buildFAQSchema(
  faqs: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// Helper to build Product schema
export function buildProductSchema(product: {
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  image: string;
  sku?: string;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.name,
    image: product.image,
    sku: product.sku || "",
    brand: {
      "@type": "Brand",
      name: "Ebeth Boutique",
    },
    offers: {
      "@type": "Offer",
      url: typeof window !== "undefined" ? window.location.href : "",
      priceCurrency: "NGN",
      price: product.price,
      ...(product.originalPrice && {
        priceValidUntil: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      }),
      availability: product.inStock !== false
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@id": `${siteOrigin}/#organization` },
    },
    ...(product.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviewCount || 1,
        bestRating: 5,
      },
    }),
  };
}
