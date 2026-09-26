import { links, profile } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="border-t border-white/8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-dust sm:flex-row">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <ul className="flex gap-6">
          {links.map((l) => (
            <li key={l.label}>
              <a href={l.href} className="transition-colors hover:text-star" target="_blank" rel="noreferrer">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
