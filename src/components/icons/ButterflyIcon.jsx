function ButterflyIcon({ size = 57, className = '', ...rest }) {
  return (
    <svg
      width={size}
      height={Math.round((size * 63) / 57)}
      viewBox="0 0 57.082 63.122"
      fill="none"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <path
        d="M0.815 9.985 C4.541 -0.182 19.975 -3.059 35.287 3.559 C50.599 10.177 59.992 23.783 56.266 33.949 C54.504 38.76 50.119 41.936 44.367 43.249 C47.847 47.458 49.312 52.22 47.848 56.215 C45.27 63.248 34.592 65.239 23.999 60.66 C13.405 56.082 6.908 46.668 9.485 39.635 C10.139 37.852 11.312 36.394 12.873 35.284 C3.073 28.106 -2.115 17.982 0.815 9.985 Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default ButterflyIcon
