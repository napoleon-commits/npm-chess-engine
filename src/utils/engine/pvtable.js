import { GameBoard, PVENTRIES, NOMOVE, BOOL } from './defs';
import { TakeMove, MakeMove } from './makemove';
import { MoveExists } from './movegen';

export function ProbePvTable() {
  const index = GameBoard.posKey % PVENTRIES;

  if (GameBoard.PvTable[index].posKey === GameBoard.posKey) {
    return GameBoard.PvTable[index].move;
  }

  return NOMOVE;
}

export function GetPvLine(depth) {
  let move = ProbePvTable();
  let count = 0;

  while (move !== NOMOVE && count < depth) {
    if (MoveExists(move) === BOOL.TRUE) {
      MakeMove(move);
      GameBoard.PvArray[count += 1] = move;
    } else {
      break;
    }
    move = ProbePvTable();
  }

  while (GameBoard.ply > 0) {
    TakeMove();
  }

  return count;
}

export function StorePvMove(move) {
  const index = GameBoard.posKey % PVENTRIES;
  GameBoard.PvTable[index].posKey = GameBoard.posKey;
  GameBoard.PvTable[index].move = move;
}
