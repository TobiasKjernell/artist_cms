import { useEffect, useState } from 'react'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { EmberField } from '../effects/EmberField'

const WORDMARK = 'EMBER'

const easeOut = [0.16, 1, 0.3, 1] as const

const letterVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { delay: 0.5 + i * 0.07, duration: 0.6, ease: easeOut },
  }),
}

export function IntroAnimation() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!visible) return
    const dismiss = setTimeout(() => setVisible(false), 3600)
    return () => clearTimeout(dismiss)
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-ink"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
          onClick={() => setVisible(false)}
          role="presentation"
        >
          <motion.div
            className="pointer-events-none absolute -top-1/3 left-1/2 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-accent-strong/20 blur-[120px]"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
          />
          <motion.div
            className="pointer-events-none absolute bottom-0 right-1/3 h-[40vh] w-[40vh] rounded-full bg-accent-hot/10 blur-[100px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.3 }}
          />

          <EmberField count={20} />

          <div
            className="relative flex items-center"
            style={{ textShadow: '0 0 30px rgba(255, 122, 61, 0.55)' }}
          >
            {WORDMARK.split('').map((letter, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                className="font-display text-5xl tracking-[0.12em] text-bone sm:text-7xl"
              >
                {letter}
              </motion.span>
            ))}
          </div>

          <motion.div
            className="mt-6 h-px w-16 bg-linear-to-r from-transparent via-accent to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />

          <motion.p
            className="mt-6 text-xs uppercase tracking-[0.3em] text-fog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7, duration: 0.8 }}
          >
            An artist platform
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
