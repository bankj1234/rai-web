import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CustomPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onPreviousPage: () => void
  onNextPage: () => void
}

export function CustomPagination({
  currentPage,
  totalPages,
  onPageChange,
  onPreviousPage,
  onNextPage,
}: CustomPaginationProps) {
  // Generate pagination numbers with ellipsis
  const generatePaginationItems = () => {
    const items: (number | string)[] = []
    const maxVisiblePages = 10

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages <= 10
      for (let i = 1; i <= totalPages; i++) {
        items.push(i)
      }
    } else {
      // Show pages with ellipsis
      if (currentPage <= 6) {
        // Show first 7 pages, ellipsis, last page
        for (let i = 1; i <= 7; i++) {
          items.push(i)
        }
        items.push('...')
        items.push(totalPages)
      } else if (currentPage >= totalPages - 5) {
        // Show first page, ellipsis, last 7 pages
        items.push(1)
        items.push('...')
        for (let i = totalPages - 6; i <= totalPages; i++) {
          items.push(i)
        }
      } else {
        // Show first page, ellipsis, current-2 to current+2, ellipsis, last page
        items.push(1)
        items.push('...')
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          items.push(i)
        }
        items.push('...')
        items.push(totalPages)
      }
    }

    return items
  }

  return (
    <div className="flex items-center justify-center py-4">
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onPreviousPage}
          disabled={currentPage === 1}
          className="px-3 py-2 text-slate-100 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        {generatePaginationItems().map((item, index) => (
          <div key={index}>
            {item === '...' ? (
              <span className="px-3 py-2 text-slate-400 text-sm">...</span>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(item as number)}
                className={`px-3 py-2 text-sm ${
                  currentPage === item
                    ? 'bg-white text-blue-400 border-blue-400'
                    : 'text-white hover:text-white hover:bg-slate-700'
                }`}
              >
                {item}
              </Button>
            )}
          </div>
        ))}

        <Button
          variant="ghost"
          size="sm"
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-slate-100 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
