import { ReactNode } from 'react'

interface TableRowProps {
  children: ReactNode
  className?: string
}

export function TableRow({ children, className = '' }: TableRowProps) {
  return (
    <div
      className={`hidden lg:grid grid-cols-12 gap-4 p-4 border-b border-slate-700 hover:bg-slate-800/30 transition-colors ${className}`}
    >
      {children}
    </div>
  )
}

interface TableCellProps {
  children: ReactNode
  className: string // เช่น "col-span-8 flex items-center justify-start"
}

export function TableCell({ children, className }: TableCellProps) {
  return <div className={className}>{children}</div>
}
