
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { useButtonAnimation } from "@/lib/animations"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold transition-all relative border-2 border-black shadow-neo",
  {
    variants: {
      variant: {
        default: "bg-[#F8C537] text-black hover:shadow-neo-hover hover:-translate-y-1 hover:translate-x-1 active:translate-y-0 active:translate-x-0 active:shadow-neo",
        destructive: "bg-red-500 text-white hover:shadow-neo-hover hover:-translate-y-1 hover:translate-x-1 active:translate-y-0 active:translate-x-0 active:shadow-neo",
        outline: "bg-white text-black hover:shadow-neo-hover hover:-translate-y-1 hover:translate-x-1 active:translate-y-0 active:translate-x-0 active:shadow-neo",
        secondary: "bg-[#C5B4F0] text-black hover:shadow-neo-hover hover:-translate-y-1 hover:translate-x-1 active:translate-y-0 active:translate-x-0 active:shadow-neo",
        ghost: "border-transparent shadow-none hover:bg-accent hover:text-accent-foreground",
        link: "border-transparent shadow-none text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
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
  ({ className, variant, size, asChild = false, onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const animateClick = useButtonAnimation();
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      animateClick(e);
      if (onClick) onClick(e);
    };
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
