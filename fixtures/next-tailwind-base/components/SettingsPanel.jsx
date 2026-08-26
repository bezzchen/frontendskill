"use client";

import { useState } from "react";

export function SettingsPanel() {
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  return (
    <form
      className="space-y-8"
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(true);
      }}
    >
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Profile</h2>
        <label className="grid gap-2">
          <span>Name</span>
          <input
            className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-2"
            defaultValue="Jordan Lee"
            name="name"
          />
        </label>
        <label className="grid gap-2">
          <span>Email</span>
          <input
            className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-2"
            defaultValue="jordan@example.com"
            name="email"
            type="email"
          />
        </label>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <label className="flex items-center justify-between gap-4 rounded-lg border border-[var(--line)] p-4">
          <span>Email notifications</span>
          <input
            checked={notifications}
            onChange={(event) => setNotifications(event.target.checked)}
            type="checkbox"
          />
        </label>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Password</h2>
        <input
          className="w-full rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-2"
          placeholder="New password"
          type="password"
        />
      </section>

      <div className="flex items-center gap-3">
        <button className="rounded-md bg-[var(--foreground)] px-4 py-2 text-[var(--background)]" type="submit">
          Save changes
        </button>
        <span aria-live="polite" className="text-sm text-[var(--muted)]">
          {saved ? "Saved" : ""}
        </span>
      </div>
    </form>
  );
}
