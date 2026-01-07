import { ToastMessage } from '../components/Toast'

let toastIdCounter = 0
let toastListeners: Array<(toasts: ToastMessage[]) => void> = []
let currentToasts: ToastMessage[] = []

const notifyListeners = () => {
  toastListeners.forEach(listener => listener([...currentToasts]))
}

export const toast = {
  success: (message: string, duration?: number) => {
    const id = `toast-${++toastIdCounter}`
    const newToast: ToastMessage = { id, message, type: 'success', duration }
    currentToasts.push(newToast)
    notifyListeners()
  },
  error: (message: string, duration?: number) => {
    const id = `toast-${++toastIdCounter}`
    const newToast: ToastMessage = { id, message, type: 'error', duration }
    currentToasts.push(newToast)
    notifyListeners()
  },
  warning: (message: string, duration?: number) => {
    const id = `toast-${++toastIdCounter}`
    const newToast: ToastMessage = { id, message, type: 'warning', duration }
    currentToasts.push(newToast)
    notifyListeners()
  },
  info: (message: string, duration?: number) => {
    const id = `toast-${++toastIdCounter}`
    const newToast: ToastMessage = { id, message, type: 'info', duration }
    currentToasts.push(newToast)
    notifyListeners()
  },
}

// 导出用于 ToastContainer 的内部函数
export const subscribeToToasts = (listener: (toasts: ToastMessage[]) => void) => {
  toastListeners.push(listener)
  listener([...currentToasts])
  return () => {
    toastListeners = toastListeners.filter(l => l !== listener)
  }
}

export const removeToast = (id: string) => {
  currentToasts = currentToasts.filter(t => t.id !== id)
  notifyListeners()
}
