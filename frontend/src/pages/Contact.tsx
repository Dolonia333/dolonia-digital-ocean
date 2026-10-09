import { FormEvent, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import MarketingPage from '@/components/marketing/MarketingPage'
import { Button } from '@/components/ui/button'
import { supabase } from '@/integrations/supabase/client'
import {
  audiences,
  company,
  govAudiences,
  interests,
  placeholders,
  pursuitAreas,
  setAsides,
} from '@/components/marketing/siteContent'

type FormState = {
  name: string
  email: string
  phone: string
  organization: string
  title: string
  audience: string
  interest: string
  solicitation: string
  agency: string
  dueDate: string
  setAsides: string[]
  scope: string[]
  estimatedValue: string
  buildNeed: string
  stage: string
  timeline: string
  budget: string
  regulated: string
  currentTools: string
  note: string
  heard: string
  consent: boolean
  companyWebsite: string
}

const empty = (audience: string, interest: string): FormState => ({
  name: '',
  email: '',
  phone: '',
  organization: '',
  title: '',
  audience,
  interest,
  solicitation: '',
  agency: '',
  dueDate: '',
  setAsides: [],
  scope: [],
  estimatedValue: '',
  buildNeed: '',
  stage: '',
  timeline: '',
  budget: '',
  regulated: '',
  currentTools: '',
  note: '',
  heard: '',
  consent: false,
  companyWebsite: '',
})

const fieldClass =
  'w-full rounded-md border border-ocean-surface bg-ocean-deep px-3 py-2 text-foreground'

const isGovPath = (audience: string, interest: string) =>
  govAudiences.has(audience) || interest === 'Teaming / subcontracting'

const dueWithin14Days = (value: string) => {
  if (!value) return false
  const due = new Date(`${value}T00:00:00`)
  const limit = new Date()
  limit.setHours(0, 0, 0, 0)
  limit.setDate(limit.getDate() + 14)
  return due.getTime() <= limit.getTime()
}

const toggle = (list: string[], value: string) =>
  list.includes(value) ? list.filter((item) => item !== value) : [...list, value]

const Contact = () => {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<FormState>(() =>
    empty(params.get('audience') || '', params.get('interest') || ''),
  )
  const landedAt = useMemo(() => new Date().toISOString(), [])
  const gov = isGovPath(form.audience, form.interest)

  const set = (patch: Partial<FormState>) => setForm((current) => ({ ...current, ...patch }))

  const validateStep = (current: number) => {
    if (current === 1) {
      if (!form.name.trim()) return 'Name is required.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'Work email is required.'
      if (!form.organization.trim()) return 'Organization is required.'
      if (!form.audience) return 'Choose who you are.'
      if (!form.interest) return 'Choose what you are interested in.'
    }
    if (current === 2 && !gov && !form.buildNeed.trim()) {
      return 'Say what you want to build or fix.'
    }
    if (current === 3 && !form.consent) return 'Consent is required before sending.'
    return ''
  }

  const next = () => {
    const message = validateStep(step)
    setError(message)
    if (!message) setStep((value) => value + 1)
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const message = validateStep(3)
    setError(message)
    if (message) return

    if (form.companyWebsite.trim()) {
      navigate('/contact/thank-you')
      return
    }

    const highPriority =
      dueWithin14Days(form.dueDate) ||
      form.estimatedValue === '$1,000,000 or more' ||
      form.timeline === 'Within 1 month'
    const pipeline = gov ? 'Gov' : 'Business'
    const utm = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
      .map((key) => {
        const value = params.get(key)
        return value ? `${key}=${value}` : ''
      })
      .filter(Boolean)
      .join(', ')

    const lines = [
      `Pipeline: ${pipeline}`,
      `Priority: ${highPriority ? 'High' : 'Normal'}`,
      `Organization: ${form.organization.trim()}`,
      `Phone: ${form.phone.trim() || '[not provided]'}`,
      `I am a: ${form.audience}`,
      `Interested in: ${form.interest}`,
      `Title: ${form.title || '[not provided]'}`,
      gov ? `Solicitation: ${form.solicitation || '[not provided]'}` : '',
      gov ? `Agency: ${form.agency || '[not provided]'}` : '',
      gov ? `Due date: ${form.dueDate || '[not provided]'}` : '',
      gov ? `Set-asides: ${form.setAsides.join(', ') || '[not provided]'}` : '',
      gov ? `Scope: ${form.scope.join(', ') || '[not provided]'}` : '',
      gov ? `Estimated value: ${form.estimatedValue || '[not provided]'}` : '',
      !gov ? `What to build or fix: ${form.buildNeed}` : '',
      !gov ? `Stage: ${form.stage || '[not provided]'}` : '',
      !gov ? `Timeline: ${form.timeline || '[not provided]'}` : '',
      !gov ? `Budget: ${form.budget || '[SET RANGES]'}` : '',
      !gov ? `Regulated data: ${form.regulated || '[not provided]'}` : '',
      !gov ? `Current tools: ${form.currentTools || '[not provided]'}` : '',
      form.regulated === 'Yes'
        ? 'Note: regulated data. Consider the Secure Data Systems plan.'
        : '',
      `Anything else: ${form.note || '[not provided]'}`,
      `How heard: ${form.heard || '[not provided]'}`,
      `Page: ${window.location.href}`,
      `Landed: ${landedAt}`,
      `Submitted: ${new Date().toISOString()}`,
      utm ? `UTM: ${utm}` : '',
    ].filter(Boolean)

    setSubmitting(true)
    const { error: insertError } = await supabase.from('leads').insert([
      {
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.organization.trim(),
        phone: form.phone.trim() || null,
        message: lines.join('\n'),
        source: 'public_intake',
        status: highPriority ? 'high_priority' : 'new',
      },
    ])
    setSubmitting(false)

    if (insertError) {
      setError(insertError.message || 'The form could not be saved.')
      return
    }

    navigate('/contact/thank-you')
  }

  return (
    <MarketingPage
      title="Contact | Dolonia Data Tech"
      description="Start a conversation with Dolonia Data Tech. The form routes government and business inquiries separately."
    >
      <div className="container mx-auto px-6 py-12 grid gap-8 lg:grid-cols-[1fr_280px]">
        <form onSubmit={submit} className="space-y-6">
          <div>
            <p className="text-sm text-cyan-bright mb-2">Step {step} of 3</p>
            <h1 className="text-4xl font-bold mb-3">Start a conversation</h1>
            <p className="text-cyan-soft">Tell us who you are. The second step changes with that answer.</p>
          </div>

          {step === 1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm text-cyan-soft">
                Name
                <input className={fieldClass} value={form.name} onChange={(e) => set({ name: e.target.value })} />
              </label>
              <label className="text-sm text-cyan-soft">
                Work email
                <input className={fieldClass} type="email" value={form.email} onChange={(e) => set({ email: e.target.value })} />
              </label>
              <label className="text-sm text-cyan-soft">
                Phone, if you want a call
                <input className={fieldClass} value={form.phone} onChange={(e) => set({ phone: e.target.value })} />
              </label>
              <label className="text-sm text-cyan-soft">
                Organization
                <input className={fieldClass} value={form.organization} onChange={(e) => set({ organization: e.target.value })} />
              </label>
              <label className="text-sm text-cyan-soft">
                Title, optional
                <input className={fieldClass} value={form.title} onChange={(e) => set({ title: e.target.value })} />
              </label>
              <label className="text-sm text-cyan-soft">
                I am a...
                <select className={fieldClass} value={form.audience} onChange={(e) => set({ audience: e.target.value })}>
                  <option value="">Choose one</option>
                  {audiences.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm text-cyan-soft sm:col-span-2">
                I am interested in...
                <select className={fieldClass} value={form.interest} onChange={(e) => set({ interest: e.target.value })}>
                  <option value="">Choose one</option>
                  {interests.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {step === 2 && gov && (
            <div className="space-y-4">
              <label className="block text-sm text-cyan-soft">
                Solicitation number
                <input className={fieldClass} value={form.solicitation} onChange={(e) => set({ solicitation: e.target.value })} />
              </label>
              <label className="block text-sm text-cyan-soft">
                Agency
                <input className={fieldClass} value={form.agency} onChange={(e) => set({ agency: e.target.value })} />
              </label>
              <label className="block text-sm text-cyan-soft">
                Due date
                <input className={fieldClass} type="date" value={form.dueDate} onChange={(e) => set({ dueDate: e.target.value })} />
              </label>
              <fieldset>
                <legend className="text-sm text-cyan-soft mb-2">Set-asides</legend>
                <div className="grid sm:grid-cols-2 gap-2">
                  {setAsides.map((item) => (
                    <label key={item} className="flex gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={form.setAsides.includes(item)}
                        onChange={() => set({ setAsides: toggle(form.setAsides, item) })}
                      />
                      {item}
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="text-sm text-cyan-soft mb-2">Scope</legend>
                <div className="grid sm:grid-cols-2 gap-2">
                  {pursuitAreas.map((item) => (
                    <label key={item} className="flex gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={form.scope.includes(item)}
                        onChange={() => set({ scope: toggle(form.scope, item) })}
                      />
                      {item}
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="block text-sm text-cyan-soft">
                Estimated value
                <select className={fieldClass} value={form.estimatedValue} onChange={(e) => set({ estimatedValue: e.target.value })}>
                  <option value="">Not stated</option>
                  <option>Under $1,000,000</option>
                  <option>$1,000,000 or more</option>
                </select>
              </label>
            </div>
          )}

          {step === 2 && !gov && (
            <div className="space-y-4">
              <label className="block text-sm text-cyan-soft">
                What do you want to build or fix?
                <textarea className={fieldClass} rows={4} value={form.buildNeed} onChange={(e) => set({ buildNeed: e.target.value })} />
              </label>
              <label className="block text-sm text-cyan-soft">
                Stage
                <select className={fieldClass} value={form.stage} onChange={(e) => set({ stage: e.target.value })}>
                  <option value="">Choose one</option>
                  <option>Idea</option>
                  <option>In progress</option>
                  <option>Operating</option>
                  <option>Not sure</option>
                </select>
              </label>
              <label className="block text-sm text-cyan-soft">
                Timeline
                <select className={fieldClass} value={form.timeline} onChange={(e) => set({ timeline: e.target.value })}>
                  <option value="">Choose one</option>
                  <option>Within 1 month</option>
                  <option>1 to 3 months</option>
                  <option>Later</option>
                  <option>Not sure</option>
                </select>
              </label>
              <label className="block text-sm text-cyan-soft">
                Budget [SET RANGES]
                <select className={fieldClass} value={form.budget} onChange={(e) => set({ budget: e.target.value })}>
                  <option value="">[SET RANGES]</option>
                  <option>Not sure yet</option>
                </select>
              </label>
              <label className="block text-sm text-cyan-soft">
                Does this involve regulated data?
                <select className={fieldClass} value={form.regulated} onChange={(e) => set({ regulated: e.target.value })}>
                  <option value="">Choose one</option>
                  <option>Yes</option>
                  <option>No</option>
                  <option>Not sure</option>
                </select>
              </label>
              <label className="block text-sm text-cyan-soft">
                Current tools
                <input className={fieldClass} value={form.currentTools} onChange={(e) => set({ currentTools: e.target.value })} />
              </label>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <label className="block text-sm text-cyan-soft">
                Anything else?
                <textarea className={fieldClass} rows={4} value={form.note} onChange={(e) => set({ note: e.target.value })} />
              </label>
              <label className="block text-sm text-cyan-soft">
                How did you hear about Dolonia?
                <select className={fieldClass} value={form.heard} onChange={(e) => set({ heard: e.target.value })}>
                  <option value="">Choose one</option>
                  <option>Search</option>
                  <option>Referral</option>
                  <option>Event</option>
                  <option>Partner</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="flex gap-2 text-sm">
                <input type="checkbox" checked={form.consent} onChange={(e) => set({ consent: e.target.checked })} />
                <span>
                  I agree that Dolonia Data Tech may store this inquiry. Read the{' '}
                  <Link to="/privacy" className="text-cyan-bright underline">
                    Privacy
                  </Link>{' '}
                  page.
                </span>
              </label>
              <label className="absolute left-[-9999px]" aria-hidden="true">
                Company website
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.companyWebsite}
                  onChange={(e) => set({ companyWebsite: e.target.value })}
                />
              </label>
            </div>
          )}

          {error && <p className="text-sm text-red-300">{error}</p>}

          <div className="flex gap-3">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={() => setStep((value) => value - 1)}>
                Back
              </Button>
            )}
            {step < 3 && (
              <Button type="button" onClick={next}>
                Continue
              </Button>
            )}
            {step === 3 && (
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Sending' : 'Send'}
              </Button>
            )}
          </div>
        </form>

        <aside className="rounded-xl border border-ocean-surface bg-ocean-surface/30 p-5 h-fit text-sm space-y-2">
          <h2 className="text-lg font-semibold">Dolonia Data Tech</h2>
          <p>{placeholders.email}</p>
          <p>{placeholders.phone}</p>
          <p>{company.location}</p>
          <p>UEI {company.uei}</p>
          <p>CAGE {company.cage}</p>
        </aside>
      </div>
    </MarketingPage>
  )
}

export default Contact
