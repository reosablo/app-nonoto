import { ServerPuzzle } from './puzzle.model';

const width = 10;
const height = 10;
const goal = btoa(
  `
  --**--**--
  --******--
  -********-
  -********-
  -********-
  --******--
  ---****---
  *--****---
  -******---
  ---****---
`
    .replace(/\s+/g, '')
    .match(/.{1,8}/g)!
    .map((l) => [...l].reduceRight((n, c) => (n << 1) + +(c === '*'), 0))
    .map((n) => String.fromCharCode(n))
    .join('')
);

export const mockPuzzles = [...Array(20)].map(
  (_, i) =>
    ({
      id: `__mock-${i}`,
      title: `Example Puzzle #${i + 1} (mock)`,
      description: `This is an example mock Puzzle #${i + 1}\nEnjoy!`,
      width,
      height,
      goal,
    } as ServerPuzzle)
);
