'use client'

import { AlertCircle, Check } from 'lucide-react'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'
import { useToast } from '@/hooks/use-toast'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        const isSuccess = variant === 'default'
        const isError = variant === 'destructive'

        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex items-start space-x-3">
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {isSuccess && (
                  <div className="flex items-center justify-center w-5 h-5 bg-green-500 rounded-full">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
                {isError && (
                  <div className="flex items-center justify-center w-5 h-5 bg-red-500 rounded-full">
                    <AlertCircle className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && <ToastDescription>{description}</ToastDescription>}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
