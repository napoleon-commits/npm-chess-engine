/* eslint no-bitwise: ["error", { "allow": ["&","&=","^="] }] */

import { BOOL, GameBoard, Kings, PIECES, HASH_EP, PROMOTED, COLOURS, MFLAGPS, PiecePawn, CAPTURED, HASH_CA, CastlePerm, SQUARES, TOSQ, FROMSQ, HASH_PCE, PieceVal, PieceCol, HASH_SIDE, MFLAGCA, MFLAGEP } from './defs';
import { PCEINDEX, SqAttacked } from './board';

export function ClearPiece(sq) {
  const pce = GameBoard.pieces[sq];
  const col = PieceCol[pce];
  let index;
  let tPceNum = -1;

  HASH_PCE(pce, sq);

  GameBoard.pieces[sq] = PIECES.EMPTY;
  GameBoard.material[col] -= PieceVal[pce];

  for (index = 0; index < GameBoard.pceNum[pce]; index += 1) {
    if (GameBoard.pList[PCEINDEX(pce, index)] === sq) {
      tPceNum = index;
      break;
    }
  }

  GameBoard.pceNum[pce] -= 1;
  GameBoard.pList[PCEINDEX(pce, tPceNum)] = GameBoard.pList[PCEINDEX(pce, GameBoard.pceNum[pce])];
}

export function AddPiece(sq, pce) {
  const col = PieceCol[pce];

  HASH_PCE(pce, sq);

  GameBoard.pieces[sq] = pce;
  GameBoard.material[col] += PieceVal[pce];
  GameBoard.pList[PCEINDEX(pce, GameBoard.pceNum[pce])] = sq;
  GameBoard.pceNum[pce] += 1;
}

export function MovePiece(from, to) {
  let index = 0;
  const pce = GameBoard.pieces[from];

  HASH_PCE(pce, from);
  GameBoard.pieces[from] = PIECES.EMPTY;

  HASH_PCE(pce, to);
  GameBoard.pieces[to] = pce;

  for (index = 0; index < GameBoard.pceNum[pce]; index += 1) {
    if (GameBoard.pList[PCEINDEX(pce, index)] === from) {
      GameBoard.pList[PCEINDEX(pce, index)] = to;
      break;
    }
  }
}

export function MakeMove(move) {
  const from = FROMSQ(move);
  const to = TOSQ(move);
  const side = GameBoard.side;

  GameBoard.history[GameBoard.hisPly].posKey = GameBoard.posKey;

  if ((move & MFLAGEP) !== 0) {
    if (side === COLOURS.WHITE) {
      ClearPiece(to - 10);
    } else {
      ClearPiece(to + 10);
    }
  } else if ((move & MFLAGCA) !== 0) {
    switch (to) {
      case SQUARES.C1:
        MovePiece(SQUARES.A1, SQUARES.D1);
        break;
      case SQUARES.C8:
        MovePiece(SQUARES.A8, SQUARES.D8);
        break;
      case SQUARES.G1:
        MovePiece(SQUARES.H1, SQUARES.F1);
        break;
      case SQUARES.G8:
        MovePiece(SQUARES.H8, SQUARES.F8);
        break;
      default: break;
    }
  }

  if (GameBoard.enPas !== SQUARES.NO_SQ) HASH_EP();
  HASH_CA();

  GameBoard.history[GameBoard.hisPly].move = move;
  GameBoard.history[GameBoard.hisPly].fiftyMove = GameBoard.fiftyMove;
  GameBoard.history[GameBoard.hisPly].enPas = GameBoard.enPas;
  GameBoard.history[GameBoard.hisPly].castlePerm = GameBoard.castlePerm;

  GameBoard.castlePerm &= CastlePerm[from];
  GameBoard.castlePerm &= CastlePerm[to];
  GameBoard.enPas = SQUARES.NO_SQ;

  HASH_CA();

  const captured = CAPTURED(move);
  GameBoard.fiftyMove += 1;

  if (captured !== PIECES.EMPTY) {
    ClearPiece(to);
    GameBoard.fiftyMove = 0;
  }

  GameBoard.hisPly += 1;
  GameBoard.ply += 1;

  if (PiecePawn[GameBoard.pieces[from]] === BOOL.TRUE) {
    GameBoard.fiftyMove = 0;
    if ((move & MFLAGPS) !== 0) {
      if (side === COLOURS.WHITE) {
        GameBoard.enPas = from + 10;
      } else {
        GameBoard.enPas = from - 10;
      }
      HASH_EP();
    }
  }

  MovePiece(from, to);

  const prPce = PROMOTED(move);
  if (prPce !== PIECES.EMPTY) {
    ClearPiece(to);
    AddPiece(to, prPce);
  }

  GameBoard.side ^= 1;
  HASH_SIDE();

  if (SqAttacked(GameBoard.pList[PCEINDEX(Kings[side], 0)], GameBoard.side)) {
    // TakeMove();
    return BOOL.FALSE;
  }

  return BOOL.TRUE;
}
