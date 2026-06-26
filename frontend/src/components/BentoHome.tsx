import React from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Bot,
  Globe,
  Server,
  Shield,
  Sparkles,
  Workflow,
  Zap,
  Database,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

/* ------------------------------------------------------------------ */
/*  Shared tile primitive                                              */
/* ------------------------------------------------------------------ */
const Tile: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { glow?: boolean; as?: 'div' | 'a' }
> = ({ className = '', children, glow = false, ...rest }) => (
  <div
    {...rest}
    className={`group relative overflow-hidden rounded-3xl border border-border/60 bg-card/60 backdrop-blur-xl p-6 md:p-8 transition-all duration-500 hover:border-accent/50 hover:-translate-y-1 ${
      glow ? 'shadow-elegant' : ''
    } ${className}`}
  >
    {/* subtle gradient sheen */}
    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_top_right,hsl(var(--accent)/0.18),transparent_60%)]" />
    <div className="relative h-full">{children}</div>
  </div>
)

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */
const Hero: React.FC = () => (
  <section className="relative pt-32 pb-12 md:pt-40 md:pb-20">
    {/* glow backdrop */}
    <div className="absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_at_top,hsl(var(--accent)/0.18),transparent_60%)] pointer-events-none" />
    <div className="container mx-auto px-6 relative">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/5 text-xs md:text-sm text-accent mb-6 font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          Premium AI · Web · Infrastructure
        </div>

        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-semibold leading-[1.05] tracking-tight">
          Engineering intelligent
          <span className="block bg-gradient-cyber bg-clip-text text-transparent">
            systems that scale.
          </span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Dolonia builds AI automation, modern web platforms, and secure
          infrastructure for businesses that need reliability, speed, and
          measurable outcomes.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="bg-gradient-cyber text-primary-foreground hover:opacity-90 shadow-elegant"
          >
            <Link to="/contact">
              Start a project <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-border/80 hover:border-accent/60 hover:bg-accent/5"
          >
            <Link to="/pricing">View pricing</Link>
          </Button>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-accent" /> Fixed monthly retainers
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-accent" /> US-based delivery
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-accent" /> Self-hostable stack
          </span>
        </div>
      </div>
    </div>
  </section>
)

/* ------------------------------------------------------------------ */
/*  Bento grid                                                         */
/* ------------------------------------------------------------------ */
const BentoGrid: React.FC = () => (
  <section className="py-12 md:py-20">
    <div className="container mx-auto px-6">
      <div className="mb-10 max-w-2xl">
        <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
          What we do
        </span>
        <h2 className="mt-3 font-display text-3xl md:text-5xl font-semibold">
          One partner for the entire stack.
        </h2>
        <p className="mt-4 text-muted-foreground">
          Strategy, design, and engineering across three disciplines — delivered
          as productized retainers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 auto-rows-[minmax(180px,auto)] gap-4 md:gap-5">
        {/* AI Automation — wide hero tile */}
        <Tile glow className="md:col-span-4 md:row-span-2 bg-gradient-to-br from-card/80 to-secondary/40">
          <div className="flex flex-col h-full justify-between gap-6">
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent/15 text-accent mb-5">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-semibold">
                AI Automation
              </h3>
              <p className="mt-3 text-muted-foreground max-w-md">
                Custom agents, RAG systems, and workflow automations that
                eliminate repetitive operations and unlock new revenue.
              </p>
            </div>
            <ul className="grid grid-cols-2 gap-2 text-sm text-foreground/80">
              {['Custom AI agents', 'RAG & knowledge bots', 'Workflow automation', 'Data pipelines'].map(
                (i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {i}
                  </li>
                ),
              )}
            </ul>
          </div>
        </Tile>

        {/* Web Platforms */}
        <Tile className="md:col-span-2 md:row-span-1">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/15 text-primary mb-3">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="font-display text-xl font-semibold">Web Platforms</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Marketing sites, dashboards, and SaaS built on React, Vite, and
            modern edge infra.
          </p>
        </Tile>

        {/* Infrastructure */}
        <Tile className="md:col-span-2 md:row-span-1">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/15 text-primary mb-3">
            <Server className="w-5 h-5" />
          </div>
          <h3 className="font-display text-xl font-semibold">Infrastructure</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Self-hosted, containerized, observable. Supabase, Docker, and NAS
            deployments done right.
          </p>
        </Tile>

        {/* Security */}
        <Tile className="md:col-span-2">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-accent/15 text-accent mb-3">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-display text-xl font-semibold">Security</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            RLS, RBAC, audit logs and hardened deployments baked in from day one.
          </p>
        </Tile>

        {/* Integrations */}
        <Tile className="md:col-span-2">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-accent/15 text-accent mb-3">
            <Workflow className="w-5 h-5" />
          </div>
          <h3 className="font-display text-xl font-semibold">Integrations</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Stripe, CRMs, email, and internal tooling tied together with
            reliable webhooks.
          </p>
        </Tile>

        {/* Data */}
        <Tile className="md:col-span-2">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-accent/15 text-accent mb-3">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="font-display text-xl font-semibold">Data</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Modeled schemas, secure storage, and analytics that drive real
            decisions.
          </p>
        </Tile>
      </div>
    </div>
  </section>
)

