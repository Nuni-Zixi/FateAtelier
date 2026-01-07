/**
 * 确认对话框工具函数
 * 提供统一的确认对话框接口
 */

export interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

export type ConfirmCallback = (confirmed: boolean) => void

// 全局确认对话框状态
let confirmListeners: Array<(options: ConfirmOptions & { callback: ConfirmCallback }) => void> = []

/**
 * 显示确认对话框
 */
export function confirm(options: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    const callback = (confirmed: boolean) => {
      resolve(confirmed)
    }

    // 通知所有监听器
    confirmListeners.forEach(listener => {
      listener({ ...options, callback })
    })
  })
}

/**
 * 订阅确认对话框事件
 */
export function subscribeConfirmDialog(
  listener: (options: ConfirmOptions & { callback: ConfirmCallback }) => void
) {
  confirmListeners.push(listener)
  return () => {
    confirmListeners = confirmListeners.filter(l => l !== listener)
  }
}

