import * as React from "react"
import { cn } from "@/utils/cn"

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  required?: boolean
  name?: string
  value?: string
  id?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ 
    className, 
    checked, 
    defaultChecked, 
    onCheckedChange,
    disabled, 
    required,
    name,
    value,
    id,
    ...props 
  }, ref) => {
    const [isChecked, setIsChecked] = React.useState(
      checked !== undefined ? checked : defaultChecked || false
    )
    
    // Update internal state when checked prop changes
    React.useEffect(() => {
      if (checked !== undefined) {
        setIsChecked(checked)
      }
    }, [checked])
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = event.target.checked
      
      // Only update internal state if not controlled
      if (checked === undefined) {
        setIsChecked(newChecked)
      }
      
      // Call the callback
      onCheckedChange?.(newChecked)
      
      // Call the original onChange if provided
      props.onChange?.(event)
    }
    
    return (
      <div className="flex items-center space-x-2">
        <div className="relative">
          <input
            type="checkbox"
            ref={ref}
            id={id}
            name={name}
            value={value}
            checked={isChecked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            required={required}
            className="sr-only"
            onChange={handleChange}
            {...props}
          />
          <div
            className={cn(
              "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              isChecked && "bg-primary text-primary-foreground",
              className
            )}
            aria-hidden="true"
          >
            {isChecked && (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="h-4 w-4 text-white"
              >
                <path d="M5 12l5 5l10 -10" />
              </svg>
            )}
          </div>
        </div>
      </div>
    )
  }
)

Checkbox.displayName = "Checkbox"

export { Checkbox }
