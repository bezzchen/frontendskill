import { initialPreferences } from './content.js';

export const preferencesKey = 'round-again:preferences';
export const membersKey = 'round-again:demo-members';

export function readPreferences() {
  try {
    const saved = JSON.parse(localStorage.getItem(preferencesKey));
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return { ...initialPreferences };
    return Object.fromEntries(Object.entries(initialPreferences).map(([key, fallback]) => [
      key,
      typeof saved[key] === typeof fallback && (key !== 'displayName' || saved[key].trim())
        ? saved[key] : fallback,
    ]));
  } catch {
    return { ...initialPreferences };
  }
}

export function joinDemoList(member) {
  const raw = localStorage.getItem(membersKey);
  let members;
  try { members = raw ? JSON.parse(raw) : []; } catch { members = []; }
  if (!Array.isArray(members)) members = [];
  const existing = members.filter(entry => entry && typeof entry.email === 'string' && entry.email.toLowerCase() !== member.email.toLowerCase());
  localStorage.setItem(membersKey, JSON.stringify([...existing, member]));
}
