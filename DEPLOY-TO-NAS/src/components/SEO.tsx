import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "Dolonia - Advanced Cybersecurity Solutions",
  description = "Secure your digital future with Dolonia's cutting-edge cybersecurity solutions. We provide multi-cloud security, zero-trust architecture, and AI-powered threat detection for modern businesses.",
  keywords = "cybersecurity, cloud security, zero trust, AI security, threat detection, multi-cloud, data protection, cyber defense, security solutions, digital security",
  image = "/og-image.png",
  url = window.location.href,
  type = "website",
}) => {
  const siteTitle = "Dolonia";
  const fullTitle = title.includes(siteTitle)
    ? title
    : `${title} | ${siteTitle}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Dolonia" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#0ea5e9" />
      <meta name="msapplication-TileColor" content="#0ea5e9" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteTitle,
          description: description,
          url: window.location.origin,
          logo: `${window.location.origin}/logo-192.png`,
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            availableLanguage: "English",
          },
          sameAs: [
            "https://www.linkedin.com/company/dolonia",
            "https://twitter.com/dolonia",
          ],
          serviceType: "Cybersecurity Services",
          areaServed: "Worldwide",
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Cybersecurity Services",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Multi-Cloud Security",
                  description:
                    "Comprehensive security solutions across AWS, Azure, and Google Cloud platforms.",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Zero-Trust Architecture",
                  description:
                    "Advanced security model that verifies every user and device before granting access.",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "AI-Powered Threat Detection",
                  description:
                    "Intelligent automation that identifies and prevents security threats in real-time.",
                },
              },
            ],
          },
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
