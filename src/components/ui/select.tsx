import * as React from "react"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export function Select({ className = "", ...props }: SelectProps) {
  return (
    <select
      className={`flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-white ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}
