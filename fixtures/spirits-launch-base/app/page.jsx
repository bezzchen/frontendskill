export default function Home() {
  return (
    <main className="mx-auto max-w-3xl space-y-16 px-6 py-24">
      <section className="space-y-4">
        <h1 className="text-4xl font-semibold">Thornmere</h1>
        <p className="text-lg text-[var(--muted)]">
          A small-batch London dry gin, distilled in copper from five botanicals.
        </p>
        <a
          className="inline-block rounded-md bg-[var(--foreground)] px-4 py-2 text-[var(--background)]"
          href="#stockists"
        >
          Find a stockist
        </a>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">The botanicals</h2>
        <ul className="space-y-4 text-[var(--muted)]">
          <li>Juniper — the backbone; pine, resin, and cold air.</li>
          <li>Coriander seed — citrus and pepper, harvested late.</li>
          <li>Angelica root — earth and dryness; it holds the others together.</li>
          <li>Orris root — fixes the aroma so it lasts in the glass.</li>
          <li>Lemon peel — pared by hand, added last.</li>
        </ul>
        <p className="text-[var(--muted)]">
          Plates from Köhler&apos;s Medizinal-Pflanzen (1887) are in{" "}
          <code>/public/botanicals</code>. A studio environment map for image-based lighting is in{" "}
          <code>/public/env</code>. Licences: <code>/public/ASSET_LICENSES.md</code>.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">How it is made</h2>
        <p className="text-[var(--muted)]">
          One 300-litre copper still. A 24-hour maceration, then a slow run — the heads and tails cut
          by taste rather than by clock. Roughly 400 bottles a batch, each one numbered.
        </p>
      </section>

      <section id="stockists" className="space-y-4">
        <h2 className="text-2xl font-semibold">Stockists</h2>
        <p className="text-[var(--muted)]">
          Trade enquiries: <a className="underline" href="mailto:orders@thornmere.example">orders@thornmere.example</a>
        </p>
      </section>
    </main>
  );
}
