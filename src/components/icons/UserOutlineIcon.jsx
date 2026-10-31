function UserOutlineIcon({ size = 17, className = '', ...rest }) {
  return (
    <svg
      width={Math.round((size * 14) / 17)}
      height={size}
      viewBox="0 0 14 17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <path d="M10.0002 4.16668C10.0002 6.00639 8.50655 7.50001 6.66683 7.50001C4.82711 7.50001 3.3335 6.00639 3.3335 4.16668C3.3335 2.32696 4.82711 0.833344 6.66683 0.833344C8.50655 0.833344 10.0002 2.32696 10.0002 4.16668V4.16668M6.66683 10C3.44732 10 0.833496 12.6138 0.833496 15.8333H12.5002C12.5002 12.6138 9.88633 10 6.66683 10V10" />
    </svg>
  )
}

export default UserOutlineIcon
