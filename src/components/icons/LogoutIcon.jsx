function LogoutIcon({ size = 16, className = '', ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <path d="M9.33333 10.6667L12 8M12 8L9.33333 5.33333M12 8H2.66667M6.66667 10.6667V11.3333C6.66667 12.4372 5.77057 13.3333 4.66667 13.3333H2C0.896133 13.3333 0 12.4372 0 11.3333V4.66667C0 3.56277 0.896133 2.66667 2 2.66667H4.66667C5.77057 2.66667 6.66667 3.56277 6.66667 4.66667V5.33333" />
    </svg>
  )
}

export default LogoutIcon
