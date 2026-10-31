function EyeOffIcon({ size = 18, className = '', ...rest }) {
  return (
    <svg
      width={size}
      height={Math.round((size * 15) / 18)}
      viewBox="0 0 18 15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <path d="M11.2852 7.87546C11.2852 9.25525 10.165 10.3755 8.78522 10.3755C7.40543 10.3755 6.28522 9.25525 6.28522 7.87546C6.28522 6.49567 7.40543 5.37546 8.78522 5.37546C10.165 5.37546 11.2852 6.49567 11.2852 7.87546V7.87546" />
      <path d="M0.833557 7.87546C1.89522 4.49463 5.05439 2.04213 8.78522 2.04213C12.5169 2.04213 15.6752 4.49463 16.7369 7.87546C15.6752 11.2563 12.5169 13.7088 8.78522 13.7088C5.05439 13.7088 1.89522 11.2563 0.833557 7.87546V7.87546" />
      <line
        x1="1.68521"
        y1="13.797"
        x2="14.6488"
        y2="0.833328"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default EyeOffIcon
