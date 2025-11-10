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


export const routes: Routes = [
  // 🌐 Partie publique

  { path: '', component: Home },
  { path: 'apropos', component: Apropos },
  { path: 'cabinet', component: Cabinet },
  { path: 'avocats', component: Avocats },
  { path: 'domaines', component: Domaines },
  { path: 'contact', component: Contact },
  { path: 'vision', component: Vision },

  // 🔒 Partie admin
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
