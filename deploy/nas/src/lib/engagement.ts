export type EngagementProperties = Record<string, string | number | boolean | null | undefined>

type TrackOptions = {
  transport?: 'beacon' | 'image' | 'xhr'
}

const DEFAULT_OPTIONS: TrackOptions = {
  transport: 'beacon',
}

export async function trackEngagement(
  eventName: string,
  properties: EngagementProperties = {},
  options: TrackOptions = {},
) {
  if (!eventName) {
    return
  }

  const mergedOptions: TrackOptions = { ...DEFAULT_OPTIONS, ...options }

  if (typeof window !== 'undefined') {
    const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag
    if (typeof gtag === 'function') {
      gtag('event', eventName, {
        ...properties,
        event_category: properties.event_category ?? 'engagement',
        transport_type: mergedOptions.transport,
      })
    }
  }

  if (process.env.NODE_ENV === 'development') {
    console.debug('[engagement]', eventName, properties)
  }
}
