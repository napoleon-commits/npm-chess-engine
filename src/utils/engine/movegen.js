/* eslint no-bitwise: ["error", { "allow": ["|","<<"] }] */

import { GameBoard } from './board';

// eslint-disable-next-line
export function MOVE(from, to, captured, promoted, flag) {
  return (from | (to << 7) | (captured << 14) | (promoted << 20) | flag);
}


/*
  GameBoard.moveListStart[] -> 'index' for the first move at a given ply
  GameBoard.moveList[index]

  say ply 1 loop all moves
  for(index = GameBoard.moveListStart[1]; index < GameBoard.moveListStart[2]; ++index)
    move = moveList[index];

    .. use move


  GameBoard.moveListStart[2] = GameBoard.moveListStart[1];

  AddMOve(Move) {
  GameBoard.moveList[GameBoard.moveListStart[2]] = Move;
  GameBoard.moveListStart[2]++;
  }
*/


export function GenerateMoves() {
  GameBoard.moveListStart[GameBoard.ply + 1] = GameBoard.moveListStart[GameBoard.ply];
}
