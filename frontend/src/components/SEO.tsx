import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  noIndex?: boolean;
}

const SITE = "https://dolonia.cloud";

const SEO: React.FC<SEOProps> = ({
  title = "Dolonia Data Tech",
  description = "Dolonia builds websites, databases, automation and private AI for business and government, then hosts and runs them.",
  keywords = "Dolonia Data Tech, websites, databases, automation, private AI, Oklahoma City, web hosting",
  image = "/og-image.png",
  url,
  type = "website",
  noIndex = false,
}) => {
  const siteTitle = "Dolonia";
  const fullTitle = title.includes(siteTitle)
    ? title
    : `${title} | ${siteTitle}`;
  const canonical = url || `${SITE}${window.location.pathname}`;
  const imageUrl = image.startsWith("http") ? image : `${SITE}${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Dolonia" />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="Dolonia Data Tech" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#041a2c" />
      <meta name="msapplication-TileColor" content="#041a2c" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              name: "Dolonia Data Tech",
              description: description,
              url: SITE,
              logo: `${SITE}/og-image.png`,
              parentOrganization: {
                "@type": "Organization",
                name: "1921 Holding Co.",
              },
              identifier: [
                { "@type": "PropertyValue", name: "UEI", value: "YMP7Z9T1WVX5" },
                { "@type": "PropertyValue", name: "CAGE", value: "9T6Y5" },
                { "@type": "PropertyValue", name: "NAICS", value: "541511" },
                { "@type": "PropertyValue", name: "NAICS", value: "541330" },
              ],
              address: {
                "@type": "PostalAddress",
                addressLocality: "Oklahoma City",
                addressRegion: "OK",
                addressCountry: "US",
              },
            },
            {
              "@type": "LocalBusiness",
              name: "Dolonia Data Tech",
              url: SITE,
              address: {
                "@type": "PostalAddress",
                addressLocality: "Oklahoma City",
                addressRegion: "OK",
                addressCountry: "US",
              },
            },
          ],
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
