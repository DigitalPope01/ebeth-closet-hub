import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  structuredData?: object;
}

export default function SEO({
  title = "Ebeth Boutique Abuja – Exquisite Men's and Women's Fashion & Accessories",
  description = "Discover premium fashion, luxury accessories, and household essentials at Ebeth Boutique in Abuja. Shop exquisite designer collections for men and women with fast delivery across Nigeria.",
  keywords = "Ebeth Boutique, Abuja fashion boutique, luxury fashion Nigeria, women's fashion Abuja, men's fashion Abuja, designer accessories, premium boutique, Nigerian fashion store, exquisite fashion, luxury handbags, designer shoes, household essentials",
  ogImage = "/pwa-512x512.png",
  canonicalUrl,
  structuredData,
}: SEOProps) {
  const siteUrl = "https://ebeth-boutique.lovable.app";
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Ebeth Boutique & Exquisite Store" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullCanonicalUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Ebeth Boutique & Exquisite Store" />
      <meta name="geo.region" content="NG-FC" />
      <meta name="geo.placename" content="Abuja" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      {/* Organization Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Ebeth Boutique & Exquisite Store",
          "url": siteUrl,
          "logo": `${siteUrl}/pwa-512x512.png`,
          "description": "Premium fashion boutique in Abuja offering exquisite men's and women's fashion, luxury accessories, and household essentials",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Abuja",
            "addressCountry": "Nigeria"
          },
          "sameAs": []
        })}
      </script>
    </Helmet>
  );
}
