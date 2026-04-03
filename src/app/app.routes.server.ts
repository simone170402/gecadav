import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'contact', renderMode: RenderMode.Prerender },
  { path: 'apropos', renderMode: RenderMode.Prerender },
  { path: 'cabinet', renderMode: RenderMode.Prerender },
  { path: 'vision', renderMode: RenderMode.Prerender },
  { path: 'avocat-bafoussam', renderMode: RenderMode.Prerender },

  { path: 'avocats', renderMode: RenderMode.Prerender },
  { path: 'avocats/avocat1', renderMode: RenderMode.Prerender },
  { path: 'avocats/avocat2', renderMode: RenderMode.Prerender },
  { path: 'avocats/avocat3', renderMode: RenderMode.Prerender },
  { path: 'avocats/avocat4', renderMode: RenderMode.Prerender },
  { path: 'avocats/avocat5', renderMode: RenderMode.Prerender },

  { path: 'domaines', renderMode: RenderMode.Prerender },
  { path: 'domaines/litigation', renderMode: RenderMode.Prerender },
  { path: 'domaines/corporate', renderMode: RenderMode.Prerender },
  { path: 'domaines/commercial-law', renderMode: RenderMode.Prerender },
  { path: 'domaines/corporate-finance', renderMode: RenderMode.Prerender },
  { path: 'domaines/mergers-acquisitions', renderMode: RenderMode.Prerender },
  { path: 'domaines/tax', renderMode: RenderMode.Prerender },
  { path: 'domaines/insolvency-bankruptcy', renderMode: RenderMode.Prerender },
  { path: 'domaines/human-rights', renderMode: RenderMode.Prerender },
  { path: 'domaines/alternative-dispute-resolution', renderMode: RenderMode.Prerender },
  { path: 'domaines/immigration', renderMode: RenderMode.Prerender },
  { path: 'domaines/import-export', renderMode: RenderMode.Prerender },
  { path: 'domaines/intellectual-property', renderMode: RenderMode.Prerender },

  { path: 'admin/login', renderMode: RenderMode.Client },
  { path: 'admin/dashboard', renderMode: RenderMode.Client },
  { path: 'admin/clients', renderMode: RenderMode.Client },
  { path: 'admin/affaires', renderMode: RenderMode.Client },
  { path: 'admin/facturation', renderMode: RenderMode.Client },
  { path: 'admin/procurations', renderMode: RenderMode.Client },
  { path: 'admin/rendezvous', renderMode: RenderMode.Client },
  { path: 'admin/documents', renderMode: RenderMode.Client },

  { path: '**', renderMode: RenderMode.Client }
];