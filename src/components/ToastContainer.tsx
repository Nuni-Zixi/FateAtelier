import { useState, useEffect } from 'react'
import Toast, { ToastMessage } from './Toast'
import { subscribeToToasts, removeToast } from '../utils/toast'
import './Toast.css'

function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  useEffect(() => {
    const unsubscribe = subscribeToToasts((newToasts) => {
      setToasts(newToasts)
    })
    return unsubscribe
  }, [])

  const handleRemove = (id: string) => {
    removeToast(id)
  }

  if (toasts.length === 0) return null

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={handleRemove} />
      ))}
    </div>
  )
}

export default ToastContainer

