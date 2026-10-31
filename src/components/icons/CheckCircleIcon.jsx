function CheckCircleIcon({ size = 20, className = '', ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707l-4.5 4.5a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L8.5 10.586l3.793-3.793a1 1 0 011.414 1.414z" />
    </svg>
  )
}

export default CheckCircleIcon
