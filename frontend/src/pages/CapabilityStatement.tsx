import { company, competencies, differentiators, placeholders } from '@/components/marketing/siteContent'

const CapabilityStatement = () => {
  return (
    <div className="capability-sheet bg-white text-neutral-900 min-h-screen">
      <style>{`
        @media print {
          @page { size: letter; margin: 0.45in; }
          .no-print { display: none !important; }
          .capability-sheet { background: white !important; }
        }
      `}</style>
      <div className="no-print bg-amber-950 text-amber-100 px-6 py-2 text-sm">
        Internal review draft. Use Download to print this page to PDF. Do not publish until the
        bracketed fields are filled.
      </div>
      <div className="no-print px-6 py-4">
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-md bg-neutral-900 text-white px-4 py-2 text-sm"
        >
          Download Capability Statement
        </button>
      </div>
      <article className="max-w-[8.5in] mx-auto px-6 py-6 text-[11px] leading-snug">
        <header className="flex justify-between gap-6 border-b border-neutral-300 pb-3 mb-3">
          <div>
            <h1 className="text-xl font-bold">Dolonia Data Tech</h1>
            <p>Technology division of {company.holding}</p>
            <p>{company.location}</p>
          </div>
          <div className="text-right">
            <p>{placeholders.phone}</p>
            <p>{placeholders.email}</p>
            <p>{placeholders.address}</p>
            <p>UEI {company.uei}</p>
            <p>CAGE {company.cage}</p>
          </div>
        </header>
        <p className="mb-3">{company.thesis}</p>
        <div className="grid grid-cols-2 gap-4">
          <section>
            <h2 className="font-bold text-sm mb-1">Core competencies</h2>
            <ul className="list-disc pl-4 space-y-1">
              {competencies.map((item) => (
                <li key={item.title}>
                  <span className="font-medium">{item.title}.</span> {item.detail}
                </li>
              ))}
            </ul>
            <h2 className="font-bold text-sm mt-3 mb-1">Differentiators</h2>
            <ul className="list-disc pl-4 space-y-1">
              {differentiators.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="font-bold text-sm mb-1">Company data</h2>
            <p>Entity: {company.name}</p>
            <p>DBA: {placeholders.dba}</p>
            <p>
              NAICS: {company.naics}. {placeholders.extraNaics}
            </p>
            <p>Certifications: {company.certs.join(', ')}</p>
            <p>Certificate numbers and expirations: [CERTIFICATION DETAILS]</p>
            <p>Point of contact: {placeholders.poc}</p>
            <p>Location: {company.location}</p>
            <h2 className="font-bold text-sm mt-3 mb-1">Past performance</h2>
            <p>Unpublished until a verified project is on file.</p>
          </section>
        </div>
        <footer className="border-t border-neutral-300 mt-3 pt-2">
          Start a conversation at this website. Contract vehicles are not listed until confirmed.
        </footer>
      </article>
    </div>
  )
}

export default CapabilityStatement
