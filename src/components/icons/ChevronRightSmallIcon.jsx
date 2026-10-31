function ChevronRightSmallIcon({ size = 10, className = '', ...rest }) {
  return (
    <svg
      width={Math.round((size * 6) / 10)}
      height={size}
      viewBox="0 0 6 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <path d="M1 1L5 5L1 9" />
    </svg>
  )
}

export default ChevronRightSmallIcon
