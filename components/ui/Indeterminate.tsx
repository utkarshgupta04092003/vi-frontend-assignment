import React, { HTMLProps } from "react"

export default function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!)

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate])

  return (
    <div>
      <input
        type="checkbox"
        ref={ref}
        className={className + ' cursor-pointer accent-gray-500 w-3 h-3'}
        {...rest}
      />

    </div>
  )
}
