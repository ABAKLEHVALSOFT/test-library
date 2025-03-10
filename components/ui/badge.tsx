import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm",
  {
    variants: {
      variant: {
        default:
          "border-cyan-600 bg-gradient-to-b from-cyan-500 to-cyan-600 text-white shadow-cyan-900/30",
        secondary:
          "border-purple-600 bg-gradient-to-b from-purple-500 to-purple-600 text-white shadow-purple-900/30",
        destructive:
          "border-red-600 bg-gradient-to-b from-red-500 to-red-600 text-white shadow-red-900/30",
        outline: "text-slate-300 border-slate-700 bg-slate-800/50 shadow-black/20",
        success: "border-green-600 bg-gradient-to-b from-green-500 to-green-600 text-white shadow-green-900/30",
        available: "border-emerald-600 bg-gradient-to-b from-emerald-500 to-emerald-600 text-white shadow-emerald-900/30",
        borrowed: "border-amber-600 bg-gradient-to-b from-amber-500 to-amber-600 text-white shadow-amber-900/30",
        fiction: "border-blue-600 bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-blue-900/30",
        nonfiction: "border-purple-600 bg-gradient-to-b from-purple-500 to-purple-600 text-white shadow-purple-900/30",
        classic: "border-rose-600 bg-gradient-to-b from-rose-500 to-rose-600 text-white shadow-rose-900/30",
        scifi: "border-cyan-600 bg-gradient-to-b from-cyan-500 to-cyan-600 text-white shadow-cyan-900/30",
        fantasy: "border-violet-600 bg-gradient-to-b from-violet-500 to-violet-600 text-white shadow-violet-900/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants } 