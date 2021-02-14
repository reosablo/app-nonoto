export type Puzzle = {
  id: string;
  title: string;
  description: string;
  width: number;
  height: number;
  goal: boolean[];
};

export type ServerPuzzle = Exclude<Puzzle, 'goal'> & { goal: string };
