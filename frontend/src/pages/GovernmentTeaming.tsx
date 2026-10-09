import MarketingPage from '@/components/marketing/MarketingPage'
import { ClosingCta, PageHero, Section } from '@/components/marketing/sections'
import { company, contactHref, pursuitAreas } from '@/components/marketing/siteContent'

const steps = [
  'Share the opportunity',
  'Fit check',
  'NDA or teaming agreement',
  'Proposal support',
  'Delivery',
]

const GovernmentTeaming = () => {
  return (
    <MarketingPage
      title="Teaming | Dolonia Data Tech"
      description="How primes add Dolonia Data Tech: certifications, UEI, CAGE, scope, and a simple teaming process."
    >
      <PageHero
        eyebrow="Government & Primes"
        title="How primes add Dolonia"
        lede="Bring Dolonia in when the work needs software, secure data, engineering, or a deployable site."
        primary={{
          label: 'Discuss Teaming',
          to: contactHref('Teaming / subcontracting', 'Prime contractor'),
        }}
      />

      <Section title="What Dolonia brings">
        <ul className="space-y-2 max-w-3xl list-disc pl-5 text-cyan-soft">
          <li>Certifications: {company.certs.join(', ')}. Certificate numbers are not listed yet.</li>
          <li>
            UEI {company.uei} and CAGE {company.cage}.
          </li>
          <li>Scope across software, secure data, engineering, workforce tools, and SmartContainer.</li>
          <li>A teaming relationship with RM Cyber. [CONFIRM PUBLIC NAME AND LOGO]</li>
          <li>I.W.I.N. and SmartContainer where the pursuit needs them.</li>
        </ul>
      </Section>

      <Section title="Pursuit areas">
        <ul className="flex flex-wrap gap-2">
          {pursuitAreas.map((area) => (
            <li
              key={area}
              className="rounded-full border border-ocean-surface px-3 py-1 text-sm text-cyan-soft"
            >
              {area}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Process">
        <ol className="space-y-2 max-w-xl list-decimal pl-5 text-cyan-soft">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </Section>

      <ClosingCta
        title="Send the opportunity"
        lede="Use the intake form and choose Teaming / subcontracting."
        primary={{
          label: 'Discuss Teaming',
          to: contactHref('Teaming / subcontracting', 'Prime contractor'),
        }}
      />
    </MarketingPage>
  )
}

export default GovernmentTeaming
