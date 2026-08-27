import { useMemo, type CSSProperties } from 'react'

type Ember = {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  drift: number
  color: string
}

const COLORS = ['var(--color-accent)', 'var(--color-accent-strong)', 'var(--color-accent-hot)']

function randomEmbers(count: number): Ember[] {
  return Array.from({ length: count }, (_, id) => {
    const size = 2 + Math.random() * 4
    return {
      id,
      left: Math.random() * 100,
      size,
      duration: 7 + Math.random() * 9,
      // Negative delays start each particle mid-flight so the field feels
      // already alive on first paint instead of bursting from the bottom.
      delay: Math.random() * -14,
      drift: (Math.random() - 0.5) * 120,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }
  })
}

/** A field of drifting, glowing embers — used behind the login screen. */
export function EmberField({ count = 32 }: { count?: number }) {
  const embers = useMemo(() => randomEmbers(count), [count])

  return (
    <div className="ember-field" aria-hidden="true">
      {embers.map((ember) => (
        <span
          key={ember.id}
          className="ember-particle"
          style={
            {
              left: `${ember.left}%`,
              width: ember.size,
              height: ember.size,
              background: ember.color,
              boxShadow: `0 0 ${ember.size * 2}px ${ember.color}, 0 0 ${ember.size * 6}px ${ember.color}`,
              '--drift': `${ember.drift}px`,
              '--duration': `${ember.duration}s`,
              '--delay': `${ember.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
