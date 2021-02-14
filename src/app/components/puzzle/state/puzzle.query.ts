import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { distinctUntilChanged, map, shareReplay } from 'rxjs/operators';
import { PuzzleState, PuzzleStore } from './puzzle.store';

@Injectable()
export class PuzzleQuery extends Query<PuzzleState> {
  progress$ = this.select('cells').pipe(
    map((cells) => {
      let [a, b] = cells.reduce(
        ([a, b], { goal, correct }) => {
          let revealed = correct !== undefined;
          return [a + +(goal && revealed), b + +goal];
        },
        [0, 0]
      );
      return a / b;
    }),
    shareReplay()
  );
  completed$ = this.progress$.pipe(
    map((progress) => progress >= 1),
    distinctUntilChanged()
  );

  constructor(protected store: PuzzleStore) {
    super(store);
  }
}
