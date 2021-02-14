import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { PuzzlesState, PuzzlesStore } from './puzzles.store';

@Injectable({ providedIn: 'root' })
export class PuzzlesQuery extends QueryEntity<PuzzlesState> {
  constructor(protected store: PuzzlesStore) {
    super(store);
  }
}
