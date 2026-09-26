import Image from "next/image";

export interface LogoAsset {
  src: string;
  /** Marks drawn on a transparent or white background sit on a white tile with padding; square brand tiles fill edge to edge. */
  onWhite?: boolean;
}

interface LogoProps {
  name: string;
  logo?: LogoAsset;
  /** Tile edge length in pixels. */
  size?: number;
  className?: string;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w) && !/^(of|the|and)$/i.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/** A rounded tile showing an organization's logo, or its initials when no logo is set. */
export default function Logo({ name, logo, size = 44, className = "" }: LogoProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl border ${
        logo?.onWhite ? "border-transparent bg-white" : "border-white/8 bg-white/4"
      } ${className}`}
      style={{ width: size, height: size }}
    >
      {logo ? (
        <Image
          src={logo.src}
          alt={`${name} logo`}
          width={size * 2}
          height={size * 2}
          className={`size-full ${logo.onWhite ? "object-contain p-[16%]" : "object-cover"}`}
        />
      ) : (
        <span className="font-medium text-dust" style={{ fontSize: size * 0.32 }} aria-label={name}>
          {initials(name)}
        </span>
      )}
    </span>
  );
}
