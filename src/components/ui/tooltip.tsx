import * as React from "react"
import { cn } from "../../lib/utils"

interface TooltipProps {
  children: React.ReactNode
  content: string
  className?: string
}

export function Tooltip({ children, content, className }: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false)

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={cn(
          "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg whitespace-nowrap z-50",
          className
        )}>
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  )
}
