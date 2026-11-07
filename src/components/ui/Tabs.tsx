import { useId, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import clsx from 'clsx'

export type TabItem = {
  id: string
  label: string
  content: ReactNode
}

export function Tabs({ tabs, defaultTabId }: { tabs: TabItem[]; defaultTabId?: string }) {
  const groupId = useId()
  const [params, setParams] = useSearchParams()
  const fromUrl = params.get('tab')
  const activeId = tabs.some((t) => t.id === fromUrl) ? fromUrl : (defaultTabId ?? tabs[0]?.id)
  const setActiveId = (id: string) => setParams({ tab: id }, { replace: true })

  return (
    <div>
      <div role="tablist" className="mb-6 flex gap-1 overflow-x-auto overflow-y-hidden border-b border-hairline">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeId === tab.id}
            onClick={() => setActiveId(tab.id)}
            className={clsx(
              'relative cursor-pointer whitespace-nowrap px-4 pb-3 pt-2 text-sm font-medium transition-colors',
              activeId === tab.id ? 'text-bone' : 'text-fog hover:text-bone-dim',
            )}
          >
            {tab.label}
            {activeId === tab.id && (
              <motion.span
                layoutId={`tab-indicator-${groupId}`}
                className="absolute inset-x-0 bottom-0 h-0.5 bg-accent"
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
