import { useToast } from "~/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "~/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="w-full max-w-md">
            <div className="grid gap-1">
              {title && <ToastTitle className="text-lg font-semibold">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-base">{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport className="p-6 md:max-w-[420px]" />
    </ToastProvider>
  )
}