/* ------------------------------------------------------------------ */
/*  Proof                                                              */
/* ------------------------------------------------------------------ */
const Proof: React.FC = () => {
  const items = [
    {
      title: 'Enhanced Games Peptides',
      tag: 'E-commerce platform',
      blurb:
        'Full storefront, secure checkout, and customer portal built on a managed stack.',
      metric: '$1,600',
      metricLabel: 'Build value',
    },
    {
      title: 'Thunder Walker / RSMG',
      tag: 'Automation & media',
      blurb:
        'Ongoing media management and workflow automation reducing manual operations.',
      metric: '$1k+/mo',
      metricLabel: 'Retainer',
    },
    {
      title: 'OKC SMB Portfolio',
      tag: 'Web platforms',
      blurb:
        'Four production launches with SEO, maintenance, and mobile-first design.',
      metric: '4+',
      metricLabel: 'Launches',
    },
  ]

  return (
    <section className="py-16 md:py-24 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div className="max-w-xl">
            <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
              Project proof
            </span>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-semibold">
              Built for real businesses.
            </h2>
          </div>
          <Button asChild variant="ghost" className="text-accent hover:bg-accent/10">
            <Link to="/solutions">
              See all work <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {items.map((it) => (
            <Tile key={it.title} className="flex flex-col justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-accent">
                  {it.tag}
                </span>
                <h3 className="mt-2 font-display text-xl font-semibold">
                  {it.title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">{it.blurb}</p>
              </div>
              <div className="mt-6 flex items-end justify-between border-t border-border/60 pt-4">
                <div>
                  <div className="font-display text-2xl text-foreground">
                    {it.metric}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {it.metricLabel}
                  </div>
                </div>
                <TrendingUp className="h-5 w-5 text-accent/70" />
              </div>
            </Tile>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Pricing teaser                                                     */
/* ------------------------------------------------------------------ */
const PricingTeaser: React.FC = () => {
  const tiers = [
    {
      name: 'Starter',
      price: '$500',
      cadence: '/ month',
      features: [
        'Marketing site or simple app',
        '1 automation workflow',
        'Monthly maintenance',
        'Email support',
      ],
    },
    {
      name: 'Business',
      price: '$1,200',
      cadence: '/ month',
      featured: true,
      features: [
        'Custom platform + dashboards',
        '3+ AI / automation workflows',
        'Priority support & SLAs',
        'Quarterly strategy review',
      ],
    },
    {
      name: 'Secure Data',
      price: 'Custom',
      cadence: 'engagement',
      features: [
        'Self-hosted infrastructure',
        'Hardened security & RBAC',
        'Dedicated environment',
        'Compliance support',
      ],
    },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
            Simple pricing
          </span>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-semibold">
            Productized retainers. No surprises.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Fixed monthly investment, clear scope, and one accountable partner.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {tiers.map((t) => (
            <Tile
              key={t.name}
              glow={t.featured}
              className={
                t.featured
                  ? 'border-accent/60 bg-gradient-to-br from-accent/10 to-primary/5'
                  : ''
              }
            >
              {t.featured && (
                <div className="absolute top-4 right-4 text-[10px] uppercase tracking-wider bg-accent text-accent-foreground px-2 py-1 rounded-full font-semibold">
                  Most popular
                </div>
              )}
              <h3 className="font-display text-lg font-semibold">{t.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-4xl font-semibold">
                  {t.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  {t.cadence}
                </span>
              </div>
              <ul className="mt-6 space-y-2.5 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-foreground/85">{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className={`mt-8 w-full ${
                  t.featured
                    ? 'bg-gradient-cyber text-primary-foreground hover:opacity-90'
                    : 'bg-secondary hover:bg-secondary/80'
                }`}
              >
                <Link to="/contact">Get started</Link>
              </Button>
            </Tile>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Final CTA                                                          */
/* ------------------------------------------------------------------ */
const FinalCTA: React.FC = () => (
  <section className="py-20 md:py-28">
    <div className="container mx-auto px-6">
      <div className="relative overflow-hidden rounded-[2rem] border border-accent/30 bg-gradient-to-br from-secondary/60 via-card to-card p-10 md:p-16 text-center shadow-elegant">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,hsl(var(--accent)/0.18),transparent_70%)]" />
        <div className="relative max-w-2xl mx-auto">
          <Zap className="h-10 w-10 text-accent mx-auto mb-4" />
          <h2 className="font-display text-3xl md:text-5xl font-semibold">
            Ready to ship something premium?
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Tell us about your business. We'll respond within one business day
            with a clear plan.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-cyber text-primary-foreground hover:opacity-90"
            >
              <Link to="/contact">
                Book a discovery call <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/services">Explore services</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
)

const BentoHome: React.FC = () => (
  <>
    <Hero />
    <BentoGrid />
    <Proof />
    <PricingTeaser />
    <FinalCTA />
  </>
)

export default BentoHome
