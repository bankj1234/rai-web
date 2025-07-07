interface TableHeaderProps {
  title: string
  columns: Array<{
    label: string
    className: string // เช่น "col-span-8 text-left"
  }>
}

export function TableHeader({ title, columns }: TableHeaderProps) {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white">{title}</h1>
      </div>
      <div className="hidden lg:grid grid-cols-12 gap-4 p-4 border-b border-slate-700 text-slate-400 text-sm font-medium">
        {columns.map((column, index) => (
          <div key={index} className={column.className}>
            {column.label}
          </div>
        ))}
      </div>
    </>
  )
}
