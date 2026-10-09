import MarketingPage from '@/components/marketing/MarketingPage'
import { ClosingCta, PageHero, ReviewNote, Section } from '@/components/marketing/sections'
import { contactHref } from '@/components/marketing/siteContent'

const DenizenCaseStudy = () => {
  return (
    <MarketingPage
      title="Denizen Case Study | Dolonia Data Tech"
      description="How Dolonia built Denizen, the workspace it uses to run its own operations."
    >
      <PageHero
        eyebrow="Work"
        title="Denizen"
        lede="A product Dolonia built and still runs."
        primary={{ label: 'Build Something Like This', to: contactHref('Product Sprint', 'Founder') }}
        secondary={{ label: 'Learn About Denizen', to: '/denizen' }}
      />

      <Section title="Problem">
        <ReviewNote>
          [CONFIRM] The working draft says the problem was too many disconnected tools. Do not treat
          that line as final copy.
        </ReviewNote>
      </Section>

      <Section title="What was built">
        <ul className="list-disc pl-5 text-cyan-soft space-y-1 max-w-3xl">
          <li>A visual workspace where more than one agent can work.</li>
          <li>CRM for contacts, companies, and deals.</li>
          <li>Boards for delivery work.</li>
          <li>A business studio for founder planning.</li>
          <li>Shared memory so the next session still has context.</li>
        </ul>
      </Section>

      <Section title="How it works">
        <ReviewNote>
          [CONFIRM] Draft sequence: shared context, then agents do work, then people stay in
          control, then memory persists.
        </ReviewNote>
      </Section>

      <Section title="Where it runs">
        <p className="text-cyan-soft max-w-3xl">
          Denizen is live at{' '}
          <a className="text-cyan-bright hover:underline" href="https://dolonia.denizen.cloud">
            dolonia.denizen.cloud
          </a>
          . Dolonia uses it for operations, including the CRM this website will send inquiries to
          once that connection is confirmed.
        </p>
      </Section>

      <ClosingCta
        title="Build something like this"
        primary={{ label: 'Build Something Like This', to: contactHref('Product Sprint', 'Founder') }}
        secondary={{ label: 'Learn About Denizen', to: '/denizen' }}
      />
    </MarketingPage>
  )
}

export default DenizenCaseStudy
