import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type Event = CollectionEntry<'events'>;
export type Performer = CollectionEntry<'performers'>;
export type Sponsor = CollectionEntry<'sponsors'>;

export async function getSettings() {
  const entry = await getEntry('settings', 'site');
  if (!entry) throw new Error('Missing src/content/settings/site.json');
  return entry.data;
}

export async function getPage(id: string) {
  const entry = await getEntry('pages', id);
  if (!entry) throw new Error(`Missing src/content/pages/${id}.md`);
  return entry;
}

export async function getEvents() {
  const all = await getCollection('events');
  const upcoming = all.filter((e) => e.data.status === 'upcoming').sort((a, b) => a.data.year - b.data.year);
  const past = all.filter((e) => e.data.status === 'past').sort((a, b) => b.data.year - a.data.year);
  return { all, current: upcoming[0], upcoming, past, latestPast: past[0] };
}

const byOrder = <T extends { data: { order: number } }>(a: T, b: T) => a.data.order - b.data.order;

export async function getPerformers(eventId?: string) {
  const all = (await getCollection('performers', (p) => !p.data.draft)).sort(byOrder);
  return eventId ? all.filter((p) => p.data.events.includes(eventId)) : all;
}

export async function getSponsors(eventId?: string) {
  const all = (await getCollection('sponsors', (s) => !s.data.draft)).sort(byOrder);
  return eventId ? all.filter((s) => s.data.events.includes(eventId)) : all;
}

export async function getBeneficiaries() {
  return (await getCollection('beneficiaries')).sort(byOrder);
}

/** The event whose lineup/sponsors to feature: the upcoming one if it has any, else the latest past one. */
export async function getFeaturedEvent() {
  const { current, latestPast } = await getEvents();
  if (current && (await getPerformers(current.id)).length) return current;
  return latestPast ?? current;
}

export function formatDate(d?: Date) {
  return d
    ? d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
    : undefined;
}

export function eventWhen(e: Event) {
  return formatDate(e.data.date) ?? e.data.dateText ?? 'Date coming soon';
}

export function youtubeId(url?: string) {
  if (!url) return undefined;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
  return m?.[1];
}
