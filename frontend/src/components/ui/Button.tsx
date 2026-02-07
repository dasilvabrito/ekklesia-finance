import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils'; // Assuming you will create a utils file for clsx/tailwind-merge
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, children, isLoading, variant = 'primary', disabled, ...props }, ref) => {
        const variants = {
            primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
            secondary: 'bg-slate-800 text-white hover:bg-slate-900',
            outline: 'border border-slate-200 bg-white hover:bg-slate-100 text-slate-900',
            ghost: 'hover:bg-slate-100 text-slate-900',
        };

        return (
            <button
                ref={ref}
                disabled={isLoading || disabled}
                className={cn(
                    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2',
                    variants[variant],
                    className
                )}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = 'Button';

export { Button };
