function ChevronDownIcon({ size = 10, className = '', ...rest }) {
  return (
    <svg
      width={size}
      height={Math.round((size * 6) / 10)}
      viewBox="0 0 10 6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <path d="M1 1L5 5L9 1" />
    </svg>
  )
}

export default ChevronDownIcon
