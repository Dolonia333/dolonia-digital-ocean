import { useEffect } from 'react'
import { trackEngagement } from '@/lib/engagement'

type HTMLElementWithEngagement = HTMLElement & {
  dataset: DOMStringMap & {
    engagement?: string
    engagementCategory?: string
    engagementLabel?: string
  }
}

const EVENT_TYPES: Array<keyof DocumentEventMap> = ['click', 'submit'] // extendable for future interactions

export default function EngagementListener() {
  useEffect(() => {
    const handler = (event: Event) => {
      const target = event.target as HTMLElement | null
      if (!target) {
        return
      }

      const actionable = (target.closest('[data-engagement]') ??
        target) as HTMLElementWithEngagement | null
      if (!actionable) {
        return
      }

      const engagementName = actionable.dataset.engagement
      if (!engagementName) {
        return
      }

      const { engagementCategory, engagementLabel, ...rest } = actionable.dataset

      void trackEngagement(engagementName, {
        event_category: engagementCategory ?? 'interaction',
        event_label: engagementLabel ?? actionable.innerText?.trim() ?? undefined,
        ...rest,
      })
    }

    EVENT_TYPES.forEach((eventType) =>
      document.addEventListener(eventType, handler, { capture: true }),
    )

    return () => {
      EVENT_TYPES.forEach((eventType) =>
        document.removeEventListener(eventType, handler, { capture: true }),
      )
    }
  }, [])

  return null
}
