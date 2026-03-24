import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#00897B] text-white shadow hover:bg-[#4DB6AC] transition-all duration-300 active:scale-95",
        destructive:
          "bg-[#C62828] text-white shadow-sm hover:bg-[#C62828]/90",
        outline:
          "border border-[#00897B] text-[#00897B] bg-transparent shadow-sm hover:bg-[#00897B]/10 hover:text-[#00897B]",
        secondary:
          "bg-[#4DB6AC]/10 text-[#00897B] shadow-sm hover:bg-[#4DB6AC]/20",
        ghost: "hover:bg-[#00897B]/10 hover:text-[#00897B]",
        link: "text-[#00897B] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        xl: "h-14 rounded-2xl px-10 text-lg",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
