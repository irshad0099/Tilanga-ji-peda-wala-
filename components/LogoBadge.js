import Image from "next/image";

// The shop's logo (Telangaji Sudh Desi Ghee Peda), background removed.
// `size` is the height in px; width follows the logo's proportions.
const RATIO = 592 / 686;

export default function LogoBadge({ size = 44, priority = false, className = "" }) {
  return (
    <Image
      src="/images/brand/logo.png"
      alt="Telangaji Sudh Desi Ghee Peda"
      width={Math.round(size * RATIO)}
      height={size}
      priority={priority}
      className={`shrink-0 drop-shadow-[0_3px_6px_rgba(47,74,29,0.25)] ${className}`}
    />
  );
}
