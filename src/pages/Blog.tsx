import React from 'react';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import BlogSection from '@/components/BlogSection';

const Blog = () => {
  return (
    <Layout>
      <SEO 
        title="Blog - Cybersecurity Insights & Updates"
        description="Stay updated with the latest cybersecurity trends, threat intelligence, and technology insights from Dolonia's security experts."
        keywords="cybersecurity blog, security trends, threat intelligence, cloud security, zero trust, security insights"
      />
      
      <div className="pt-20">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-cyber bg-clip-text text-transparent">
                Security Insights
              </span>
            </h1>
            <p className="text-xl text-cyan-soft max-w-3xl mx-auto">
              Stay ahead of emerging threats with expert insights, industry analysis, and practical cybersecurity guidance.
            </p>
          </div>
        </div>
        <BlogSection />
      </div>
    </Layout>
  );
};

export default Blog;