import { AnimatePresence, motion } from 'framer-motion'
import { createPortal } from 'react-dom'

/** Full-screen, uncropped image viewer — the grid tiles that open this are
 * cropped to a square for a tidy layout, but the photo itself deserves to
 * be seen at its full quality and real aspect ratio. */
export function Lightbox({ src, onClose }: { src: string | null; onClose: () => void }) {
  return createPortal(
    <AnimatePresence>
      {src && (
        <motion.div
          className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-ink/90 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.img
            src={src}
            alt=""
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-h-full max-w-full cursor-auto rounded-lg object-contain shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
