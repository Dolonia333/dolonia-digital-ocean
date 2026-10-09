import MarketingPage from '@/components/marketing/MarketingPage'
import { CardGrid, ClosingCta, PageHero, ReviewNote, Section } from '@/components/marketing/sections'
import { contactHref, platforms } from '@/components/marketing/siteContent'

const Ecosystem = () => {
  return (
    <MarketingPage
      title="Ecosystem | Dolonia Data Tech"
      description="Denizen, I.W.I.N., SmartContainer, and Engineering are four parts of one Dolonia Data Tech company."
    >
      <PageHero
        eyebrow="Ecosystem"
        title="Four platforms. One mission."
        lede="Software, workforce, physical sites, and engineering sit in the same company."
        primary={{ label: 'Explore the Ecosystem', to: '/ecosystem/iwin' }}
      />

      <Section title="Platforms">
        <CardGrid items={platforms} />
      </Section>

      <Section title="How they connect">
        <ReviewNote>
          [CONFIRM] Draft framing: SmartContainer is the physical site, I.W.I.N. is the workforce
          network, Denizen is the software, and Engineering is the systems work. Do not publish this
          sentence until it is confirmed.
        </ReviewNote>
      </Section>

      <ClosingCta
        title="Discuss a partnership"
        primary={{ label: 'Discuss a Partnership', to: contactHref('General conversation') }}
      />
    </MarketingPage>
  )
}

export default Ecosystem
