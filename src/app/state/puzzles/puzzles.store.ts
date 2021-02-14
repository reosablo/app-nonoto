import { Injectable } from '@angular/core';
import {
  ActiveState,
  EntityState,
  EntityStore,
  StoreConfig,
} from '@datorama/akita';
import { Puzzle } from './puzzle.model';

export interface PuzzlesState extends EntityState<Puzzle>, ActiveState {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'puzzles', cache: { ttl: 3600e3 } })
export class PuzzlesStore extends EntityStore<PuzzlesState> {
  constructor() {
    super();
  }
}
