import { cn } from "@/lib/utils"

// src/components/ui/select.tsx
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string
  }
  
  export function Select({ className, label, ...props }: SelectProps) {
    return (
      <div className="relative">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <select
          className={cn(
            "block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm",
            className
          )}
          {...props}
        />
      </div>
    )
  }