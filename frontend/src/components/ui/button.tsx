import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:ring-slate-950 focus-visible:ring-offset-2",
    {
        variants: {
            variant: {
                navbar: "bg-blue-500 text-white text-wrap h-16 w-16 rounded-xl mx-4 mb-4 mt-2",
                start: "w-full bg-blue-500 text-white h-20 text-xl rounded-xl",
            },
            defaultVariants: {
                variant: "navbar",
            }
        }
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, asChild = false, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };