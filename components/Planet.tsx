/**
 * A ringed planet built entirely from CSS gradients and transforms, with one
 * small moon on a slow orbit. No images, no WebGL.
 */
export default function Planet({ className = "" }: { className?: string }) {
  return (
    <div className={`relative aspect-square ${className}`} aria-hidden>
      <div className="animate-float absolute inset-0">
        {/* Atmosphere glow */}
        <div className="absolute inset-[18%] rounded-full bg-nebula-indigo/30 blur-3xl" />

        {/* Back half of the ring */}
        <div className="absolute inset-0 flex items-center justify-center rotate-[-18deg] [perspective:900px]">
          <div
            className="absolute h-[68%] w-[68%] rounded-full [transform:rotateX(74deg)_scale(1.55)]"
            style={{
              background:
                "radial-gradient(closest-side, transparent 78%, rgba(238,240,248,0.3) 80%, rgba(139,156,255,0.5) 88%, rgba(238,240,248,0.18) 96%, transparent 100%)",
              maskImage: "linear-gradient(to bottom, black 0%, black 50%, transparent 50%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 50%, transparent 50%)",
            }}
          />
        </div>

        {/* Planet body */}
        <div
          className="absolute inset-[22%] rounded-full shadow-[inset_-28px_-22px_60px_rgba(0,0,0,0.65),0_0_80px_-20px_rgba(139,156,255,0.5)]"
          style={{
            background:
              "radial-gradient(circle at 32% 28%, #d9c6ff 0%, #a89cff 18%, #6f7cf0 42%, #33408f 70%, #141a3d 100%)",
          }}
        >
          {/* Cloud bands */}
          <div
            className="absolute inset-0 rounded-full opacity-40 mix-blend-soft-light"
            style={{
              background:
                "repeating-linear-gradient(-14deg, transparent 0 14%, rgba(255,255,255,0.5) 16% 19%, transparent 21% 34%, rgba(255,255,255,0.35) 36% 38%, transparent 40%)",
            }}
          />
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.35),transparent_45%)]" />
        </div>

        {/* Front half of the ring */}
        <div className="absolute inset-0 flex items-center justify-center rotate-[-18deg] [perspective:900px]">
          <div
            className="absolute h-[68%] w-[68%] rounded-full [transform:rotateX(74deg)_scale(1.55)]"
            style={{
              background:
                "radial-gradient(closest-side, transparent 78%, rgba(238,240,248,0.45) 80%, rgba(139,156,255,0.7) 88%, rgba(238,240,248,0.25) 96%, transparent 100%)",
              maskImage: "linear-gradient(to bottom, transparent 0%, transparent 50%, black 50%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, transparent 50%, black 50%)",
            }}
          />
        </div>

        {/* Moon orbit */}
        <div className="animate-orbit absolute inset-[6%] rounded-full">
          <div className="absolute top-1/2 -left-1 size-3 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#f5f3ff,#8d92a8_70%,#3b3f55)] shadow-[0_0_12px_rgba(238,240,248,0.5)]" />
        </div>
      </div>
    </div>
  );
}
