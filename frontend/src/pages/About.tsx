import MarketingPage from '@/components/marketing/MarketingPage'
import { ClosingCta, PageHero, Section } from '@/components/marketing/sections'
import { company, contactHref, leaders, placeholders } from '@/components/marketing/siteContent'

const facts = [
  ['Legal name', company.name],
  ['Holding company', company.holding],
  ['DBA', placeholders.dba],
  ['Location', company.location],
  ['UEI', company.uei],
  ['CAGE', company.cage],
  ['NAICS on file', `${company.naics}. ${placeholders.extraNaics}`],
  ['Certifications', `${company.certs.join(', ')}. Numbers and expirations are not listed yet.`],
  ['RM Cyber', '[CONFIRM PUBLIC NAME AND LOGO]'],
]

const About = () => {
  return (
    <MarketingPage
      title="About Dolonia Data Tech"
      description="Dolonia Data Tech is the technology division of 1921 Holding Co. in Oklahoma City. Systems that help people navigate complex systems."
    >
      <PageHero
        eyebrow="About"
        title={company.thesis}
        lede={`${company.name} is the technology division of ${company.holding}.`}
      />

      <Section title="Why we exist">
        <p className="text-cyan-soft max-w-3xl">
          People get stuck when the system in front of them is larger than the tools they have.
          Dolonia builds the software, the data systems, the engineering, and the sites that make
          the next step clear.
        </p>
      </Section>

      <Section title="Leadership">
        <div className="grid gap-4 md:grid-cols-3">
          {leaders.map((leader) => (
            <article key={leader.name} className="rounded-xl border border-ocean-surface p-5">
              <div className="mb-4 h-16 w-16 rounded-full border border-dashed border-amber-400/50 flex items-center justify-center text-xs text-amber-100">
                [HEADSHOT]
              </div>
              <h3 className="font-semibold">{leader.name}</h3>
              <p className="text-cyan-soft text-sm">{leader.role}</p>
              <p className="text-sm text-amber-100 mt-3">[BIO]</p>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Organization">
        <ol className="list-decimal pl-5 text-cyan-soft space-y-1">
          <li>{company.holding}</li>
          <li>{company.name}</li>
          <li>Engineering</li>
          <li>Platforms: Denizen, I.W.I.N., and SmartContainer</li>
        </ol>
      </Section>

      <Section title="Company facts">
        <dl className="grid gap-3 sm:grid-cols-2 max-w-4xl">
          {facts.map(([label, value]) => (
            <div key={label} className="rounded-lg border border-ocean-surface px-4 py-3">
              <dt className="text-xs uppercase tracking-wide text-cyan-soft">{label}</dt>
              <dd className="mt-1">{value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <ClosingCta
        primary={{ label: 'Start a Conversation', to: contactHref() }}
        secondary={{ label: 'Capability Statement', to: '/capability-statement' }}
      />
    </MarketingPage>
  )
}

export default About
