import { useEffect, useRef } from 'react'

const MASK = 2 * Math.PI * 154
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+<>/'
const EXPO_OUT = 'cubic-bezier(.16,1,.3,1)'
const EXPO_IN = 'cubic-bezier(.7,0,.84,0)'

const telemetry = [
  { k: 'Detail: ', v: 'Connecting', r: 'Connected' },
  { k: 'Location: ', v: 'Searching', r: 'Oklahoma City, OK' },
  { k: 'Coordinates: ', v: 'Searching', r: '35.4676° N / 97.5164° W' },
]

const legal = ['Dolonia Data Tech Solutions', 'A DBA of 1921 Holding Co. LLC', 'All rights reserved 2026']

function expoOut(t: number) {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

function expoIn(t: number) {
  return t <= 0 ? 0 : Math.pow(2, 10 * t - 10)
}

function setMask(circle: SVGCircleElement | null, progress: number) {
  if (!circle) return
  circle.style.strokeDashoffset = String(MASK * (1 - progress))
}

function flicker(el: HTMLElement | null, to = 1) {
  if (!el) return
  if (!el.animate) {
    el.style.opacity = String(to)
    return
  }
  el.animate(
    [
      { opacity: 0 },
      { opacity: 0.8, offset: 0.12 },
      { opacity: 0.3, offset: 0.25 },
      { opacity: 0.8, offset: 0.37 },
      { opacity: 0.3, offset: 0.5 },
      { opacity: to },
    ],
    { duration: 400, easing: 'linear', fill: 'forwards' },
  )
}

function scramble(el: HTMLElement, text: string, dur = 1.4, delay = 0.35) {
  const start = performance.now()
  const length = dur * 1000
  const wait = delay * 1000
  let last = 0
  const tick = (now: number) => {
    const elapsed = now - start
    const p = Math.max(0, Math.min(1, (elapsed - wait) / (length - wait)))
    const locked = Math.floor(expoOut(p) * text.length)
    if (now - last > 45 || p >= 1) {
      last = now
      let out = text.slice(0, locked)
      for (let i = locked; i < text.length; i += 1) {
        out += text[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0]
      }
      el.textContent = out
    }
    if (p < 1) requestAnimationFrame(tick)
    else el.textContent = text
  }
  requestAnimationFrame(tick)
}

function telemetryLine(li: HTMLElement) {
  const key = li.dataset.k || ''
  const searching = li.dataset.v || ''
  const resolved = li.dataset.r || ''
  li.classList.remove('wait')
  li.innerHTML = '<span class="k"></span><b class="v"></b><span class="dots"><i>.</i><i>.</i><i>.</i></span>'
  const keyEl = li.querySelector<HTMLElement>('.k')
  const valueEl = li.querySelector<HTMLElement>('.v')
  const dots = li.querySelector<HTMLElement>('.dots')
  if (!keyEl || !valueEl || !dots) return
  scramble(keyEl, key, 1.2, 0.3)
  scramble(valueEl, searching, 1.5, 0.5)
  window.setTimeout(() => {
    let on = 0
    const pulse = window.setInterval(() => {
      dots.querySelectorAll('i').forEach((dot, index) => {
        ;(dot as HTMLElement).style.opacity = index === on % 3 ? '1' : '0.5'
      })
      on += 1
    }, 200)
    window.setTimeout(() => {
      window.clearInterval(pulse)
      dots.remove()
      valueEl.textContent = resolved
      flicker(valueEl)
    }, 1100)
  }, 1600)
}

const OceanIntro = ({ onDone }: { onDone: () => void }) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const dialRef = useRef<HTMLDivElement>(null)
  const wipeRef = useRef<SVGCircleElement>(null)
  const progRef = useRef<SVGCircleElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      onDoneRef.current()
      return
    }

    const dial = dialRef.current
    const root = rootRef.current
    if (!dial || !root) return
    setMask(wipeRef.current, 0)
    setMask(progRef.current, 0)
    dial.animate(
      [
        { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 },
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
      ],
      { duration: 1000, easing: EXPO_OUT, fill: 'forwards' },
    )

    const timers: number[] = []
    const later = (ms: number, fn: () => void) => {
      timers.push(window.setTimeout(fn, ms))
    }
    const words = dial.querySelectorAll<HTMLElement>('.dc-a span, .dc-b span')
    const labels = Array.from(dial.querySelectorAll<HTMLElement>('.ocean-dial-n'))

    later(750, () => {
      dial.classList.add('is-thick')
      const start = performance.now()
      const sweep = (now: number) => {
        const p = Math.min(1, (now - start) / 2000)
        setMask(wipeRef.current, expoOut(p))
        if (p < 1) requestAnimationFrame(sweep)
      }
      requestAnimationFrame(sweep)
      root.querySelectorAll<HTMLElement>('.ocean-intro-telemetry li').forEach((li, index) => {
        later(index * 300, () => telemetryLine(li))
      })
      root.querySelectorAll<HTMLElement>('.lg').forEach((el, index) => {
        later(index * 300, () => scramble(el, el.dataset.text || '', 1.8, 0.5))
      })
    })
    later(1000, () => flicker(words[0]))
    later(1200, () => flicker(words[1]))

    const started = performance.now()
    let shown = 0
    let lit = 0
    let finished = false
    let last = started
    const marks = [0.25, 0.5, 0.75, 1]
    let frame = 0
    const step = (now: number) => {
      if (now - started < 900) {
        frame = requestAnimationFrame(step)
        return
      }
      const dt = (now - last) / 1000
      last = now
      shown = Math.min(1, shown + dt / 2)
      setMask(progRef.current, shown)
      while (lit < marks.length && shown >= marks[lit] - 1e-4) {
        flicker(labels[lit], 1)
        lit += 1
      }
      if (shown >= 1 && !finished && now - started > 3200) {
        finished = true
        finish()
        return
      }
      frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)

    const finish = () => {
      flicker(words[0], 0)
      later(200, () => flicker(words[2]))
      later(200, () => flicker(words[1], 0))
      later(400, () => flicker(words[3]))
      later(900, () => {
        const start = performance.now()
        let remaining = 3
        const close = (now: number) => {
          const p = Math.min(1, (now - start) / 800)
          const v = 1 - expoIn(p)
          setMask(wipeRef.current, v)
          while (remaining >= 0 && v <= marks[remaining]) {
            labels[remaining].style.transition = 'opacity .2s'
            labels[remaining].style.opacity = '0'
            remaining -= 1
          }
          if (p < 1) requestAnimationFrame(close)
        }
        requestAnimationFrame(close)
      })
      later(2300, () => {
        dial.animate(
          [
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 },
          ],
          { duration: 500, easing: EXPO_IN, fill: 'forwards' },
        )
      })
      later(2800, () => {
        root.classList.add('is-out')
        bgRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 2600,
          easing: EXPO_OUT,
          fill: 'forwards',
          delay: 350,
        })
      })
      later(6200, () => onDoneRef.current())
    }

    return () => {
      cancelAnimationFrame(frame)
      timers.forEach((id) => window.clearTimeout(id))
    }
  }, [])

  return (
    <div ref={rootRef} className="ocean-intro" role="status" aria-live="polite" aria-label="Loading experience">
      <div ref={bgRef} className="ocean-intro-bg" />
      <ul className="ocean-intro-telemetry" aria-hidden="true">
        {telemetry.map((line) => (
          <li key={line.k} className="wait" data-k={line.k} data-v={line.v} data-r={line.r} />
        ))}
      </ul>
      <div ref={dialRef} className="ocean-dial">
        <svg viewBox="0 0 400 400" aria-hidden="true">
          <defs>
            <mask id="ocean-wipe" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="400">
              <circle
                ref={wipeRef}
                cx="200"
                cy="200"
                r="154"
                fill="none"
                stroke="#fff"
                strokeWidth="44"
                strokeDasharray={`${MASK} ${MASK}`}
                strokeDashoffset={MASK}
                transform="rotate(-90 200 200)"
              />
            </mask>
            <mask id="ocean-prog" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="400">
              <circle
                ref={progRef}
                cx="200"
                cy="200"
                r="154"
                fill="none"
                stroke="#fff"
                strokeWidth="44"
                strokeDasharray={`${MASK} ${MASK}`}
                strokeDashoffset={MASK}
                transform="rotate(-90 200 200)"
              />
            </mask>
          </defs>
          <g className="ocean-dial-outer">
            <circle className="dot" cx="200" cy="64" r="3.5" />
            <circle className="dot" cx="200" cy="336" r="3.5" />
            <circle className="guide" cx="200" cy="200" r="163" />
            <path className="guide" d="M200 0V34M200 366V400M0 200H34M366 200H400" />
          </g>
          <g mask="url(#ocean-wipe)">
            <circle className="track" cx="200" cy="200" r="150" />
            <circle className="fill" cx="200" cy="200" r="150" mask="url(#ocean-prog)" />
          </g>
        </svg>
        {['25', '50', '75', '100'].map((mark) => (
          <span key={mark} className={`ocean-dial-n n${mark}`}>
            {mark}
          </span>
        ))}
        <div className="ocean-dial-c">
          <div className="dc-a">
            <span>Loading</span>
            <span>Experience</span>
          </div>
          <div className="dc-b">
            <span>Connection</span>
            <span>Established</span>
          </div>
        </div>
      </div>
      <svg className="ocean-intro-corner" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M.5 .5H23.5V23.5H.5Z M.5 .5L23.5 23.5" />
      </svg>
      <div className="ocean-intro-legal">
        <span>
          {legal.map((line) => (
            <span key={line}>
              <span className="lg" data-text={line} />
              <br />
            </span>
          ))}
        </span>
        <svg className="corner" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M.5 .5H23.5V23.5H.5Z M.5 .5L23.5 23.5 M.5 23.5L23.5 .5" />
        </svg>
      </div>
    </div>
  )
}

export default OceanIntro
