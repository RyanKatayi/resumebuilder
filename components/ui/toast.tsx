"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ToastProps {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'success'
  duration?: number
}

interface ToastContextProps {
  toasts: ToastProps[]
  addToast: (toast: Omit<ToastProps, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextProps | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const addToast = React.useCallback((toast: Omit<ToastProps, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { ...toast, id }
    setToasts(prev => [...prev, newToast])
    
    // Auto remove after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, toast.duration || 5000)
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastComponentProps extends ToastProps {
  onRemove: () => void
}

function Toast({ title, description, variant = 'default', onRemove }: ToastComponentProps) {
  const variants = {
    default: 'bg-white border border-gray-200 text-gray-900',
    destructive: 'bg-red-50 border border-red-200 text-red-900',
    success: 'bg-green-50 border border-green-200 text-green-900'
  }


  return (
    <div className={cn(
      "min-w-80 max-w-md p-4 rounded-lg shadow-lg flex items-start gap-3 animate-in slide-in-from-right duration-300",
      variants[variant]
    )}>
      <div className="flex-1">
        {title && (
          <div className="font-medium text-sm">{title}</div>
        )}
        {description && (
          <div className="text-sm opacity-90 mt-1">{description}</div>
        )}
      </div>
      <button
        onClick={onRemove}
        className="opacity-70 hover:opacity-100 transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}