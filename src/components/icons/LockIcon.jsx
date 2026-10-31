function LockIcon({ size = 20, className = '', ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <path d="M18.3335 5.83333C18.3335 3.99362 16.8399 2.5 15.0002 2.5C13.1604 2.5 11.6668 3.99362 11.6668 5.83333V9.16667M5.00016 17.5H15.0002C15.9206 17.5 16.6668 16.7538 16.6668 15.8333V10.8333C16.6668 9.91286 15.9206 9.16667 15.0002 9.16667H5.00016C4.07969 9.16667 3.3335 9.91286 3.3335 10.8333V15.8333C3.3335 16.7538 4.07969 17.5 5.00016 17.5Z" />
    </svg>
  )
}

export default LockIcon
