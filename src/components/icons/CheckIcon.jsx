function CheckIcon({ size = 10, className = '', ...rest }) {
  return (
    <svg
      width={size}
      height={Math.round((size * 8) / 10)}
      viewBox="0 0 10 8"
      fill="none"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <path
        d="M3.325 7.01458L0 3.68958L0.83125 2.85833L3.325 5.35208L8.67708 0L9.50833 0.83125L3.325 7.01458Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default CheckIcon
