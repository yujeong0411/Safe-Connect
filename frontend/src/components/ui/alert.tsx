import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/utils/cn.ts"

const alertVariants = cva(
    "relative rounded-lg border px-4 py-3 text-base md:text-lg [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
          default: "w-[320px] md:w-[400px] bg-white text-blue-500 border-blue-500/50 [&>svg]:text-blue-500",
          destructive:
              "w-[320px] md:w-[400px] bg-white border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
          warning: "w-[320px] md:w-[400px] bg-yellow-50 border-yellow-200 text-yellow-700 [&>svg]:text-yellow-500",
          info: "w-[320px] md:w-[400px] bg-white border-black/50 text-black [&>svg]:text-black",
          success: "w-[320px] md:w-[400px] bg-green-50 border-green-200 text-green-700 [&>svg]:text-green-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium text-base md:text-lg leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm md:text-base [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
