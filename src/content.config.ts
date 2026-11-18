import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// All content lives in src/content/** and is edited by the host through /admin (Sveltia CMS).
// Uploaded images go to src/assets/uploads and are referenced relatively ("../../assets/uploads/x.jpg").

// CMS editors may save an untouched field as "" or null: treat both as "not set".
const blank = (v: unknown) => (v === '' || v === null ? undefined : v);
const opt = <T extends z.ZodTypeAny>(schema: T) => z.preprocess(blank, schema.optional());
const url = opt(z.string().url());
const text = opt(z.string());

const performers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/performers' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      photo: opt(image()),
      genre: text,
      shortBio: text,
      lineup: text,
      website: url,
      instagram: url,
      facebook: url,
      tiktok: url,
      youtube: url,
      video: url, // a performance video (YouTube) shown on the detail page
      events: z.array(z.string()).default([]),
      order: z.number().default(100),
      draft: z.boolean().default(false),
    }),
});

const sponsors = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/sponsors' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      logo: opt(image()),
      tier: z.enum(['Presenting', 'Gold', 'Community']).default('Community'),
      website: url,
      events: z.array(z.string()).default([]),
      order: z.number().default(100),
      draft: z.boolean().default(false),
    }),
});

const beneficiaries = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/beneficiaries' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      logo: opt(image()),
      blurb: z.string(),
      website: url,
      order: z.number().default(100),
    }),
});

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      year: z.number(),
      status: z.enum(['upcoming', 'past']),
      date: opt(z.coerce.date()),
      dateText: text, // e.g. "Date coming soon" when no date is set
      time: text,
      venue: text,
      address: text,
      ageNote: text,
      auditionsOpen: z.boolean().default(false),
      ticketsOnSale: z.boolean().default(false),
      tixfoxUrl: url,
      ticketTiers: z
        .array(
          z.object({
            name: z.string(),
            price: z.string(),
            note: text,
            includes: z.array(z.string()).default([]),
          }),
        )
        .default([]),
      ticketPolicies: z.array(z.string()).default([]),
      features: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
      cover: opt(image()),
      gallery: z.array(z.object({ image: image(), caption: text })).default([]),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    eyebrow: text,
    intro: text,
  }),
});

const settings = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/settings' }),
  schema: z.object({
    siteName: z.string(),
    tagline: z.string(),
    contactEmail: z.string().email(),
    sponsorPhone: text,
    donateUrl: url,
    instagram: url,
    facebook: url,
    announcement: text,
    productionCredit: text,
  }),
});

export const collections = { performers, sponsors, beneficiaries, events, pages, settings };
