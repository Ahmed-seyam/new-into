export default function LogoIcon({
  width = '126',
  height = '21',
}: {
  width?: string;
  height?: string;
}) {
  return (
    <svg
      width={width}
      viewBox="0 0 126 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_b_17_104)">
        <path
          d="M0 21L0.401557 18.8764H29.7218L29.3202 21H0ZM2.3501 2.1236L2.75165 0H32.0719L31.6703 2.1236H2.3501ZM9.21606 21L11.8821 0H22.9677L20.3017 21H9.21606Z"
          fill="#25824F"
        />
        <path
          d="M28.9253 21L31.2293 0H40.7942L38.4902 21H28.9253ZM53.7856 21L33.4576 0H40.814L61.142 21H53.7856ZM53.8086 21L56.1126 0H65.6809L63.3769 21H53.8086Z"
          fill="#25824F"
        />
        <path
          d="M65.3945 2.1236L65.6183 0H95.7351L95.5113 2.1236H65.3945ZM73.7581 21L76.0621 0H85.6304L83.3263 21H73.7581Z"
          fill="#25824F"
        />
        <path
          d="M93.0361 21L95.5771 0H106.146L103.605 21H93.0361ZM94.2737 21L94.4942 18.8764H123.212L122.995 21H94.2737ZM96.3144 2.1236L96.5317 0H125.447L125.23 2.1236H96.3144ZM112.897 21L115.431 0H126L123.459 21H112.897Z"
          fill="#25824F"
        />
      </g>
      <defs>
        <filter
          id="filter0_b_17_104"
          x="-20"
          y="-20"
          width="166"
          height="61"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="10" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_17_104"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_backgroundBlur_17_104"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
