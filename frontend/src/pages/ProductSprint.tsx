import MarketingPage from '@/components/marketing/MarketingPage'
import { ClosingCta, PageHero, ReviewNote, Section } from '@/components/marketing/sections'
import { contactHref, placeholders, sprintDeliverables } from '@/components/marketing/siteContent'

const ProductSprint = () => {
  return (
    <MarketingPage
      title="Product Sprint | Dolonia Data Tech"
      description="A fixed-scope first engagement with Dolonia Data Tech. Duration and price are not published yet."
    >
      <PageHero
        eyebrow="Businesses & Founders"
        title="Product Sprint"
        lede={`A fixed first step before a larger build. Duration ${placeholders.duration}. Price ${placeholders.price}.`}
        primary={{ label: 'Book a Product Sprint', to: contactHref('Product Sprint', 'Founder') }}
      />

      <Section title="Who it is for">
        <ul className="list-disc pl-5 text-cyan-soft space-y-1 max-w-3xl">
          <li>Founders who need a first version of a product.</li>
          <li>Teams that want a process automated.</li>
          <li>Groups that already have a product and need the next phase defined.</li>
        </ul>
      </Section>

      <Section title="Deliverables">
        <ReviewNote>
          Confirm this list before publish. Planned deliverables: {sprintDeliverables.join(', ')}.
        </ReviewNote>
      </Section>

      <Section title="Timeline">
        <ol className="list-decimal pl-5 text-cyan-soft space-y-1">
          <li>Week 1: discover the problem and the constraint.</li>
          <li>Week 2: design and prove a slice of the product.</li>
        </ol>
        <p className="text-cyan-soft mt-3">Overall length is still {placeholders.duration}.</p>
      </Section>

      <Section title="Questions">
        <dl className="space-y-4 max-w-3xl">
          <div>
            <dt className="font-medium">Who owns the intellectual property?</dt>
            <dd className="text-cyan-soft">[CONFIRM]</dd>
          </div>
          <div>
            <dt className="font-medium">Can we start from designs that already exist?</dt>
            <dd className="text-cyan-soft">Yes. Bring what you have.</dd>
          </div>
          <div>
            <dt className="font-medium">What happens after the sprint?</dt>
            <dd className="text-cyan-soft">You get a phased estimate for the build. You can stop there.</dd>
          </div>
          <div>
            <dt className="font-medium">Does this work for government or regulated data?</dt>
            <dd className="text-cyan-soft">Yes. Say so on the intake form so the right plan is noted.</dd>
          </div>
        </dl>
      </Section>

      <ClosingCta
        title="Book a Product Sprint"
        primary={{ label: 'Book a Product Sprint', to: contactHref('Product Sprint', 'Founder') }}
      />
    </MarketingPage>
  )
}

export default ProductSprint
