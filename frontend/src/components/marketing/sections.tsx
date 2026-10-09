import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { contactHref } from '@/components/marketing/siteContent'

function ActionLink({
  action,
  outline = false,
}: {
  action: { label: string; to: string }
  outline?: boolean
}) {
  if (action.to.startsWith('http')) {
    return (
      <Button asChild variant={outline ? 'outline' : 'default'}>
        <a href={action.to} target="_blank" rel="noopener noreferrer">
          {action.label}
        </a>
      </Button>
    )
  }
  return (
    <Button asChild variant={outline ? 'outline' : 'default'}>
      <Link to={action.to}>{action.label}</Link>
    </Button>
  )
}

export function PageHero({
  eyebrow,
  title,
  lede,
  primary,
  secondary,
}: {
  eyebrow?: string
  title: string
  lede: string
  primary?: { label: string; to: string }
  secondary?: { label: string; to: string }
}) {
  return (
    <section className="container mx-auto px-6 pt-12 pb-8">
      {eyebrow && (
        <p className="mb-3 text-sm text-muted-foreground">{eyebrow}</p>
      )}
      <h1 className="mb-4 max-w-4xl text-4xl text-foreground md:text-5xl">{title}</h1>
      <p className="mb-8 max-w-3xl text-lg text-muted-foreground">{lede}</p>
      {(primary || secondary) && (
        <div className="flex flex-wrap gap-3">
          {primary && <ActionLink action={primary} />}
          {secondary && <ActionLink action={secondary} outline />}
        </div>
      )}
    </section>
  )
}

export function Section({
  title,
  children,
}: {
  title?: string
  children: ReactNode
}) {
  return (
    <section className="container mx-auto px-6 py-8">
      {title && <h2 className="text-2xl font-semibold text-foreground mb-4">{title}</h2>}
      {children}
    </section>
  )
}

export function CardGrid({
  items,
}: {
  items: Array<{ title: string; detail: string; to?: string }>
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => {
        const body = (
          <div className="h-full rounded-md border border-border bg-card p-5">
            <h3 className="mb-2 text-lg text-foreground">{item.title}</h3>
            <p className="text-muted-foreground">{item.detail}</p>
          </div>
        )
        return item.to ? (
          <Link key={item.title} to={item.to} className="block hover:border-cyan-bright">
            {body}
          </Link>
        ) : (
          <div key={item.title}>{body}</div>
        )
      })}
    </div>
  )
}

export function ClosingCta({
  title = 'Start a conversation',
  lede = 'Tell us who you are and what you need. The form takes a few minutes.',
  primary = { label: 'Start a Conversation', to: contactHref() },
  secondary,
}: {
  title?: string
  lede?: string
  primary?: { label: string; to: string }
  secondary?: { label: string; to: string }
}) {
  return (
    <section className="container mx-auto px-6 py-16">
      <div className="border-t border-border py-2">
        <h2 className="mb-3 text-3xl text-foreground">{title}</h2>
        <p className="mb-6 max-w-2xl text-muted-foreground">{lede}</p>
        <div className="flex flex-wrap gap-3">
          <ActionLink action={primary} />
          {secondary && <ActionLink action={secondary} outline />}
        </div>
      </div>
    </section>
  )
}

export function ReviewNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      {children}
    </p>
  )
}
