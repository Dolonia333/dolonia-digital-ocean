import MarketingPage from '@/components/marketing/MarketingPage'
import { ClosingCta, PageHero, ReviewNote, Section } from '@/components/marketing/sections'
import { contactHref, placeholders } from '@/components/marketing/siteContent'

const features = [
  { title: 'Agents', detail: 'More than one agent can work in the same workspace.' },
  { title: 'CRM', detail: 'Contacts, companies, and deals in one place.' },
  { title: 'Boards', detail: 'Delivery work tracked where the team already looks.' },
  { title: 'Business studio', detail: 'A place to keep founder planning next to the work.' },
  { title: 'Shared memory', detail: 'Context stays available after the session ends.' },
]

const Denizen = () => {
  return (
    <MarketingPage
      title="Denizen | Dolonia Data Tech"
      description="Denizen is Dolonia Data Tech's product for agents, CRM, boards, and shared memory."
    >
      <PageHero
        eyebrow="Product"
        title="Denizen"
        lede="A workspace for people who need software, records, and AI work in one system."
        primary={{ label: 'Open Denizen', to: 'https://dolonia.denizen.cloud' }}
        secondary={{ label: 'Request a Walkthrough', to: contactHref('Denizen') }}
      />

      <Section title="Features">
        <ul className="grid gap-3 md:grid-cols-2">
          {features.map((feature) => (
            <li key={feature.title} className="rounded-xl border border-ocean-surface p-5">
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-cyan-soft">{feature.detail}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Who it is for">
        <p className="text-cyan-soft max-w-3xl">
          Founders, small and midsize businesses, and organizations that want to see how AI
          operations work before they buy a pile of separate tools.
        </p>
      </Section>

      <Section title="Access and pricing">
        <ReviewNote>Access and pricing: {placeholders.denizenAccess}</ReviewNote>
      </Section>

      <ClosingCta
        title="Built by Dolonia"
        lede="Denizen is the case study and the product."
        primary={{ label: 'Read the case study', to: '/work/denizen' }}
        secondary={{ label: 'Open Denizen', to: 'https://dolonia.denizen.cloud' }}
      />
    </MarketingPage>
  )
}

export default Denizen
