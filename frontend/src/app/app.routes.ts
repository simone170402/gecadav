import { Routes } from '@angular/router';
import { Dashboard } from './admin/dashboard/dashboard';
import { Clients } from './admin/clients/clients';
import { Affaires } from './admin/affaires/affaires';
import { Procurations } from './admin/procurations/procurations';
import { Rendezvous } from './admin/rendezvous/rendezvous';
import { Facturation } from './admin/facturation/facturation';
import { Home } from './pages/home/home';
import { Avocats } from './pages/avocats/avocats';
import { Contact } from './pages/contact/contact';
import { Cabinet } from './pages/cabinet/cabinet';
import { Domaines } from './pages/domaines/domaines';
import { Layout } from './admin/layout/layout';
import { Apropos } from './pages/apropos/apropos';
import { Vision } from './pages/vision/vision';
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


export const routes: Routes = [
  // 🌐 Partie publique

  { path: '', component: Home },
  { path: 'apropos', component: Apropos },
  { path: 'cabinet', component: Cabinet },
  { path: 'avocats', component: Avocats },
  { path: 'domaines', component: Domaines },
  { path: 'contact', component: Contact },
  { path: 'vision', component: Vision },
  // 🌐 Domaines - Pages individuelles
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


  //  Partie admin
  {
    path: 'admin',
    component: Layout, //  Layout avec la sidebar
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'clients', component: Clients },
      { path: 'affaires', component: Affaires },
      { path: 'facturation', component: Facturation },
      { path: 'procurations', component: Procurations },
      { path: 'rendezvous', component: Rendezvous },
    ],
  },
];
