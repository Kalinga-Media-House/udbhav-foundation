import * as React from "react"

import { cn } from "@/utils/cn"

const H1 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h1 ref={ref} className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", className)} {...props} />
  )
)
H1.displayName = "H1"

const H2 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn("scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0", className)} {...props} />
  )
)
H2.displayName = "H2"

const H3 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("scroll-m-20 text-2xl font-semibold tracking-tight", className)} {...props} />
  )
)
H3.displayName = "H3"

const P = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("leading-7 [&:not(:first-child)]:mt-6", className)} {...props} />
  )
)
P.displayName = "P"

const Muted = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
)
Muted.displayName = "Muted"

export { H1, H2, H3, P, Muted }
