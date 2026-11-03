export default function LogoBadge({ size = 44 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle cx="50" cy="50" r="47" fill="#57703B" stroke="#B8892E" strokeWidth="3" />
      <circle cx="50" cy="50" r="38" fill="none" stroke="#B8892E" strokeWidth="1.5" />
      <text
        x="50"
        y="60"
        textAnchor="middle"
        fontFamily="Nunito, sans-serif"
        fontSize="30"
        fill="#FBF6E4"
      >
        TJ
      </text>
    </svg>
  );
}
