import MarketingPage from '@/components/marketing/MarketingPage'
import { ClosingCta, PageHero, ReviewNote, Section } from '@/components/marketing/sections'
import { contactHref, placeholders } from '@/components/marketing/siteContent'

const audiences = [
  'Employers',
  'Boards, agencies, and education partners',
  'Apprentices',
  'Mentors',
]

const Iwin = () => {
  return (
    <MarketingPage
      title="I.W.I.N. | Dolonia Data Tech"
      description="I.W.I.N. is Dolonia's workforce network, aligned with DOL apprenticeship design. Program status is not confirmed."
    >
      <PageHero
        eyebrow="Ecosystem"
        title="I.W.I.N."
        lede="A workforce network aligned with U.S. Department of Labor apprenticeship design."
        primary={{ label: 'Partner with I.W.I.N.', to: contactHref('I.W.I.N.') }}
      />

      <Section title="The problem">
        <ReviewNote>
          [CONFIRM] Draft line: skills are retiring faster than they are transferred. Do not publish
          until confirmed.
        </ReviewNote>
      </Section>

      <Section title="How it works">
        <ReviewNote>
          [CONFIRM] Draft pieces: DOL apprenticeship design, mentoring, Dolonia pathways, and Denizen
          tracking. Details are not confirmed.
        </ReviewNote>
      </Section>

      <Section title="Who it is for">
        <ul className="list-disc pl-5 text-cyan-soft space-y-1">
          {audiences.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section title="Status">
        <ReviewNote>Program status: {placeholders.programStatus}</ReviewNote>
      </Section>

      <ClosingCta
        title="Partner with I.W.I.N."
        primary={{ label: 'Partner with I.W.I.N.', to: contactHref('I.W.I.N.') }}
      />
    </MarketingPage>
  )
}

export default Iwin
