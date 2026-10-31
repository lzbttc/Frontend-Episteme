function ArrowRightIcon({ size = 11, className = '', ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 11 11"
      fill="none"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <path
        d="M8.117 6H0V4.667H8.117L4.383 0.933L5.333 0L10.667 5.333L5.333 10.667L4.383 9.733L8.117 6Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default ArrowRightIcon
