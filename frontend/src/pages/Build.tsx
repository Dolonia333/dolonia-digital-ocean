import { Link } from 'react-router-dom'
import MarketingPage from '@/components/marketing/MarketingPage'
import { CardGrid, ClosingCta, PageHero, Section } from '@/components/marketing/sections'
import { contactHref } from '@/components/marketing/siteContent'

const built = [
  { title: 'Products', detail: 'Software with a clear user and a clear job.', to: '/work/denizen' },
  { title: 'AI workflows', detail: 'Automations that stay attached to the work people already do.', to: '/build/product-sprint' },
  { title: 'Data systems', detail: 'Records, dashboards, and the database behind a product.', to: '/build/support-plans' },
  { title: 'Secure infrastructure', detail: 'Hosting and access control after the product exists.', to: '/build/support-plans' },
]

const phases = [
  { title: 'Sprint', detail: 'A fixed first engagement. Price and duration are not set yet. [PRICE] [DURATION]' },
  { title: 'Build', detail: 'The product work that follows a sprint. Approach and price are not published yet.' },
  { title: 'Support', detail: 'Hosting, automation, and secure data plans. Ask for a plan. Prices are not public.' },
]

const Build = () => {
  return (
    <MarketingPage
      title="Build with Dolonia Data Tech"
      description="Dolonia builds products like Denizen. Start with a Product Sprint, then build and support."
    >
      <PageHero
        eyebrow="Businesses & Founders"
        title="We build products like Denizen."
        lede="If you need a product, an AI workflow, or a system that holds your data, start with a sprint."
        primary={{ label: 'Book a Product Sprint', to: contactHref('Product Sprint', 'Founder') }}
        secondary={{ label: 'See the Denizen case study', to: '/work/denizen' }}
      />

      <Section title="What we build">
        <CardGrid items={built} />
      </Section>

      <Section title="How we work">
        <ol className="grid gap-4 md:grid-cols-3">
          {phases.map((phase, index) => (
            <li key={phase.title} className="rounded-xl border border-ocean-surface p-5">
              <p className="text-sm text-cyan-bright mb-1">0{index + 1}</p>
              <h3 className="text-lg font-semibold mb-2">{phase.title}</h3>
              <p className="text-cyan-soft">{phase.detail}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4">
          <Link to="/build/support-plans" className="text-cyan-bright hover:underline">
            See support plans
          </Link>
        </p>
      </Section>

      <Section title="Proof">
        <p className="text-cyan-soft max-w-3xl">
          Denizen is the working example. Dolonia uses it to run operations. Testimonials are not
          shown until a real quote is approved.
        </p>
      </Section>

      <ClosingCta
        title="Start with a sprint"
        primary={{ label: 'Book a Product Sprint', to: '/build/product-sprint' }}
      />
    </MarketingPage>
  )
}

export default Build
