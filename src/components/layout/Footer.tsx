import { site } from "@/lib/data";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="flex flex-col items-center justify-between gap-4 border-t border-[rgba(200,125,232,0.1)] bg-bg px-6 py-8 text-center text-[0.55rem] tracking-[0.12em] text-muted uppercase md:flex-row md:px-12 md:text-left">
      <div className="font-display text-gradient-chrome text-[1.1rem] normal-case">
        {site.name}
      </div>
      <div>© {year} — All rights reserved</div>
      <div>{site.location}</div>
    </footer>
  );
}
