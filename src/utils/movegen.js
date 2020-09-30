/* eslint no-bitwise: ["error", { "allow": ["&","|","<<"] }] */

import { BOOL, SQOFFBOARD, PIECES, LoopSlidePce, GameBoard, PceDir, DirNum, LoopSlideIndex, LoopNonSlidePce, PieceCol, PCEINDEX, SQUARES, COLOURS, MFLAGEP, LoopNonSlideIndex, MFLAGCA, MFLAGPS, RanksBrd, CASTLEBIT, RANKS, TOSQ, BRD_SQ_NUM, NOMOVE, CAPTURED, FROMSQ, MAXDEPTH } from './def';
import { SqAttacked } from './board';
import { MakeMove, TakeMove } from './makemove';

const MvvLvaValue = [0, 100, 200, 300, 400, 500, 600, 100, 200, 300, 400, 500, 600];
const MvvLvaScores = new Array(14 * 14);

export function InitMvvLva() {
  let Attacker;
  let Victim;

  for (Attacker = PIECES.wP; Attacker <= PIECES.bK; Attacker += 1) {
    for (Victim = PIECES.wP; Victim <= PIECES.bK; Victim += 1) {
      MvvLvaScores[(Victim * 14) + Attacker] =
      (MvvLvaValue[Victim] + 6) - (MvvLvaValue[Attacker] / 100);
    }
  }
}


function AddCaptureMove(move) {
  GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply + 1]] = move;
  GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]] =
          MvvLvaScores[(CAPTURED(move) * 14) + GameBoard.pieces[FROMSQ(move)]] + 1000000;
  GameBoard.moveListStart[GameBoard.ply + 1] += 1;
}

function AddQuietMove(move) {
  GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply + 1]] = move;
  GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]] = 0;

  if (move === GameBoard.searchKillers[GameBoard.ply]) {
    GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]] = 900000;
  } else if (move === GameBoard.searchKillers[GameBoard.ply + MAXDEPTH]) {
    GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]] = 800000;
  } else {
    GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]] =
  GameBoard.searchHistory[(GameBoard.pieces[FROMSQ(move)] * BRD_SQ_NUM) + TOSQ(move)];
  }

  GameBoard.moveListStart[GameBoard.ply + 1] += 1;
}

function AddEnPassantMove(move) {
  GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply + 1]] = move;
  GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply + 1]] = 105 + 1000000;
  GameBoard.moveListStart[GameBoard.ply + 1] += 1;
}

function MOVE(from, to, captured, promoted, flag) {
  return (from | (to << 7) | (captured << 14) | (promoted << 20) | flag);
}

function AddWhitePawnCaptureMove(from, to, cap) {
  if (RanksBrd[from] === RANKS.RANK_7) {
    AddCaptureMove(MOVE(from, to, cap, PIECES.wQ, 0));
    AddCaptureMove(MOVE(from, to, cap, PIECES.wR, 0));
    AddCaptureMove(MOVE(from, to, cap, PIECES.wB, 0));
    AddCaptureMove(MOVE(from, to, cap, PIECES.wN, 0));
  } else {
    AddCaptureMove(MOVE(from, to, cap, PIECES.EMPTY, 0));
  }
}

function AddBlackPawnCaptureMove(from, to, cap) {
  if (RanksBrd[from] === RANKS.RANK_2) {
    AddCaptureMove(MOVE(from, to, cap, PIECES.bQ, 0));
    AddCaptureMove(MOVE(from, to, cap, PIECES.bR, 0));
    AddCaptureMove(MOVE(from, to, cap, PIECES.bB, 0));
    AddCaptureMove(MOVE(from, to, cap, PIECES.bN, 0));
  } else {
    AddCaptureMove(MOVE(from, to, cap, PIECES.EMPTY, 0));
  }
}

function AddWhitePawnQuietMove(from, to) {
  if (RanksBrd[from] === RANKS.RANK_7) {
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wQ, 0));
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wR, 0));
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wB, 0));
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.wN, 0));
  } else {
    AddQuietMove(MOVE(from, to, PIECES.EMPTY, PIECES.EMPTY, 0));
  }
}

