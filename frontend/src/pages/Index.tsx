import React from 'react'
import Layout from '@/components/Layout'
import SEO from '@/components/SEO'
import BentoHome from '@/components/BentoHome'
import Newsletter from '@/components/Newsletter'
import LiveChat from '@/components/LiveChat'
import SearchFunctionality from '@/components/SearchFunctionality'

const Index = () => {
  return (
    <Layout>
      <SEO
        title="Dolonia — Premium AI Automation, Web Platforms & Infrastructure"
        description="Dolonia builds AI automation, modern web platforms, and secure infrastructure for businesses that need reliability, speed, and measurable outcomes."
      />

      <BentoHome />
      <Newsletter />

      <SearchFunctionality />
      <LiveChat />
    </Layout>
  )
}

export default Index
