"use client";

const items = [
  { id: "exp-1", label: "Company A", type: "experience" },
  { id: "exp-2", label: "Company B", type: "experience" },
  { id: "exp-3", label: "Research Lab", type: "experience" },
  { id: "project-1", label: "Project Atlas", type: "project" },
  { id: "project-2", label: "Project Vector", type: "project" },
  { id: "project-3", label: "Project Field", type: "project" },
];

export function ExperienceSystem() {
  return (
    <section className="space-y-6" aria-labelledby="experience-title">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Experience system</p>
        <h2 id="experience-title" className="text-4xl font-semibold tracking-tight">
          Work and projects
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3" data-experience-system>
        {items.map((item) => (
          <button
            className="min-h-28 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 text-left"
            data-kind={item.type}
            key={item.id}
          >
            <span className="text-sm text-[var(--muted)]">{item.type}</span>
            <strong className="mt-2 block">{item.label}</strong>
          </button>
        ))}
      </div>
    </section>
  );
}
