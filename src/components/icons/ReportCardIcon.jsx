function ReportCardIcon({ size = 17, className = '', ...rest }) {
  return (
    <svg
      width={Math.round((size * 14) / 17)}
      height={size}
      viewBox="0 0 14 17"
      fill="none"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <path
        d="M3.333 13.333 L10 13.333 L10 11.667 L3.333 11.667 M3.333 10 L10 10 L10 8.333 L3.333 8.333 M1.667 16.667 C1.208 16.667 0.816 16.503 0.49 16.177 C0.163 15.851 0 15.458 0 15 L0 1.667 C0 1.208 0.163 0.816 0.49 0.49 C0.816 0.163 1.208 0 1.667 0 L8.333 0 L13.333 5 L13.333 15 C13.333 15.458 13.17 15.851 12.844 16.177 C12.517 16.503 12.125 16.667 11.667 16.667 L1.667 16.667 M7.5 5.833 L7.5 1.667 L1.667 1.667 L1.667 15 L11.667 15 L11.667 5.833 L7.5 5.833"
        fill="currentColor"
      />
    </svg>
  )
}

export default ReportCardIcon
