import type { ReactNode } from 'react'
import Layout from '@/components/Layout'
import SEO from '@/components/SEO'
import DraftBanner from '@/components/marketing/DraftBanner'

const MarketingPage = ({
  title,
  description,
  children,
  showChrome = true,
}: {
  title: string
  description: string
  children: ReactNode
  showChrome?: boolean
}) => {
  return (
    <Layout showNavigation={showChrome} showFooter={showChrome}>
      <SEO
        title={title}
        description={description}
        noIndex
        keywords="Dolonia Data Tech, government contracting, product development, Denizen, Oklahoma City"
      />
      {showChrome && <DraftBanner />}
      {children}
    </Layout>
  )
}

export default MarketingPage
