import MarketingPage from '@/components/marketing/MarketingPage'
import { ClosingCta, PageHero, ReviewNote, Section } from '@/components/marketing/sections'
import { contactHref, placeholders } from '@/components/marketing/siteContent'

const configurations = ['Workforce', 'Health', 'AgTech', 'Drone', 'IoT']

const SmartContainer = () => {
  return (
    <MarketingPage
      title="SmartContainer | Dolonia Data Tech"
      description="SmartContainer is a modular hub from Dolonia Data Tech for rural and underserved places. Commercial status is not confirmed."
    >
      <PageHero
        eyebrow="Ecosystem"
        title="SmartContainer"
        lede="Modular hubs for rural and underserved places."
        primary={{
          label: 'Discuss a SmartContainer Deployment',
          to: contactHref('SmartContainer'),
        }}
      />

      <Section title="Configurations">
        <ul className="flex flex-wrap gap-2">
          {configurations.map((item) => (
            <li key={item} className="rounded-full border border-ocean-surface px-3 py-1 text-cyan-soft">
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Why modular">
        <ul className="list-disc pl-5 text-cyan-soft space-y-1 max-w-3xl">
          <li>Faster to deploy than a permanent building.</li>
          <li>The inside can be reconfigured.</li>
          <li>Space, connectivity, and software ship together.</li>
          <li>Engineering is in-house.</li>
        </ul>
      </Section>

      <Section title="Who it is for">
        <p className="text-cyan-soft max-w-3xl">
          Rural groups, agencies, and primes that need a site they can deploy.
        </p>
      </Section>

      <Section title="Status">
        <ReviewNote>
          Commercialization status: {placeholders.commercialization}. Photos are not available yet.
        </ReviewNote>
      </Section>

      <ClosingCta
        title="Discuss a deployment"
        primary={{
          label: 'Discuss a SmartContainer Deployment',
          to: contactHref('SmartContainer'),
        }}
      />
    </MarketingPage>
  )
}

export default SmartContainer
