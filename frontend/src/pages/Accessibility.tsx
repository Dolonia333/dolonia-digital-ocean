import MarketingPage from '@/components/marketing/MarketingPage'
import { PageHero, Section } from '@/components/marketing/sections'
import { placeholders } from '@/components/marketing/siteContent'

const Accessibility = () => {
  return (
    <MarketingPage
      title="Accessibility | Dolonia Data Tech"
      description="Dolonia Data Tech wants this website to be usable with a keyboard, a screen reader, and without relying on color alone."
    >
      <PageHero
        title="Accessibility"
        lede="This site should work with a keyboard and a screen reader. If something blocks you, tell us."
      />
      <Section>
        <ul className="list-disc pl-5 text-cyan-soft space-y-2 max-w-3xl">
          <li>Pages use one main heading.</li>
          <li>Links are named for where they go.</li>
          <li>The intake form can be completed without a mouse.</li>
          <li>
            Contact for access barriers: {placeholders.email}. That address is not confirmed yet.
          </li>
        </ul>
      </Section>
    </MarketingPage>
  )
}

export default Accessibility
