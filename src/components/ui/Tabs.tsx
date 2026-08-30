import { useId, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

export type TabItem = {
  id: string
  label: string
  content: ReactNode
}

export function Tabs({ tabs, defaultTabId }: { tabs: TabItem[]; defaultTabId?: string }) {
  const groupId = useId()
  const [activeId, setActiveId] = useState(defaultTabId ?? tabs[0]?.id)

  return (
    <div>
      <div role="tablist" className="mb-10 flex gap-8 border-b border-hairline">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeId === tab.id}
            onClick={() => setActiveId(tab.id)}
            className={clsx(
              'relative cursor-pointer pb-4 text-xs font-medium uppercase tracking-[0.2em] transition-colors',
              activeId === tab.id ? 'text-bone' : 'text-fog hover:text-bone-dim',
            )}
          >
            {tab.label}
            {activeId === tab.id && (
              <motion.span
                layoutId={`tab-indicator-${groupId}`}
                className="absolute inset-x-0 -bottom-px h-px bg-accent"
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              />
            )}
          </button>
        ))}
      </div>

      {tabs.map((tab) => (
        <div key={tab.id} role="tabpanel" hidden={activeId !== tab.id}>
          {tab.content}
        </div>
      ))}
    </div>
  )
}
