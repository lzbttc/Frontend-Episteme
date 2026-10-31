function SwapArrowsIcon({ size = 17, className = '', ...rest }) {
  return (
    <svg
      width={size}
      height={Math.round((size * 14) / 17)}
      viewBox="0 0 17 14"
      fill="none"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <path
        d="M4.167 13.333 L0 9.167 L4.167 5 L5.333 6.188 L3.188 8.333 L9.167 8.333 L9.167 10 L3.188 10 L5.333 12.146 L4.167 13.333 M12.5 8.333 L11.333 7.146 L13.479 5 L7.5 5 L7.5 3.333 L13.479 3.333 L11.333 1.188 L12.5 0 L16.667 4.167 L12.5 8.333"
        fill="currentColor"
      />
    </svg>
  )
}

export default SwapArrowsIcon
