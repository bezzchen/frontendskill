export default function Home() {
  return (
    <main className="mx-auto max-w-3xl space-y-16 px-6 py-24">
      <section className="space-y-4">
        <h1 className="text-4xl font-semibold">Meridian</h1>
        <p className="text-lg text-[var(--muted)]">
          A timeline-based motion editor for the web. Design animation visually, ship production code.
        </p>
        <a
          className="inline-block rounded-md bg-[var(--foreground)] px-4 py-2 text-[var(--background)]"
          href="#get-access"
        >
          Get early access
        </a>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">What it does</h2>
        <ul className="space-y-4 text-[var(--muted)]">
          <li>Visual timeline editing for springs, keyframes, and gesture-driven motion.</li>
          <li>One-click export to production JavaScript and CSS with no runtime lock-in.</li>
          <li>Live preview across breakpoints, with reduced-motion variants built in.</li>
        </ul>
      </section>

      <footer className="border-t border-[var(--line)] pt-8 text-sm text-[var(--muted)]" id="get-access">
        <p>Meridian is in private beta. hello@meridian.tools</p>
      </footer>
    </main>
  );
}
