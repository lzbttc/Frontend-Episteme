function ChevronDownFilledIcon({ size = 10, className = '', ...rest }) {
  return (
    <svg
      width={size}
      height={Math.round((size * 7) / 10)}
      viewBox="0 0 10 7"
      fill="none"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <path
        d="M5 6.16667L0 1.16667L1.16667 0L5 3.83333L8.83333 0L10 1.16667L5 6.16667V6.16667"
        fill="currentColor"
      />
    </svg>
  )
}

export default ChevronDownFilledIcon