function AddBlackPawnQuietMove(from, to) {
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

    for (pceNum = 0; pceNum < GameBoard.pceNum[pceType]; pceNum += 1) {
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

      if (GameBoard.enPas !== SQUARES.NO_SQ) {
        if (sq + 9 === GameBoard.enPas) {
          AddEnPassantMove(MOVE(sq, sq + 9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP));
        }

        if (sq + 11 === GameBoard.enPas) {
          AddEnPassantMove(MOVE(sq, sq + 11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP));
        }
      }
    }

    if (
      GameBoard.castlePerm & CASTLEBIT.WKCA
          && GameBoard.pieces[SQUARES.F1] === PIECES.EMPTY
          && GameBoard.pieces[SQUARES.G1] === PIECES.EMPTY
          && SqAttacked(SQUARES.F1, COLOURS.BLACK) === BOOL.FALSE
          && SqAttacked(SQUARES.E1, COLOURS.BLACK) === BOOL.FALSE
    ) {
      AddQuietMove(MOVE(SQUARES.E1, SQUARES.G1, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA));
    }

    if (
      GameBoard.castlePerm & CASTLEBIT.WQCA
          && GameBoard.pieces[SQUARES.D1] === PIECES.EMPTY
          && GameBoard.pieces[SQUARES.C1] === PIECES.EMPTY
          && GameBoard.pieces[SQUARES.B1] === PIECES.EMPTY
          && SqAttacked(SQUARES.D1, COLOURS.BLACK) === BOOL.FALSE
          && SqAttacked(SQUARES.E1, COLOURS.BLACK) === BOOL.FALSE
    ) {
      AddQuietMove(MOVE(SQUARES.E1, SQUARES.C1, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA));
    }
  } else {
    pceType = PIECES.bP;

    for (pceNum = 0; pceNum < GameBoard.pceNum[pceType]; pceNum += 1) {
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

      if (GameBoard.enPas !== SQUARES.NO_SQ) {
        if (sq - 9 === GameBoard.enPas) {
          AddEnPassantMove(MOVE(sq, sq - 9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP));
        }

        if (sq - 11 === GameBoard.enPas) {
          AddEnPassantMove(MOVE(sq, sq - 11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP));
        }
      }
    }
    if (
      GameBoard.castlePerm & CASTLEBIT.BKCA
          && GameBoard.pieces[SQUARES.F8] === PIECES.EMPTY
          && GameBoard.pieces[SQUARES.G8] === PIECES.EMPTY
          && SqAttacked(SQUARES.F8, COLOURS.WHITE) === BOOL.FALSE
          && SqAttacked(SQUARES.E8, COLOURS.WHITE) === BOOL.FALSE
    ) {
      AddQuietMove(MOVE(SQUARES.E8, SQUARES.G8, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA));
    }

    if (
      GameBoard.castlePerm & CASTLEBIT.BQCA
          && GameBoard.pieces[SQUARES.D8] === PIECES.EMPTY
          && GameBoard.pieces[SQUARES.C8] === PIECES.EMPTY
          && GameBoard.pieces[SQUARES.B8] === PIECES.EMPTY
          && SqAttacked(SQUARES.D8, COLOURS.WHITE) === BOOL.FALSE
          && SqAttacked(SQUARES.E8, COLOURS.WHITE) === BOOL.FALSE
    ) {
      AddQuietMove(MOVE(SQUARES.E8, SQUARES.C8, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA));
    }
  }

  pceIndex = LoopNonSlideIndex[GameBoard.side];
  pce = LoopNonSlidePce[pceIndex];
  pceIndex += 1;

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
    pce = LoopNonSlidePce[pceIndex];
    pceIndex += 1;
  }

  pceIndex = LoopSlideIndex[GameBoard.side];
  pce = LoopSlidePce[pceIndex];
  pceIndex += 1;

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
    pce = LoopSlidePce[pceIndex];
    pceIndex += 1;
  }
}

export function MoveExists(move) {
  GenerateMoves();

  let index;
  let moveFound = NOMOVE;
  for (
    index = GameBoard.moveListStart[GameBoard.ply];
    index < GameBoard.moveListStart[GameBoard.ply + 1];
    index += 1
  ) {
    moveFound = GameBoard.moveList[index];
    if (MakeMove(moveFound) === BOOL.FALSE) {
      // eslint-disable-next-line
      continue;
    }
    TakeMove();
    if (move === moveFound) {
      return BOOL.TRUE;
    }
  }
  return BOOL.FALSE;
}


export function GenerateCaptures() {
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

    for (pceNum = 0; pceNum < GameBoard.pceNum[pceType]; pceNum += 1) {
      sq = GameBoard.pList[PCEINDEX(pceType, pceNum)];

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

      if (GameBoard.enPas !== SQUARES.NO_SQ) {
        if (sq + 9 === GameBoard.enPas) {
          AddEnPassantMove(MOVE(sq, sq + 9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP));
        }

        if (sq + 11 === GameBoard.enPas) {
          AddEnPassantMove(MOVE(sq, sq + 11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP));
        }
      }
    }
  } else {
    pceType = PIECES.bP;

    for (pceNum = 0; pceNum < GameBoard.pceNum[pceType]; pceNum += 1) {
      sq = GameBoard.pList[PCEINDEX(pceType, pceNum)];

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

      if (GameBoard.enPas !== SQUARES.NO_SQ) {
        if (sq - 9 === GameBoard.enPas) {
          AddEnPassantMove(MOVE(sq, sq - 9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP));
        }

        if (sq - 11 === GameBoard.enPas) {
          AddEnPassantMove(MOVE(sq, sq - 11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP));
        }
      }
    }
  }

  pceIndex = LoopNonSlideIndex[GameBoard.side];
  pce = LoopNonSlidePce[pceIndex];
  pceIndex += 1;

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
        }
      }
    }
    pce = LoopNonSlidePce[pceIndex];
    pceIndex += 1;
  }

  pceIndex = LoopSlideIndex[GameBoard.side];
  pce = LoopSlidePce[pceIndex];
  pceIndex += 1;

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
          tSq += dir;
        }
      }
    }
    pce = LoopSlidePce[pceIndex];
    pceIndex += 1;
  }
}
