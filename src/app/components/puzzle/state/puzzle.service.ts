import { Injectable } from '@angular/core';
import { Puzzle } from 'src/app/state/puzzles/puzzle.model';
import { PuzzleStore } from './puzzle.store';

@Injectable()
export class PuzzleService {
  constructor(private puzzleStore: PuzzleStore) {}

  set({ width, height, goal }: Puzzle) {
    let cells = goal.map((v) => ({ goal: v }));
    let horizontalClues = [...Array(height)]
      .map((_, i) => goal.slice(i * width, i * width + height))
      .map((l) => PuzzleService.buildClue(l));
    let verticalClues = [...Array(width)]
      .map((_, i) => [...Array(height)].map((_, j) => goal[i + j * width]))
      .map((l) => PuzzleService.buildClue(l));
    this.puzzleStore.update({
      width,
      height,
      cells,
      horizontalClues,
      verticalClues,
    });
  }

  reset() {
    this.puzzleStore.reset();
  }

  reveal(index: number, value: boolean) {
    this.puzzleStore.update(({ cells }) => {
      let cell = cells[index];
      cells[index] = { ...cell, correct: cell.goal === value };
    });
  }

  private static buildClue(line: boolean[]) {
    return line
      .map((cell) => (cell ? '@' : ' '))
      .join('')
      .trim()
      .split(/\s+/)
      .map((s) => s.length);
  }
}
