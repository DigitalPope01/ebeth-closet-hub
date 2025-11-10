import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  schema?: object;
}

export default function SEO({
  title,
  description,
  keywords = "fashion, boutique, Abuja, exquisite, accessories, women's wear, men's fashion, household, luxury",
  image = "/ebeth-logo.jpg",
  url = window.location.href,
  type = "website",
  schema,
}: SEOProps) {
  const siteName = "Ebeth Boutique and Exquisite Store";
  const fullTitle = `${title} | ${siteName}`;

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

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Schema.org JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}

      {/* Organization Schema - Always include */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": siteName,
          "url": window.location.origin,
          "logo": `${window.location.origin}/ebeth-logo.jpg`,
          "description": "Premium fashion boutique and exquisite store in Abuja offering designer clothing, luxury accessories, and household essentials",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Abuja",
            "addressCountry": "NG"
          },
          "sameAs": []
        })}
      </script>
    </Helmet>
  );
}
