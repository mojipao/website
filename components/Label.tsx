export default function Label({ children }: { children: React.ReactNode }) {
  return <p className="mb-5 font-mono text-xs tracking-[0.18em] text-faint uppercase">{children}</p>;
}
