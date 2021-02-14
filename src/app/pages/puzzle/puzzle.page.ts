import { Component, OnInit } from '@angular/core';
import { filterNilValue } from '@datorama/akita';
import { RouterQuery } from '@datorama/akita-ng-router-store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { filter, shareReplay, switchMap } from 'rxjs/operators';
import { Puzzle } from 'src/app/state/puzzles/puzzle.model';
import { PuzzlesQuery } from 'src/app/state/puzzles/puzzles.query';
import { PuzzlesService } from 'src/app/state/puzzles/puzzles.service';

@UntilDestroy()
@Component({
  templateUrl: './puzzle.page.html',
  styleUrls: ['./puzzle.page.scss'],
})
export class PuzzlePage implements OnInit {
  readonly id$: Observable<string>;
  readonly puzzle$: Observable<Puzzle | undefined>;
  readonly loading$: Observable<boolean>;

  constructor(
    private routerQuery: RouterQuery,
    private puzzlesService: PuzzlesService,
    private puzzlesQuery: PuzzlesQuery
  ) {
    this.id$ = this.routerQuery.selectParams('id').pipe(filterNilValue());
    this.puzzle$ = this.id$.pipe(
      switchMap((id) => this.puzzlesQuery.selectEntity(id)),
      shareReplay()
    );
    this.loading$ = this.puzzlesQuery.selectLoading();
  }

  ngOnInit() {
    this.puzzle$
      .pipe(
        untilDestroyed(this),
        filter((puzzle) => !puzzle),
        switchMap(() => this.id$),
        switchMap((id) => this.puzzlesService.get(id))
      )
      .subscribe();
  }
}
