import { ZONES, type ZoneId } from "@/lib/depth";

export default function ZoneLabel({ zone, className = "" }: { zone: ZoneId; className?: string }) {
  const z = ZONES[zone];
  return (
    <p className={`flex items-center gap-3 text-xs font-medium uppercase tracking-[0.28em] text-cyan-100/70 ${className}`}>
      <span className="h-px w-8 bg-linear-to-r from-transparent to-cyan-200/70" />
      {z.name}
      <span className="text-cyan-100/40">{z.range}</span>
    </p>
  );
}
