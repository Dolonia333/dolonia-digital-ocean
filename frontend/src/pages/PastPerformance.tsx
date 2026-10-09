import MarketingPage from '@/components/marketing/MarketingPage'
import { PageHero, ReviewNote, Section } from '@/components/marketing/sections'
import { contactHref, verifiedProjects } from '@/components/marketing/siteContent'

const PastPerformance = () => {
  const published = verifiedProjects.length > 0

  return (
    <MarketingPage
      title="Past Performance | Dolonia Data Tech"
      description="Verified project records for Dolonia Data Tech. This page stays unpublished until a record is confirmed."
    >
      <PageHero
        eyebrow="Government & Primes"
        title="Past performance"
        lede="Only verified project records appear here."
      />
      <Section>
        {published ? (
          <ul className="space-y-4">
            {verifiedProjects.map((project) => (
              <li key={project.title} className="rounded-xl border border-ocean-surface p-5">
                <h2 className="text-xl font-semibold">{project.title}</h2>
                <p className="text-cyan-soft mt-2">
                  {project.customer} · {project.contractNumber} · {project.period}
                </p>
                <p className="text-cyan-soft">
                  Role: {project.role}. Value: {project.value}.
                </p>
                <p className="mt-2">{project.scope}</p>
                <p className="mt-2">{project.outcome}</p>
                <p className="text-sm text-cyan-soft mt-2">
                  Reference available: {project.reference === 'yes' ? 'Yes' : 'No'}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <ReviewNote>
            Unpublished. This page stays hidden from navigation until at least one verified project
            is on file. Template fields: title, customer, contract number, period, role, value,
            scope, outcome, and whether a reference may be contacted.
          </ReviewNote>
        )}
      </Section>
      {published && (
        <Section>
          <a className="text-cyan-bright" href={contactHref('Capability statement', 'Contracting officer')}>
            Request References
          </a>
        </Section>
      )}
    </MarketingPage>
  )
}

export default PastPerformance
