function LogoutIcon({ size = 16, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M9.333 5.333L12 8M12 8L9.333 10.667M12 8H2.667M6.667 5.333V4.667C6.667 3.563 5.771 2.667 4.667 2.667H2C0.896 2.667 0 3.563 0 4.667V11.333C0 12.437 0.896 13.333 2 13.333H4.667C5.771 13.333 6.667 12.437 6.667 11.333V10.667"
        stroke="currentColor"
        strokeWidth="1.333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default LogoutIcon
