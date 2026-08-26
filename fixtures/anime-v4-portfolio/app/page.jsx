import { ExperienceSystem } from "@/components/ExperienceSystem";
import { IntroFade } from "@/components/IntroFade";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl space-y-20 px-6 py-16">
      <IntroFade>
        <header className="max-w-3xl space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Portfolio</p>
          <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">Jordan Lee</h1>
          <p className="text-lg leading-8 text-[var(--muted)]">
            Software engineer working across systems, interfaces, and computational design.
          </p>
        </header>
      </IntroFade>
      <ExperienceSystem />
    </main>
  );
}
