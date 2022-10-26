import { Ordering } from '../src/Ordering';
import { ord as Ord, string } from '../src/index';

// Quiz
// Question 1
// Is it possible to define an Ord instance for the game Rock-Paper-Scissor
// where move1 <= move2 if move2 beats move1?

type ROCK = 'ROCK';
type PAPER = 'PAPER';
type SCISSOR = 'SCISSOR';

type ROCKPAPERSCISSOR = ROCK | PAPER | SCISSOR;

const rockPaperScissorOrdering: Record<ROCKPAPERSCISSOR, Record<ROCKPAPERSCISSOR, Ordering>> = {
  PAPER: {
    PAPER: 0,
    ROCK: 1,
    SCISSOR: -1
  },
  ROCK: {
    ROCK: 0,
    SCISSOR: 1,
    PAPER: -1
  },
  SCISSOR: {
    SCISSOR: 0,
    PAPER: 1,
    ROCK: -1
  }
};

export const rockPaperScissorO: Ord.Ord<ROCKPAPERSCISSOR> = {
  equals: string.eq.equals,
  compare: (x, y) => rockPaperScissorOrdering[x][y]
};
