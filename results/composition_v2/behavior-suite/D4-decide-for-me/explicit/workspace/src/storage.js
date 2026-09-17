export const PREFERENCES_KEY = 'round-again-preferences';
export const MEMBERS_KEY = 'round-again-demo-members';

export function readPreferences(defaults) {
  try {
    const saved = JSON.parse(localStorage.getItem(PREFERENCES_KEY));
    return Object.fromEntries(Object.entries(defaults).map(([key, value]) => [
      key,
      typeof saved?.[key] === typeof value && (key !== 'displayName' || saved[key].trim())
        ? saved[key] : value,
    ]));
  } catch {
    return { ...defaults };
  }
}

export function joinDemoList(member) {
  let members = [];
  try {
    const saved = JSON.parse(localStorage.getItem(MEMBERS_KEY));
    if (Array.isArray(saved)) members = saved.filter(item => item && typeof item.email === 'string');
  } catch { /* Malformed lists start fresh; the form handles write failures. */ }
  const others = members.filter(item => item.email.toLowerCase() !== member.email.toLowerCase());
  localStorage.setItem(MEMBERS_KEY, JSON.stringify([...others, member]));
}
