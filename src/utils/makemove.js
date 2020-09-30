/* eslint no-bitwise: ["error", { "allow": ["&=","&","^="] }] */

import { PIECES, SQUARES, PROMOTED, COLOURS, MFLAGCA, GameBoard, MFLAGEP, TOSQ, FROMSQ, BOOL, PieceCol, HASH_CA, HASH_EP, PCEINDEX, Kings, MFLAGPS, PiecePawn, HASH_SIDE, CAPTURED, HASH_PCE, PieceVal, CastlePerm } from './def';
import { SqAttacked } from './board';

function ClearPiece(sq) {
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

function AddPiece(sq, pce) {
  const col = PieceCol[pce];

  HASH_PCE(pce, sq);

  GameBoard.pieces[sq] = pce;
  GameBoard.material[col] += PieceVal[pce];
  GameBoard.pList[PCEINDEX(pce, GameBoard.pceNum[pce])] = sq;
  GameBoard.pceNum[pce] += 1;
}

function MovePiece(from, to) {
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

export function TakeMove() {
  GameBoard.hisPly -= 1;
  GameBoard.ply -= 1;

  const move = GameBoard.history[GameBoard.hisPly].move;
  const from = FROMSQ(move);
  const to = TOSQ(move);

  if (GameBoard.enPas !== SQUARES.NO_SQ) HASH_EP();
  HASH_CA();

  GameBoard.castlePerm = GameBoard.history[GameBoard.hisPly].castlePerm;
  GameBoard.fiftyMove = GameBoard.history[GameBoard.hisPly].fiftyMove;
  GameBoard.enPas = GameBoard.history[GameBoard.hisPly].enPas;

  if (GameBoard.enPas !== SQUARES.NO_SQ) HASH_EP();
  HASH_CA();

  GameBoard.side ^= 1;
  HASH_SIDE();

  if ((MFLAGEP & move) !== 0) {
    if (GameBoard.side === COLOURS.WHITE) {
      AddPiece(to - 10, PIECES.bP);
    } else {
      AddPiece(to + 10, PIECES.wP);
    }
  } else if ((MFLAGCA & move) !== 0) {
    switch (to) {
      case SQUARES.C1: MovePiece(SQUARES.D1, SQUARES.A1); break;
      case SQUARES.C8: MovePiece(SQUARES.D8, SQUARES.A8); break;
      case SQUARES.G1: MovePiece(SQUARES.F1, SQUARES.H1); break;
      case SQUARES.G8: MovePiece(SQUARES.F8, SQUARES.H8); break;
      default: break;
    }
  }

  MovePiece(to, from);

  const captured = CAPTURED(move);
  if (captured !== PIECES.EMPTY) {
    AddPiece(to, captured);
  }

  if (PROMOTED(move) !== PIECES.EMPTY) {
    ClearPiece(from);
    AddPiece(from, (PieceCol[PROMOTED(move)] === COLOURS.WHITE ? PIECES.wP : PIECES.bP));
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
    TakeMove();
    return BOOL.FALSE;
  }

  return BOOL.TRUE;
}
