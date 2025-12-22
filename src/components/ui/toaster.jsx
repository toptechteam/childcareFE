import { useToast } from "@/components/ui/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ 
        id, 
        title, 
        description, 
        action, 
        onOpenChange, 
        ...props 
      }) => (
        <Toast
          key={id}
          open={props.open}
          onOpenChange={onOpenChange}
          {...props}
        >
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && (
              <ToastDescription>{description}</ToastDescription>
            )}
          </div>
          {action}
          <ToastClose onClick={() => onOpenChange?.(false)} className="absolute right-2 top-2" />
        </Toast>
      ))}
      <ToastViewport className="fixed top-0 right-0 flex flex-col p-4 gap-2 w-full max-w-sm m-0 list-none z-[2147483647] outline-none" />
    </ToastProvider>
  );
}