import MarketingPage from '@/components/marketing/MarketingPage'
import { ClosingCta, PageHero, Section } from '@/components/marketing/sections'
import { contactHref, supportPlans } from '@/components/marketing/siteContent'

const SupportPlans = () => {
  return (
    <MarketingPage
      title="Support Plans | Dolonia Data Tech"
      description="Hosting, automation, and secure data plans from Dolonia Data Tech. Prices are not published. Ask about a plan."
    >
      <PageHero
        eyebrow="Businesses & Founders"
        title="Support plans"
        lede="Hosting, automation, and secure data after a product exists. Prices are not on this page."
        primary={{ label: 'Ask About a Plan', to: contactHref('Support plan') }}
      />

      <Section>
        <div className="grid gap-4 md:grid-cols-3">
          {supportPlans.map((plan) => (
            <article key={plan.name} className="rounded-xl border border-ocean-surface p-5">
              <h2 className="text-xl font-semibold mb-1">{plan.name}</h2>
              <p className="text-sm text-cyan-bright mb-4">For {plan.for}</p>
              <ul className="space-y-2 text-cyan-soft text-sm">
                {plan.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <ClosingCta
        title="Ask about a plan"
        lede="Tell us what you are running and whether the data is regulated."
        primary={{ label: 'Ask About a Plan', to: contactHref('Support plan') }}
      />
    </MarketingPage>
  )
}

export default SupportPlans
