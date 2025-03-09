import * as React from "react"

type SlotProps = {
  children?: React.ReactNode
} & React.HTMLAttributes<HTMLElement>

// Custom Slot implementation to replace @radix-ui/react-slot
export const Slot = React.forwardRef<HTMLElement, SlotProps>(
  (props, forwardedRef) => {
    const { children, ...slotProps } = props
    
    // If there's no children or the child isn't a valid element, render a fragment
    if (!children || !React.isValidElement(children)) {
      return null
    }

    // Clone the child element and merge the props
    return React.cloneElement(children, {
      ...slotProps,
      ...children.props,
      // Merge refs
      ref: forwardedRef
        ? // @ts-ignore - TypeScript doesn't easily allow merging refs
          (node: HTMLElement) => {
            assignRef(forwardedRef, node)
            if (children.ref) {
              assignRef(children.ref, node)
            }
          }
        : children.ref,
    })
  }
)

Slot.displayName = "Slot"

// Helper function to assign a ref value
function assignRef<T>(ref: React.Ref<T>, value: T) {
  if (typeof ref === "function") {
    ref(value)
  } else if (ref !== null && ref !== undefined && typeof ref === "object" && "current" in ref) {
    ;(ref as React.MutableRefObject<T>).current = value
  }
}
