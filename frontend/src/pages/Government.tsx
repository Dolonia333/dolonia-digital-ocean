import { Link } from 'react-router-dom'
import MarketingPage from '@/components/marketing/MarketingPage'
import { ClosingCta, PageHero, ReviewNote, Section } from '@/components/marketing/sections'
import {
  company,
  competencies,
  contactHref,
  differentiators,
  placeholders,
} from '@/components/marketing/siteContent'

const facts = [
  ['Entity', company.name],
  ['DBA', placeholders.dba],
  ['UEI', company.uei],
  ['CAGE', company.cage],
  ['NAICS', `${company.naics}. ${placeholders.extraNaics}`],
  ['Certifications', company.certs.join(', ')],
  ['Location', company.location],
  ['Point of contact', placeholders.poc],
]

const Government = () => {
  return (
    <MarketingPage
      title="Government Contracting | Dolonia Data Tech"
      description="Capability overview for contracting officers and primes. UEI, CAGE, certifications, and how to team with Dolonia Data Tech."
    >
      <PageHero
        eyebrow="Government & Primes"
        title="Capability statement"
        lede={`${company.name} is the technology division of ${company.holding} in ${company.location}.`}
        primary={{ label: 'Download Capability Statement', to: '/capability-statement' }}
        secondary={{
          label: 'Discuss Teaming',
          to: contactHref('Teaming / subcontracting', 'Prime contractor'),
        }}
      />

      <Section>
        <Link to="/government/teaming" className="text-cyan-bright hover:underline">
          How teaming works
        </Link>
      </Section>

      <Section title="At a glance">
        <dl className="grid gap-3 sm:grid-cols-2 max-w-4xl">
          {facts.map(([label, value]) => (
            <div key={label} className="rounded-lg border border-ocean-surface px-4 py-3">
              <dt className="text-xs uppercase tracking-wide text-cyan-soft">{label}</dt>
              <dd className="text-foreground mt-1">{value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="Core competencies">
        <ul className="grid gap-3 md:grid-cols-2 max-w-4xl">
          {competencies.map((item) => (
            <li key={item.title} className="rounded-lg border border-ocean-surface px-4 py-3">
              <p className="font-medium">{item.title}</p>
              <p className="text-cyan-soft text-sm mt-1">{item.detail}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Differentiators">
        <ul className="space-y-2 max-w-3xl list-disc pl-5 text-cyan-soft">
          {differentiators.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section title="RM Cyber">
        <ReviewNote>
          Dolonia teams with RM Cyber on pursuit work. Public naming and logo use are not approved
          yet. [CONFIRM PUBLIC NAME AND LOGO]
        </ReviewNote>
      </Section>

      <ClosingCta
        title="Talk about a pursuit"
        primary={{ label: 'Download Capability Statement', to: '/capability-statement' }}
        secondary={{
          label: 'Discuss Teaming',
          to: contactHref('Teaming / subcontracting', 'Prime contractor'),
        }}
      />
    </MarketingPage>
  )
}

export default Government
