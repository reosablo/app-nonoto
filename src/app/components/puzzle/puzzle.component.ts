import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Puzzle } from 'src/app/state/puzzles/puzzle.model';
import { PuzzleQuery } from './state/puzzle.query';
import { PuzzleService } from './state/puzzle.service';
import { CellState, PuzzleStore } from './state/puzzle.store';

@Component({
  selector: 'app-puzzle',
  templateUrl: './puzzle.component.html',
  styleUrls: ['./puzzle.component.scss'],
  providers: [PuzzleQuery, PuzzleService, PuzzleStore],
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PuzzleComponent {
  @Input() invertClicks: boolean = false;
  @Input() noClues: boolean = false;
  @Output() readonly progress: Observable<number>;
  @Output() readonly completed: Observable<boolean>;
  readonly puzzleWidth$: Observable<number>;
  readonly puzzleHeight$: Observable<number>;
  readonly clueWidth$: Observable<number>;
  readonly clueHeight$: Observable<number>;
  readonly cells$: Observable<CellState[]>;
  readonly horizontalClues$: Observable<number[][]>;
  readonly verticalClues$: Observable<number[][]>;

  constructor(
    private readonly puzzleService: PuzzleService,
    private readonly puzzleQuery: PuzzleQuery
  ) {
    this.progress = this.puzzleQuery.progress$;
    this.completed = this.puzzleQuery.completed$;
    this.puzzleWidth$ = this.puzzleQuery.select('width');
    this.puzzleHeight$ = this.puzzleQuery.select('height');
    this.cells$ = this.puzzleQuery.select('cells');
    this.horizontalClues$ = this.puzzleQuery.select('horizontalClues');
    this.verticalClues$ = this.puzzleQuery.select('verticalClues');
    this.clueWidth$ = this.horizontalClues$.pipe(
      map((clues) => Math.max(...clues.map((clue) => clue.length))),
      shareReplay()
    );
    this.clueHeight$ = this.verticalClues$.pipe(
      map((clues) => Math.max(...clues.map((clue) => clue.length))),
      shareReplay()
    );
  }

  onClick(event: MouseEvent, index: number, value: boolean) {
    event.preventDefault();
    let v = [
      value,
      event.getModifierState('Shift'),
      event.getModifierState('CapsLock'),
    ].reduce((value, v) => value !== v);
    this.puzzleService.reveal(index, v);
  }

  onContextMenu(event: UIEvent) {
    event.preventDefault();
  }

  @Input() set puzzle(puzzle: Puzzle | undefined) {
    if (puzzle) {
      this.puzzleService.set(puzzle);
    } else {
      this.puzzleService.reset();
    }
  }
}
