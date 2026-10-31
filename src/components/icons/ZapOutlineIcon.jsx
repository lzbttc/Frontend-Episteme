function ZapOutlineIcon({ size = 17, className = '', ...rest }) {
  return (
    <svg
      width={Math.round((size * 14) / 17)}
      height={size}
      viewBox="0 0 14 17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <path d="M5.458 13.5 L9.771 7.25 L6.229 7.25 L6.875 1.5 L2.563 7.75 L6.104 7.75 L5.458 13.5 Z" />
    </svg>
  )
}

export default ZapOutlineIcon
