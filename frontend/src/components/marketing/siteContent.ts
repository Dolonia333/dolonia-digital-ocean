export const company = {
  name: 'Dolonia Data Tech',
  holding: '1921 Holding Co.',
  location: 'Oklahoma City',
  uei: 'YMP7Z9T1WVX5',
  cage: '9T6Y5',
  naics: '541330',
  thesis: 'Systems that help people navigate complex systems.',
  certs: ['WOSB', 'MBE', 'WBE', 'SDB', 'AABE', 'HUBZone'],
}

export const placeholders = {
  phone: '[PHONE]',
  email: '[EMAIL]',
  address: '[MAILING ADDRESS]',
  linkedin: '[LINKEDIN]',
  poc: '[POC NAME AND TITLE]',
  dba: '[DBA]',
  responseTime: '[RESPONSE TIME]',
  duration: '[DURATION]',
  price: '[PRICE]',
  programStatus: '[PROGRAM STATUS]',
  commercialization: '[COMMERCIALIZATION STATUS]',
  denizenAccess: '[PLACEHOLDER]',
  extraNaics: '[NAICS CODES BEYOND 541330]',
}

export const competencies = [
  { title: 'AI operations', detail: 'Workflows that keep people in control of the work.' },
  { title: 'Software', detail: 'Products and tools built for a specific job, not a generic stack.' },
  { title: 'Secure data', detail: 'Hosting, access control, and backups for sensitive information.' },
  { title: 'Engineering', detail: 'Aerospace, mechanical, and manufacturing support. NAICS 541330.' },
  { title: 'Workforce technology', detail: 'Tools that connect training, mentoring, and placement.' },
  { title: 'SmartContainer', detail: 'Modular sites that can be deployed and reconfigured.' },
]

export const differentiators = [
  'Dolonia runs its own platform, Denizen, instead of only reselling tools.',
  'Software and engineering sit on the same team.',
  'Small business certifications: WOSB, MBE, WBE, SDB, AABE, and HUBZone.',
  'Work is aimed at rural communities and workforce systems.',
  'Teaming relationship with RM Cyber. [CONFIRM PUBLIC NAME AND LOGO]',
]

export const offers = [
  {
    title: 'Software and AI',
    detail: 'Products, workflows, and the Denizen platform.',
    to: '/build',
  },
  {
    title: 'Secure data',
    detail: 'Hosting, private cloud, and regulated-data systems.',
    to: '/build/support-plans',
  },
  {
    title: 'Engineering',
    detail: 'Aerospace, mechanical, and manufacturing. NAICS 541330.',
    to: '/engineering',
  },
  {
    title: 'Workforce and infrastructure',
    detail: 'I.W.I.N. and SmartContainer.',
    to: '/ecosystem',
  },
]

export const platforms = [
  {
    title: 'Denizen',
    detail: 'Software for running work across people and agents.',
    to: '/denizen',
  },
  {
    title: 'I.W.I.N.',
    detail: 'A workforce network aligned with DOL apprenticeship design.',
    to: '/ecosystem/iwin',
  },
  {
    title: 'SmartContainer',
    detail: 'Modular hubs for rural and underserved places.',
    to: '/ecosystem/smartcontainer',
  },
  {
    title: 'Engineering',
    detail: 'In-house aerospace, mechanical, and manufacturing.',
    to: '/engineering',
  },
]

export const supportPlans = [
  {
    name: 'Starter Infrastructure',
    for: 'Small sites and early products',
    highlights: [
      'Hosting and SSL',
      '2 automations',
      'Basic SEO',
      'Monthly maintenance',
    ],
  },
  {
    name: 'Automation Growth',
    for: 'Growing businesses',
    highlights: [
      'Custom site or app',
      'Up to 5 AI workflows',
      'Cloudflare and Supabase',
      'Weekly monitoring',
    ],
  },
  {
    name: 'Secure Data Systems',
    for: 'Sensitive or regulated data',
    highlights: [
      'Private cloud or NAS',
      'Zero-Trust access',
      'Backups and Docker',
      '24/7 monitoring',
      'HIPAA / SOC 2 ready configurations',
    ],
  },
]

export const leaders = [
  { name: 'Angela', role: 'CEO, 1921 Holding Co.' },
  { name: 'Zion', role: 'CEO, Dolonia Data Tech' },
  { name: 'Dr. Ed', role: 'Engineering' },
]

export const pursuitAreas = [
  'Modernization',
  'Workforce',
  'Rural',
  'Healthcare',
  'Smart infrastructure',
  'AI operations',
]

export const sprintDeliverables = [
  'Discovery',
  'Brief',
  'Designs',
  'Technical plan',
  'Prototype',
  'Phased estimate',
  'Readout',
]

export const verifiedProjects: Array<{
  title: string
  customer: string
  contractNumber: string
  period: string
  role: string
  value: string
  scope: string
  outcome: string
  reference: 'yes' | 'no'
}> = []

export const audiences = [
  'Contracting officer',
  'Small business liaison',
  'Prime contractor',
  'Federal agency',
  'State or local agency',
  'Founder',
  'Small or midsize business',
  'Organization',
  'Other',
] as const

export const govAudiences = new Set<string>([
  'Contracting officer',
  'Small business liaison',
  'Prime contractor',
  'Federal agency',
  'State or local agency',
])

export const interests = [
  'Capability statement',
  'Teaming / subcontracting',
  'Product Sprint',
  'Support plan',
  'Denizen',
  'I.W.I.N.',
  'SmartContainer',
  'Engineering',
  'General conversation',
] as const

export const setAsides = [
  'WOSB',
  'MBE',
  'WBE',
  'SDB',
  'AABE',
  'HUBZone',
  'Full and open',
  'Other',
  'Not sure',
]

export const contactHref = (interest?: string, audience?: string) => {
  const params = new URLSearchParams()
  if (interest) params.set('interest', interest)
  if (audience) params.set('audience', audience)
  const query = params.toString()
  return query ? `/contact?${query}` : '/contact'
}
