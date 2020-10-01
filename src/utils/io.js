import { PIECES, PROMOTED, BOOL, GameBoard, NOMOVE, COLOURS, FileChar, RankChar, TOSQ, FilesBrd, RanksBrd, FROMSQ, PieceKnight, PieceRookQueen, PieceBishopQueen } from './def';
import { GenerateMoves } from './movegen';
import { TakeMove, MakeMove } from './makemove';

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
		console.log('Move:' + num + ':' + PrMove(move));
    num += 1;
  }

  // for (
  //   index = GameBoard.moveListStart[GameBoard.ply];
  //   index < GameBoard.moveListStart[GameBoard.ply + 1];
  //   index += 1
  // ) {
  //   move = GameBoard.moveList[index];
  //   // eslint-disable-next-line
  //   console.log(`IMove:${num}:(${index}):${PrMove(move)} Score:${GameBoard.moveScores[index]}`);
  //   num += 1;
  // }
  // eslint-disable-next-line
  console.log('End MoveList');
}

export function ParseMove(from, to) {
  GenerateMoves();

  let Move = NOMOVE;
  let PromPce = PIECES.EMPTY;
  let found = BOOL.FALSE;
  let index;

  for (
    index = GameBoard.moveListStart[GameBoard.ply];
    index < GameBoard.moveListStart[GameBoard.ply + 1];
    index += 1
  ) {
    Move = GameBoard.moveList[index];
    if (FROMSQ(Move) === from && TOSQ(Move) === to) {
      PromPce = PROMOTED(Move);
      if (PromPce !== PIECES.EMPTY) {
        if ((PromPce === PIECES.wQ && GameBoard.side === COLOURS.WHITE) ||
(PromPce === PIECES.bQ && GameBoard.side === COLOURS.BLACK)) {
          found = BOOL.TRUE;
          break;
        }
        // eslint-disable-next-line
        continue;
      }
      found = BOOL.TRUE;
      break;
    }
  }

  if (found !== BOOL.FALSE) {
    if (MakeMove(Move) === BOOL.FALSE) {
      return NOMOVE;
    }
    TakeMove();
    return Move;
  }

  return NOMOVE;
}
