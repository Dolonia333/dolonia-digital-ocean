import MarketingPage from '@/components/marketing/MarketingPage'
import { ClosingCta, PageHero, ReviewNote, Section } from '@/components/marketing/sections'
import { company, contactHref } from '@/components/marketing/siteContent'

const disciplines = ['Aerospace', 'Mechanical', 'Manufacturing']

const Engineering = () => {
  return (
    <MarketingPage
      title="Engineering | Dolonia Data Tech"
      description="Aerospace, mechanical, and manufacturing engineering at Dolonia Data Tech. NAICS 541330. Led by Dr. Ed."
    >
      <PageHero
        eyebrow="Engineering"
        title="Engineering"
        lede={`Aerospace, mechanical, and manufacturing. Led by Dr. Ed. NAICS ${company.naics}.`}
        primary={{ label: 'Talk to Engineering', to: contactHref('Engineering') }}
        secondary={{ label: 'Capability Statement', to: '/capability-statement' }}
      />

      <Section title="Disciplines">
        <div className="grid gap-4 md:grid-cols-3">
          {disciplines.map((name) => (
            <div key={name} className="rounded-xl border border-ocean-surface p-5">
              <h3 className="font-semibold mb-2">{name}</h3>
              <ReviewNote>[ADD SPECIFIC SERVICES]</ReviewNote>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Why the work stays in-house">
        <p className="text-cyan-soft max-w-3xl">
          Software and hardware are the same team. SmartContainer is the example: the enclosure and
          the software are designed together.
        </p>
      </Section>

      <Section title="Leadership">
        <div className="rounded-xl border border-ocean-surface p-5 max-w-xl">
          <h3 className="font-semibold">Dr. Ed</h3>
          <p className="text-cyan-soft">Engineering</p>
          <p className="text-sm text-amber-100 mt-3">[BIO] [HEADSHOT]</p>
        </div>
      </Section>

      <ClosingCta
        title="Talk to Engineering"
        primary={{ label: 'Talk to Engineering', to: contactHref('Engineering') }}
        secondary={{ label: 'Capability Statement', to: '/capability-statement' }}
      />
    </MarketingPage>
  )
}

export default Engineering
