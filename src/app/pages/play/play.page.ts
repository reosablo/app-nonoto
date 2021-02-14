import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
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
  templateUrl: './play.page.html',
  styleUrls: ['./play.page.scss'],
})
export class PlayPage implements OnInit {
  readonly id$: Observable<string>;
  readonly puzzle$: Observable<Puzzle | undefined>;
  readonly loading$: Observable<boolean>;

  constructor(
    @Inject(DOCUMENT) document: Document,
    private readonly routerQuery: RouterQuery,
    private readonly puzzlesQuery: PuzzlesQuery,
    private readonly puzzlesService: PuzzlesService
  ) {
    this.id$ = this.routerQuery
      .selectQueryParams<string>('puzzle')
      .pipe(filterNilValue(), shareReplay());
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
