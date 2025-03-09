import * as React from "react"
import { cn } from "@/utils/cn"

interface DropdownMenuContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  toggle: () => void
}

const DropdownMenuContext = React.createContext<DropdownMenuContextType | undefined>(undefined)

function useDropdownMenuContext() {
  const context = React.useContext(DropdownMenuContext)
  if (!context) {
    throw new Error("DropdownMenu components must be used within a DropdownMenu")
  }
  return context
}

interface DropdownMenuProps {
  children: React.ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function DropdownMenu({
  children,
  defaultOpen = false,
  open,
  onOpenChange,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)
  
  const controlled = open !== undefined
  const _isOpen = controlled ? open : isOpen
  
  const handleOpenChange = React.useCallback((open: boolean) => {
    if (!controlled) {
      setIsOpen(open)
    }
    onOpenChange?.(open)
  }, [controlled, onOpenChange])
  
  const toggle = React.useCallback(() => {
    handleOpenChange(!_isOpen)
  }, [_isOpen, handleOpenChange])
  
  // Close dropdown on escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && _isOpen) {
        handleOpenChange(false)
      }
    }
    
    if (_isOpen) {
      document.addEventListener("keydown", handleEscape)
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [_isOpen, handleOpenChange])
  
  // Close dropdown on outside click
  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node
      const dropdown = document.querySelector("[data-dropdown-menu]")
      
      if (dropdown && !dropdown.contains(target)) {
        handleOpenChange(false)
      }
    }
    
    if (_isOpen) {
      // Delay to prevent immediate closing
      setTimeout(() => {
        document.addEventListener("mousedown", handleOutsideClick)
      }, 0)
    }
    
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [_isOpen, handleOpenChange])
  
  return (
    <DropdownMenuContext.Provider
      value={{
        isOpen: _isOpen,
        setIsOpen: handleOpenChange,
        toggle,
      }}
    >
      <div className="relative" data-dropdown-menu>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

const DropdownMenuTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & DropdownMenuTriggerProps
>(({ children, asChild = false, ...props }, ref) => {
  const { toggle } = useDropdownMenuContext()
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e: React.MouseEvent) => {
        e.preventDefault()
        toggle()
        children.props.onClick?.(e)
      },
      "aria-expanded": useDropdownMenuContext().isOpen,
      ref,
    })
  }
  
  return (
    <div
      ref={ref}
      onClick={(e) => {
        e.preventDefault()
        toggle()
        props.onClick?.(e)
      }}
      aria-expanded={useDropdownMenuContext().isOpen}
      {...props}
    >
      {children}
    </div>
  )
})
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end"
  sideOffset?: number
  forceMount?: boolean
}

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(({ className, align = "center", sideOffset = 4, forceMount, ...props }, ref) => {
  const { isOpen } = useDropdownMenuContext()
  
  if (!isOpen && !forceMount) {
    return null
  }
  
  const alignmentClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        alignmentClasses[align],
        `mt-${sideOffset}`,
        className
      )}
      data-state={isOpen ? "open" : "closed"}
      {...props}
    />
  )
})
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:bg-accent focus:text-accent-foreground",
        className
      )}
      {...props}
    />
  )
})
DropdownMenuItem.displayName = "DropdownMenuItem"

const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("-mx-1 my-1 h-px bg-muted", className)}
      {...props}
    />
  )
})
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
}
