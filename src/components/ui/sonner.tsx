import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toast]:bg-green-900/40 group-[.toast]:border-green-600/60 group-[.toast]:text-green-200",
          error: "group-[.toast]:bg-red-900/40 group-[.toast]:border-red-600/60 group-[.toast]:text-red-200",
          warning: "group-[.toast]:bg-yellow-900/40 group-[.toast]:border-yellow-600/60 group-[.toast]:text-yellow-200",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
