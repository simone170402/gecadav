import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Avocats as Avocats2 } from './pages/avocats/avocats';
import { Contact } from './pages/contact/contact';
import { Cabinet } from './pages/cabinet/cabinet';
import { Domaines } from './pages/domaines/domaines';
import { Apropos } from './pages/apropos/apropos';
import { Vision } from './pages/vision/vision';
import { AvocatBafoussam } from './pages/avocat-bafoussam/avocat-bafoussam';
import { Blog } from './pages/blog/blog';
import { BlogDetail } from './pages/blog-detail/blog-detail';
import { Revue } from './pages/revue/revue';
import { RevueDetail } from './pages/revue-detail/revue-detail';

import { Litigation } from './pages/domaines/litigation/litigation';
import { MergersAcquisitions } from './pages/domaines/mergers-acquisitions/mergers-acquisitions';
import { EmploymentCompensation } from './pages/domaines/employment-compensation/employment-compensation';
import { Tax } from './pages/domaines/tax/tax';
import { IntellectualProperty } from './pages/domaines/intellectual-property/intellectual-property';
import { CommercialLaw } from './pages/domaines/commercial-law/commercial-law';
import { Corporate } from './pages/domaines/corporate/corporate';
import { CorporateFinance } from './pages/domaines/corporate-finance/corporate-finance';
import { InsolvencyBankruptcy } from './pages/domaines/insolvency-bankruptcy/insolvency-bankruptcy';
import { HumanRights } from './pages/domaines/human-rights/human-rights';
import { AlternativeDisputeResolution } from './pages/domaines/alternative-dispute-resolution/alternative-dispute-resolution';
import { Immigration } from './pages/domaines/immigration/immigration';
import { ImportExport } from './pages/domaines/import-export/import-export';

import { Avocat1 } from './pages/avocats/avocat1/avocat1';
import { Avocat2 } from './pages/avocats/avocat2/avocat2';
import { Avocat3 } from './pages/avocats/avocat3/avocat3';
import { Avocat4 } from './pages/avocats/avocat4/avocat4';
import { Avocat5 } from './pages/avocats/avocat5/avocat5';

import { authGuard } from './core/auth.guard';
import { Layout } from './admin/layout/layout';
import { Login } from './admin/login/login';
import { roleGuard } from './services/role.guard';

export const routes: Routes = [
  // 🌐 Partie publique
  { path: '', component: Home },
  { path: 'apropos', component: Apropos },
  { path: 'cabinet', component: Cabinet },
  { path: 'avocats', component: Avocats2 },
  { path: 'domaines', component: Domaines },
  { path: 'contact', component: Contact },
  { path: 'vision', component: Vision },
  { path: 'avocat-bafoussam', component: AvocatBafoussam },
  { path: 'blog', component: Blog },
  { path: 'blog/:slug', component: BlogDetail },

  { path: 'revue', component: Revue },
  { path: 'revue/:slug', component: RevueDetail },

  // 🌐 Domaines
  { path: 'domaines/litigation', component: Litigation },
  { path: 'domaines/mergers-acquisitions', component: MergersAcquisitions },
  { path: 'domaines/employment-compensation', component: EmploymentCompensation },
  { path: 'domaines/tax', component: Tax },
  { path: 'domaines/intellectual-property', component: IntellectualProperty },
  { path: 'domaines/commercial-law', component: CommercialLaw },
  { path: 'domaines/corporate', component: Corporate },
  { path: 'domaines/corporate-finance', component: CorporateFinance },
  { path: 'domaines/insolvency-bankruptcy', component: InsolvencyBankruptcy },
  { path: 'domaines/human-rights', component: HumanRights },
  { path: 'domaines/alternative-dispute-resolution', component: AlternativeDisputeResolution },
  { path: 'domaines/immigration', component: Immigration },
  { path: 'domaines/import-export', component: ImportExport },

  // 🌐 Avocats
  { path: 'avocats/avocat1', component: Avocat1 },
  { path: 'avocats/avocat2', component: Avocat2 },
  { path: 'avocats/avocat3', component: Avocat3 },
  { path: 'avocats/avocat4', component: Avocat4 },
  { path: 'avocats/avocat5', component: Avocat5 },

  // 🔐 Login admin
  { path: 'admin/login', component: Login },

  // 🔐 Admin protégé
  {
    path: 'admin',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./admin/dashboard/dashboard').then(m => m.Dashboard)
      },

      {
        path: 'clients',
        loadComponent: () => import('./admin/clients/clients').then(m => m.Clients),
        canActivate: [roleGuard(['ADMIN', 'AVOCAT', 'SECRETAIRE'])]
      },

      {
        path: 'affaires',
        loadComponent: () => import('./admin/affaires/affaires').then(m => m.Affaires),
        canActivate: [roleGuard(['ADMIN', 'AVOCAT'])]
      },

      {
        path: 'facturation',
        loadComponent: () => import('./admin/facturation/facturation').then(m => m.Facturation),
        canActivate: [roleGuard(['ADMIN', 'COMPTABLE', 'AVOCAT'])]
      },

      {
        path: 'procurations',
        loadComponent: () => import('./admin/procurations/procurations').then(m => m.Procurations),
        canActivate: [roleGuard(['ADMIN', 'AVOCAT'])]
      },

      {
        path: 'taches',
        loadComponent: () => import('./admin/taches/taches').then(m => m.Taches),
        canActivate: [roleGuard(['ADMIN', 'AVOCAT', 'SECRETAIRE'])]
      },

      {
        path: 'equipe',
        loadComponent: () => import('./admin/equipe/equipe').then(m => m.Equipe),
        canActivate: [roleGuard(['ADMIN', 'AVOCAT'])]
      },

      {
        path: 'equipe/:id',
        loadComponent: () => import('./admin/equipe/equipe-profil').then(m => m.EquipeProfil),
        canActivate: [roleGuard(['ADMIN', 'AVOCAT'])]
      },

      {
        path: 'statistiques',
        loadComponent: () => import('./admin/statistiques/statistiques').then(m => m.Statistiques),
        canActivate: [roleGuard(['ADMIN', 'AVOCAT', 'COMPTABLE'])]
      },

      {
        path: 'rendezvous',
        loadComponent: () => import('./admin/rendezvous/rendezvous').then(m => m.RendezVousComponent),
        canActivate: [roleGuard(['ADMIN', 'AVOCAT', 'SECRETAIRE'])]
      },

      {
        path: 'publications',
        loadComponent: () =>
          import('./admin/publications/publications').then(m => m.Publications),
        canActivate: [roleGuard(['ADMIN', 'AVOCAT'])]
      },
      {
        path: 'publications/new',
        loadComponent: () =>
          import('./admin/publications/publications-form').then(m => m.PublicationsForm),
        canActivate: [roleGuard(['ADMIN', 'AVOCAT'])]
      },
      {
        path: 'publications/edit/:id',
        loadComponent: () =>
          import('./admin/publications/publications-form').then(m => m.PublicationsForm),
        canActivate: [roleGuard(['ADMIN', 'AVOCAT'])]
      },
      {
        path: 'subscription',
        loadComponent: () =>
          import('./admin/subscription/subscription').then(m => m.Subscription),
        canActivate: [roleGuard(['ADMIN'])]
      },

      {
        path: 'documents',
        loadComponent: () => import('./admin/documents/documents').then(m => m.Documents),
        canActivate: [roleGuard(['ADMIN', 'AVOCAT', 'SECRETAIRE'])]
      },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // fallback
  { path: '**', redirectTo: '' }
];