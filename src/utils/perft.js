import { GameBoard, BOOL } from './def';
import { MakeMove, TakeMove } from './makemove';
import { PrintBoard } from './board';
import { GenerateMoves } from './movegen';

let perftLeafNodes;

function Perft(depth) {
  if (depth === 0) {
    perftLeafNodes += 1;
    return;
  }

  GenerateMoves();

  let index;
  let move;

  for (
    index = GameBoard.moveListStart[GameBoard.ply];
    index < GameBoard.moveListStart[GameBoard.ply + 1];
    index += 1
  ) {
    move = GameBoard.moveList[index];
    if (MakeMove(move) === BOOL.FALSE) {
      // eslint-disable-next-line
      continue;
    }
    Perft(depth - 1);
    TakeMove();
  }
}

export default function PerftTest(depth) {
  PrintBoard();
  //   eslint-disable-next-line
  console.log(`Starting Test To Depth:${depth}`);
  perftLeafNodes = 0;

  let index;
  let move;
  let moveNum = 0;
  for (
    index = GameBoard.moveListStart[GameBoard.ply];
    index < GameBoard.moveListStart[GameBoard.ply + 1];
    index += 1
  ) {
    move = GameBoard.moveList[index];
    if (MakeMove(move) === BOOL.FALSE) {
      // eslint-disable-next-line
      continue;
    }
    moveNum += 1;
    const cumnodes = perftLeafNodes;
    Perft(depth - 1);
    TakeMove();
    const oldnodes = perftLeafNodes - cumnodes;
    // eslint-disable-next-line
    console.log(`move:${moveNum} ${PrMove(move)} ${oldnodes}`);
  }

  // eslint-disable-next-line
  console.log(`Test Complete : ${perftLeafNodes} leaf nodes visited`);
}
