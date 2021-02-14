import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PuzzlePage } from './puzzle.page';

const routes: Routes = [
  {
    path: ':id',
    component: PuzzlePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PuzzlePageRoutingModule {}
