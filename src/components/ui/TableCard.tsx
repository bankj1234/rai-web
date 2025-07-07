import { ReactNode } from 'react'

interface TableCardProps {
  children: ReactNode
  className?: string
}

export function TableCard({ children, className = '' }: TableCardProps) {
  return (
    <div
      className={`lg:hidden bg-slate-800/50 rounded-lg p-4 mb-3 border border-slate-700 ${className}`}
    >
      {children}
    </div>
  )
}

interface TableCardContentProps {
  title: ReactNode
  subtitle?: ReactNode
  actions?: ReactNode
  titleActions?: ReactNode // สำหรับ edit icon ใน workspace
}

export function TableCardContent({
  title,
  subtitle,
  actions,
  titleActions,
}: TableCardContentProps) {
  return (
    <div className="flex justify-between items-start mb-3">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          {title}
          {titleActions}
        </div>
        {subtitle && <div className="text-slate-400 text-sm">{subtitle}</div>}
      </div>
      {actions && <div className="relative ml-4">{actions}</div>}
    </div>
  )
}
