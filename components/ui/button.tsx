import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:translate-y-0.5 active:shadow-inner cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-b from-cyan-500 to-cyan-600 text-white shadow-md shadow-cyan-900/30 hover:shadow-lg hover:shadow-cyan-900/40 border border-cyan-400/20",
        destructive:
          "bg-gradient-to-b from-red-500 to-red-600 text-white shadow-md shadow-red-900/30 hover:shadow-lg hover:shadow-red-900/40 border border-red-400/20",
        outline:
          "border border-slate-700 bg-gradient-to-b from-slate-800 to-slate-900 shadow-md shadow-black/30 hover:shadow-lg hover:shadow-black/40 hover:border-slate-600",
        secondary:
          "bg-gradient-to-b from-purple-500 to-purple-600 text-white shadow-md shadow-purple-900/30 hover:shadow-lg hover:shadow-purple-900/40 border border-purple-400/20",
        ghost: "hover:bg-slate-800 hover:text-slate-100",
        link: "text-primary underline-offset-4 hover:underline",
        future: "bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-md shadow-blue-900/30 hover:shadow-lg hover:shadow-blue-900/40 border border-blue-400/20",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants } 