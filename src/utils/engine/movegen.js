/* eslint no-bitwise: ["error", { "allow": ["|","<<","&"] }] */

import { GameBoard, PCEINDEX, SqAttacked } from './board';
import { PIECES, PieceCol, SQOFFBOARD, BOOL, DirNum, PceDir, LoopNonSlideIndex, LoopSlidePce, LoopNonSlidePce, SQUARES, MFLAGCA, COLOURS, CASTLEBIT, MFLAGEP, RANKS, RanksBrd, MFLAGPS, LoopSlideIndex } from './defs';


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


export function AddCaptureMove(move) {
  GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply + 1]] = move;
  GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1] += 1] = 0;
}

export function AddQuietMove(move) {
  GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply + 1]] = move;
  GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1] += 1] = 0;
}

export function AddEnPassantMove(move) {
  GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply + 1]] = move;
  GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1] += 1] = 0;
}

export function AddWhitePawnCaptureMove(from, to, cap) {
  if (RanksBrd[from] === RANKS.RANK_7) {
    AddCaptureMove(MOVE(from, to, cap, PIECES.wQ, 0));
    AddCaptureMove(MOVE(from, to, cap, PIECES.wR, 0));
    AddCaptureMove(MOVE(from, to, cap, PIECES.wB, 0));
    AddCaptureMove(MOVE(from, to, cap, PIECES.wN, 0));
  } else {
    AddCaptureMove(MOVE(from, to, cap, PIECES.EMPTY, 0));
  }
}

export function AddBlackPawnCaptureMove(from, to, cap) {
  if (RanksBrd[from] === RANKS.RANK_2) {
    AddCaptureMove(MOVE(from, to, cap, PIECES.bQ, 0));
    AddCaptureMove(MOVE(from, to, cap, PIECES.bR, 0));
    AddCaptureMove(MOVE(from, to, cap, PIECES.bB, 0));
    AddCaptureMove(MOVE(from, to, cap, PIECES.bN, 0));
  } else {
    AddCaptureMove(MOVE(from, to, cap, PIECES.EMPTY, 0));
  }
}

export function AddWhitePawnQuietMove(from, to) {
  if (RanksBrd[from] === RANKS.RANK_7) {
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wQ, 0));
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wR, 0));
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wB, 0));
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wN, 0));
  } else {
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.EMPTY, 0));
  }
}

export function AddBlackPawnQuietMove(from, to) {
  if (RanksBrd[from] === RANKS.RANK_2) {
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bQ, 0));
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bR, 0));
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bB, 0));
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.bN, 0));
  } else {
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.EMPTY, 0));
  }
}

export function GenerateMoves() {
  GameBoard.moveListStart[GameBoard.ply + 1] = GameBoard.moveListStart[GameBoard.ply];

  let pceType;
  let pceNum;
  let sq;
  let pceIndex;
  let pce;
  let tSq;
  let dir;
  let index;

  if (GameBoard.side === COLOURS.WHITE) {
    pceType = PIECES.wP;

    for (
      pceNum = 0;
      pceNum < GameBoard.pceNum[pceType];
      pceNum += 1
    ) {
      sq = GameBoard.pList[PCEINDEX(pceType, pceNum)];
      if (GameBoard.pieces[sq + 10] === PIECES.EMPTY) {
        AddWhitePawnQuietMove(sq, sq + 10);
        if (RanksBrd[sq] === RANKS.RANK_2 && GameBoard.pieces[sq + 20] === PIECES.EMPTY) {
          AddQuietMove(MOVE(sq, sq + 20, PIECES.EMPTY, PIECES.EMPTY, MFLAGPS));
        }
      }

      if (
        SQOFFBOARD(sq + 9) === BOOL.FALSE
        && PieceCol[GameBoard.pieces[sq + 9]] === COLOURS.BLACK
      ) {
        AddWhitePawnCaptureMove(sq, sq + 9, GameBoard.pieces[sq + 9]);
      }

      if (
        SQOFFBOARD(sq + 11) === BOOL.FALSE
        && PieceCol[GameBoard.pieces[sq + 11]] === COLOURS.BLACK
      ) {
        AddWhitePawnCaptureMove(sq, sq + 11, GameBoard.pieces[sq + 11]);
      }

      if (GameBoard.enPas !== SQUARES.NOSQ) {
        if (sq + 9 === GameBoard.enPas) {
          AddEnPassantMove(MOVE(sq, sq + 9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP));
        }

        if (sq + 11 === GameBoard.enPas) {
          AddEnPassantMove(MOVE(sq, sq + 11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP));
        }
      }
    }

    if (GameBoard.castlePerm & CASTLEBIT.WKCA) {
      if (
        GameBoard.pieces[SQUARES.F1] === PIECES.EMPTY
        && GameBoard.pieces[SQUARES.G1] === PIECES.EMPTY
      ) {
        if (
          SqAttacked(SQUARES.F1, COLOURS.BLACK) === BOOL.FALSE
          && SqAttacked(SQUARES.E1, COLOURS.BLACK) === BOOL.FALSE
        ) {
          AddQuietMove(MOVE(SQUARES.E1, SQUARES.G1, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA));
        }
      }
    }

    if (GameBoard.castlePerm & CASTLEBIT.WQCA) {
      if (
        GameBoard.pieces[SQUARES.D1] === PIECES.EMPTY
        && GameBoard.pieces[SQUARES.C1] === PIECES.EMPTY
        && GameBoard.pieces[SQUARES.B1] === PIECES.EMPTY
      ) {
        if (
          SqAttacked(SQUARES.D1, COLOURS.BLACK) === BOOL.FALSE
          && SqAttacked(SQUARES.E1, COLOURS.BLACK) === BOOL.FALSE
        ) {
          AddQuietMove(MOVE(SQUARES.E1, SQUARES.C1, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA));
        }
      }
    }
  } else {
    pceType = PIECES.bP;

    for (
      pceNum = 0;
      pceNum < GameBoard.pceNum[pceType];
      pceNum += 1
    ) {
      sq = GameBoard.pList[PCEINDEX(pceType, pceNum)];
      if (GameBoard.pieces[sq - 10] === PIECES.EMPTY) {
        AddBlackPawnQuietMove(sq, sq - 10);
        if (RanksBrd[sq] === RANKS.RANK_7 && GameBoard.pieces[sq - 20] === PIECES.EMPTY) {
          AddQuietMove(MOVE(sq, sq - 20, PIECES.EMPTY, PIECES.EMPTY, MFLAGPS));
        }
      }

      if (
        SQOFFBOARD(sq - 9) === BOOL.FALSE
        && PieceCol[GameBoard.pieces[sq - 9]] === COLOURS.WHITE
      ) {
        AddBlackPawnCaptureMove(sq, sq - 9, GameBoard.pieces[sq - 9]);
      }

      if (
        SQOFFBOARD(sq - 11) === BOOL.FALSE
        && PieceCol[GameBoard.pieces[sq - 11]] === COLOURS.WHITE
      ) {
        AddBlackPawnCaptureMove(sq, sq - 11, GameBoard.pieces[sq - 11]);
      }

      if (GameBoard.enPas !== SQUARES.NOSQ) {
        if (sq - 9 === GameBoard.enPas) {
          AddEnPassantMove(MOVE(sq, sq - 9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP));
        }

        if (sq - 11 === GameBoard.enPas) {
          AddEnPassantMove(MOVE(sq, sq - 11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP));
        }
      }
    }
    if (GameBoard.castlePerm & CASTLEBIT.BKCA) {
      if (
        GameBoard.pieces[SQUARES.F8] === PIECES.EMPTY
        && GameBoard.pieces[SQUARES.G8] === PIECES.EMPTY
      ) {
        if (
          SqAttacked(SQUARES.F8, COLOURS.WHITE) === BOOL.FALSE
          && SqAttacked(SQUARES.E8, COLOURS.WHITE) === BOOL.FALSE
        ) {
          AddQuietMove(MOVE(SQUARES.E8, SQUARES.G8, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA));
        }
      }
    }

    if (GameBoard.castlePerm & CASTLEBIT.BQCA) {
      if (
        GameBoard.pieces[SQUARES.D8] === PIECES.EMPTY
        && GameBoard.pieces[SQUARES.C8] === PIECES.EMPTY
        && GameBoard.pieces[SQUARES.B8] === PIECES.EMPTY
      ) {
        if (
          SqAttacked(SQUARES.D8, COLOURS.WHITE) === BOOL.FALSE
          && SqAttacked(SQUARES.E8, COLOURS.WHITE) === BOOL.FALSE
        ) {
          AddQuietMove(MOVE(SQUARES.E8, SQUARES.C8, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA));
        }
      }
    }
  }

  pceIndex = LoopNonSlideIndex[GameBoard.side];
  pce = LoopNonSlidePce[pceIndex += 1];

  while (pce !== 0) {
    for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; pceNum += 1) {
      sq = GameBoard.pList[PCEINDEX(pce, pceNum)];

      for (index = 0; index < DirNum[pce]; index += 1) {
        dir = PceDir[pce][index];
        tSq = sq + dir;

        if (SQOFFBOARD(tSq) === BOOL.TRUE) {
          // eslint-disable-next-line
          continue;
        }

        if (GameBoard.pieces[tSq] !== PIECES.EMPTY) {
          if (PieceCol[GameBoard.pieces[tSq]] !== GameBoard.side) {
            AddCaptureMove(MOVE(sq, tSq, GameBoard.pieces[tSq], PIECES.EMPTY, 0));
          }
        } else {
          AddQuietMove(MOVE(sq, tSq, PIECES.EMPTY, PIECES.EMPTY, 0));
        }
      }
    }
    pce = LoopNonSlidePce[pceIndex += 1];
  }

  pceIndex = LoopSlideIndex[GameBoard.side];
  pce = LoopSlidePce[pceIndex += 1];

  while (pce !== 0) {
    for (pceNum = 0; pceNum < GameBoard.pceNum[pce]; pceNum += 1) {
      sq = GameBoard.pList[PCEINDEX(pce, pceNum)];

      for (index = 0; index < DirNum[pce]; index += 1) {
        dir = PceDir[pce][index];
        tSq = sq + dir;

        while (SQOFFBOARD(tSq) === BOOL.FALSE) {
          if (GameBoard.pieces[tSq] !== PIECES.EMPTY) {
            if (PieceCol[GameBoard.pieces[tSq]] !== GameBoard.side) {
              AddCaptureMove(MOVE(sq, tSq, GameBoard.pieces[tSq], PIECES.EMPTY, 0));
            }
            break;
          }
          AddQuietMove(MOVE(sq, tSq, PIECES.EMPTY, PIECES.EMPTY, 0));
          tSq += dir;
        }
      }
    }
    pce = LoopSlidePce[pceIndex += 1];
  }
}
