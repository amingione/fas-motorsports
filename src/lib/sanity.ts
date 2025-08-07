import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = '2023-01-01';

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production', // Use CDN in production, false for ISR
  token: process.env.SANITY_API_TOKEN, // Token for write access
});

export async function sanityFetch<T>(query: string, params: Record<string, any> = {}) {
  return sanityClient.fetch<T>(query, params, { cache: 'force-cache', next: { revalidate: 60 } });
}