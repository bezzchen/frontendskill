import { SettingsPanel } from "@/components/SettingsPanel";
import { ProjectGrid } from "@/components/ProjectGrid";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl space-y-24 px-6 py-16">
      <header className="max-w-3xl space-y-4">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Portfolio</p>
        <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">Jordan Lee</h1>
        <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
          Software engineer working across systems, interfaces, and computational design.
        </p>
      </header>

      <ProjectGrid />

      <section className="max-w-2xl space-y-6" aria-labelledby="settings-title">
        <h2 id="settings-title" className="text-3xl font-semibold">Account settings</h2>
        <SettingsPanel />
      </section>
    </main>
  );
}
