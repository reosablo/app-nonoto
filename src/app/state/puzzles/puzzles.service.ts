import { Injectable } from '@angular/core';
import { setLoading } from '@datorama/akita';
import { of } from 'rxjs';
import { delay, map, share, tap } from 'rxjs/operators';
import { Puzzle, ServerPuzzle } from './puzzle.model';
import { mockPuzzles } from './puzzles-mock';
import { PuzzlesStore } from './puzzles.store';

const mockDelayTime = 2000;

@Injectable({ providedIn: 'root' })
export class PuzzlesService {
  constructor(private puzzlesStore: PuzzlesStore) {}

  get(id: string) {
    return of(mockPuzzles.find((puzzle) => puzzle.id === id))
      .pipe(delay(mockDelayTime))
      .pipe(
        setLoading(this.puzzlesStore),
        map((rawPuzzle) => PuzzlesService.decode(rawPuzzle!)),
        tap((entity) => this.puzzlesStore.upsertMany([entity])),
        share()
      );
  }

  getAll() {
    return of(mockPuzzles)
      .pipe(delay(mockDelayTime))
      .pipe(
        setLoading(this.puzzlesStore),
        map((rawPuzzles) =>
          rawPuzzles.map((rawPuzzle) => PuzzlesService.decode(rawPuzzle))
        ),
        tap((entities) => this.puzzlesStore.upsertMany(entities)),
        share()
      );
  }

  static encode(puzzle: Puzzle) {
    let data = puzzle.goal
      .map((b) => (b ? '1' : '0'))
      .join('')
      .match(/.{1,8}/g)!
      .map((s) => [...s].reduceRight((n, c) => (n << 1) + +c, 0))
      .map((n) => String.fromCharCode(n))
      .join('');
    let goal = btoa(data);
    return { ...puzzle, goal } as ServerPuzzle;
  }

  static decode(puzzle: ServerPuzzle) {
    let { width, height, goal: encodedGoal } = puzzle;
    let goal = [...atob(encodedGoal)]
      .flatMap((c) =>
        [...Array(8)].map((_, i) => Boolean(c.charCodeAt(0) & (1 << i)))
      )
      .slice(0, width * height);
    return { ...puzzle, goal } as Puzzle;
  }
}
