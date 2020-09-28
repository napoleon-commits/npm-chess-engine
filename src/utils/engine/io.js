import { FileChar, FilesBrd, RankChar, RanksBrd, FROMSQ, TOSQ, PROMOTED, PIECES, PieceKnight, BOOL, PieceBishopQueen, PieceRookQueen } from './defs';
import { GameBoard } from './board';

export function PrSq(sq) {
  return (FileChar[FilesBrd[sq]] + RankChar[RanksBrd[sq]]);
}

export function PrMove(move) {
  let MvStr;

  const ff = FilesBrd[FROMSQ(move)];
  const rf = RanksBrd[FROMSQ(move)];
  const ft = FilesBrd[TOSQ(move)];
  const rt = RanksBrd[TOSQ(move)];

  MvStr = FileChar[ff] + RankChar[rf] + FileChar[ft] + RankChar[rt];

  const promoted = PROMOTED(move);
  // eslint-disable-next-line
  console.log(`promoted = ${promoted}`);
  if (promoted !== PIECES.EMPTY) {
    let pchar = 'q';
    if (PieceKnight[promoted] === BOOL.TRUE) {
      pchar = 'n';
    } else if (
      PieceRookQueen[promoted] === BOOL.TRUE
      && PieceBishopQueen[promoted] === BOOL.FALSE
    ) {
      pchar = 'r';
    } else if (
      PieceRookQueen[promoted] === BOOL.FALSE
      && PieceBishopQueen[promoted] === BOOL.TRUE
    ) {
      pchar = 'b';
    }
    MvStr += pchar;
  }
  return MvStr;
}

export function PrintMoveList() {
  let index;
  let move;
  let num = 1;
  // eslint-disable-next-line
  console.log('MoveList:');

  for (
    index = GameBoard.moveListStart[GameBoard.ply];
    index < GameBoard.moveListStart[GameBoard.ply + 1];
    index += 1
  ) {
    move = GameBoard.moveList[index];
    // eslint-disable-next-line
    console.log(`Move:${num}:${PrMove(move)}`);
    num += 1;
  }
}
