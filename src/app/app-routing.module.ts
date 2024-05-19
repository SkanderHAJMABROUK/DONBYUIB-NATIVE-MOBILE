import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'modal',
    loadChildren: () => import('./modal/modal.module').then( m => m.ModalPageModule)
  },
  {
    path: 'associations-list',
    loadChildren: () => import('./associations/associations-list/associations-list.module').then( m => m.AssociationsListPageModule)
  },
  {
    path: 'associations-list/:id',
    loadChildren: () => import('./associations/association-details/association-details.module').then( m => m.AssociationDetailsPageModule)
  },
  {
    path: 'home/association/:id',
    loadChildren: () => import('./associations/association-details/association-details.module').then( m => m.AssociationDetailsPageModule)
  },
  {
    path: 'collectes-list',
    loadChildren: () => import('./collectes/collectes-list/collectes-list.module').then( m => m.CollectesListPageModule)
  },
  {
    path: 'collectes-list/:id',
    loadChildren: () => import('./collectes/collecte-details/collecte-details.module').then( m => m.CollecteDetailsPageModule)
  },
  {
    path: 'actualites-list',
    loadChildren: () => import('./actualites/actualites-list/actualites-list.module').then( m => m.ActualitesListPageModule)
  },
  {
    path: 'recherche',
    loadChildren: () => import('./recherche/recherche/recherche.module').then( m => m.RecherchePageModule)
  },
  {
    path: 'recherche/collecte/:id',
    loadChildren: () => import('./collectes/collecte-details/collecte-details.module').then( m => m.CollecteDetailsPageModule)
  },
  {
    path: 'recherche/association/:id',
    loadChildren: () => import('./associations/association-details/association-details.module').then( m => m.AssociationDetailsPageModule)
  },
  {
    path: 'home/collecte/:id',
    loadChildren: () => import('./collectes/collecte-details/collecte-details.module').then( m => m.CollecteDetailsPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
