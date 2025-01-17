// src/app/dashboard/history/metadata.ts
import { config } from '@/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Integrations | Dashboard | ${config.site.name}`,
};
