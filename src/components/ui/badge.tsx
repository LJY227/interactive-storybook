import * as React from "react"
import { cn } from "../../lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variantClasses = {
    default: "bg-zinc-900 text-zinc-50 hover:bg-zinc-900/80",
    secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80",
    destructive: "bg-red-500 text-zinc-50 hover:bg-red-500/80",
    outline: "border border-zinc-200 text-zinc-950"
  }
  
  return (
    <div 
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variantClasses[variant],
        className
      )} 
      {...props} 
    />
  )
}

export { Badge }
