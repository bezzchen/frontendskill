const projects = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  title: `Project ${String(index + 1).padStart(2, "0")}`,
  summary: "Case study notes on the research, design, and engineering behind this project.",
}));

export function ProjectGrid() {
  return (
    <section aria-labelledby="projects-title" className="space-y-6">
      <h2 id="projects-title" className="text-3xl font-semibold">Selected projects</h2>
      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((project) => (
          <a
            href={`#project-${project.id}`}
            key={project.id}
            className="group block rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4"
          >
            <div
              aria-hidden="true"
              className="aspect-[16/10] rounded-lg bg-[linear-gradient(135deg,#d8d8d2,#a7a79f)]"
              data-project-media
            />
            <h3 className="mt-4 text-xl font-semibold">{project.title}</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">{project.summary}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
