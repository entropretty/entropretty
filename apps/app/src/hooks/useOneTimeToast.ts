import * as React from "react"
import { toast } from "sonner"

interface UseOneTimeToastOptions {
  /**
   * Unique identifier for the toast to track its dismissed state
   */
  toastId: string
  /**
   * Duration in milliseconds. Set to Infinity for persistent toasts
   */
  duration?: number
  /**
   * Whether the toast can be manually dismissed
   */
  dismissible?: boolean
}

export function useOneTimeToast(
  ToastComponent: React.ComponentType<{ id: string | number }>,
  options: UseOneTimeToastOptions,
): void {
  React.useEffect(() => {
    const hasBeenDismissed = localStorage.getItem(options.toastId)

    if (hasBeenDismissed) {
      return
    }

    toast.custom(
      (id: string | number) => {
        return React.createElement(ToastComponent, { id })
      },
      {
        dismissible: options.dismissible ?? true,
        duration: options.duration ?? Infinity,
        id: options.toastId,
      },
    )
  }, [ToastComponent, options.toastId, options.duration, options.dismissible])
}
