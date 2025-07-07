import { useState } from 'react'
import { MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface ActionMenuItem {
  label: string
  onClick: () => void
  variant?: 'default' | 'destructive'
  className?: string
}

interface ActionMenuProps {
  items: ActionMenuItem[]
  triggerClassName?: string
}

export function ActionMenu({ items, triggerClassName }: ActionMenuProps) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowMenu(!showMenu)}
        className={`text-slate-400 hover:text-white p-2 ${triggerClassName || ''}`}
      >
        <MoreVertical className="h-4 w-4" />
      </Button>

      {showMenu && (
        <>
          {/* Backdrop to close menu */}
          <div className="fixed inset-0 z-[9]" onClick={() => setShowMenu(false)} />

          <div className="absolute right-0 top-8 z-10 bg-slate-800 border border-slate-600 rounded-md shadow-lg min-w-[150px]">
            {items.map((item, index) => {
              const isFirst = index === 0
              const isLast = index === items.length - 1
              const isDestructive = item.variant === 'destructive'

              return (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick()
                    setShowMenu(false)
                  }}
                  className={`
                    w-full text-left px-3 py-2 text-sm hover:bg-slate-700 flex items-center gap-2
                    ${isFirst ? 'rounded-t-md' : ''}
                    ${isLast ? 'rounded-b-md' : ''}
                    ${
                      isDestructive
                        ? 'text-red-400 hover:text-red-300'
                        : 'text-slate-300 hover:text-white'
                    }
                    ${item.className || ''}
                  `}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
