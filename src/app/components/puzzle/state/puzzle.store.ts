import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import produce from 'immer';

export interface CellState {
  goal: boolean;
  mark?: boolean;
  correct?: boolean;
}

export interface PuzzleState {
  width: number;
  height: number;
  cells: CellState[];
  horizontalClues: number[][];
  verticalClues: number[][];
}

export function createInitialState(): PuzzleState {
  return {
    width: 0,
    height: 0,
    cells: [],
    horizontalClues: [],
    verticalClues: [],
  };
}

@Injectable()
@StoreConfig({ name: 'puzzle', resettable: true, producerFn: produce })
export class PuzzleStore extends Store<PuzzleState> {
  constructor() {
    super(createInitialState());
  }
}
