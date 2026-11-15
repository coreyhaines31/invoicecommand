"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"

// Sonner themed with the Cool Money tokens so toasts match cards and popovers.
// Errors stay up longer than confirmations so there is time to read them.
function Toaster(props: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "font-sans shadow-lg",
          description: "text-muted-foreground",
          icon: "text-primary",
          error: "[&_[data-icon]]:text-destructive",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
