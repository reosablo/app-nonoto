import { Component, OnInit, ViewChild } from '@angular/core';
import { IonRefresher } from '@ionic/angular';
import { RefresherEventDetail } from '@ionic/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, Subject } from 'rxjs';
import { filter, first, switchMap } from 'rxjs/operators';
import { Puzzle } from 'src/app/state/puzzles/puzzle.model';
import { PuzzlesQuery } from 'src/app/state/puzzles/puzzles.query';
import { PuzzlesService } from 'src/app/state/puzzles/puzzles.service';

@UntilDestroy()
@Component({
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit {
  readonly loading$: Observable<boolean>;
  readonly puzzles$: Observable<Puzzle[]>;
  readonly refreshRequest$ = new Subject<void>();
  @ViewChild('refresher', { static: true })
  private readonly refresher!: IonRefresher;

  constructor(
    private readonly puzzlesService: PuzzlesService,
    private readonly puzzlesQuery: PuzzlesQuery
  ) {
    this.loading$ = this.puzzlesQuery.selectLoading();
    this.puzzles$ = this.puzzlesQuery.selectAll();
  }

  ngOnInit() {
    this.refreshRequest$
      .pipe(
        untilDestroyed(this),
        switchMap(() => this.puzzlesService.getAll())
      )
      .subscribe();
    this.loading$
      .pipe(
        untilDestroyed(this),
        filter((loading) => loading === false)
      )
      .subscribe(() => this.refresher.complete());
    this.refresher.ionRefresh
      .pipe(untilDestroyed(this))
      .subscribe(() => this.refreshRequest$.next());
    this.refreshRequest$.next();
  }

  range(count: number) {
    return [...Array(count)].map((_, i) => i);
  }
}
