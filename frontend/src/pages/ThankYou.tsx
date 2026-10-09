import { Link } from 'react-router-dom'
import MarketingPage from '@/components/marketing/MarketingPage'
import { PageHero, Section } from '@/components/marketing/sections'
import { placeholders } from '@/components/marketing/siteContent'

const ThankYou = () => {
  return (
    <MarketingPage
      title="Message received | Dolonia Data Tech"
      description="Dolonia Data Tech received your note. Response time is not published yet."
    >
      <PageHero
        title="We have your note."
        lede={`Someone will reply. Expected response time: ${placeholders.responseTime}.`}
      />
      <Section>
        <p className="text-cyan-soft max-w-3xl mb-4">
          If this is about a solicitation, include the due date in any follow-up so it is not
          missed. A due date inside 14 days is already marked high priority when you entered it.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link to="/capability-statement" className="text-cyan-bright hover:underline">
            Capability Statement
          </Link>
          <Link to="/work/denizen" className="text-cyan-bright hover:underline">
            Denizen case study
          </Link>
        </div>
      </Section>
    </MarketingPage>
  )
}

export default ThankYou
