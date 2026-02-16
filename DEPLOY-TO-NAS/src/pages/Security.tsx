import React from 'react';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import SecuritySection from '@/components/SecuritySection';

const Security = () => {
  return (
    <>
      <SEO 
        title="Enterprise Security Solutions - Dolonia Data Tech"
        description="Military-grade cybersecurity solutions including encryption, threat detection, compliance auditing, and 24/7 monitoring. Protect your business with enterprise-grade security."
        keywords="enterprise cybersecurity, military grade encryption, threat detection, security compliance, GDPR HIPAA SOC2, cyber security solutions"
        url="https://dolonia.cloud/security"
      />
      <Layout>
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-cyber bg-clip-text text-transparent">Security First</span>
            </h1>
            <p className="text-xl text-cyan-soft max-w-3xl mx-auto">
              Enterprise-grade security that protects your data, applications, and infrastructure with military-grade encryption.
            </p>
          </div>
        </div>
        <SecuritySection />
      </Layout>
    </>
  );
};

export default Security;