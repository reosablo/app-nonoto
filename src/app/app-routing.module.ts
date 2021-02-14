import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'explore',
    pathMatch: 'full',
  },
  {
    path: 'explore',
    loadChildren: () =>
      import('./pages/explore/explore.module').then((m) => m.ExplorePageModule),
  },
  {
    path: 'puzzle',
    loadChildren: () =>
      import('./pages/puzzle/puzzle.module').then((m) => m.PuzzlePageModule),
  },
  {
    path: 'play',
    loadChildren: () =>
      import('./pages/play/play.module').then((m) => m.PlayPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
