"use client"

import { Check } from "lucide-react"
import * as React from "react"

import { cn } from "@/utils"

// A simple styled checkbox without radix
const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { onCheckedChange?: (checked: boolean) => void }
>(({ className, checked, onCheckedChange, onChange, ...props }, ref) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e);
    if (onCheckedChange) onCheckedChange(e.target.checked);
  };

  return (
    <div className="relative flex items-center justify-center">
      <input
        type="checkbox"
        ref={ref}
        checked={checked}
        onChange={handleChange}
        className={cn(
          "peer h-4 w-4 shrink-0 rounded-sm border border-zinc-200 border-zinc-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:border-zinc-50 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 appearance-none bg-white dark:bg-zinc-950 checked:bg-zinc-900 checked:text-zinc-50 dark:checked:bg-zinc-50 dark:checked:text-zinc-900",
          className
        )}
        {...props}
      />
      {checked && (
        <Check className="h-3 w-3 text-zinc-50 dark:text-zinc-900 absolute pointer-events-none" />
      )}
    </div>
  )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }
