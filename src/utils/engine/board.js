/* eslint no-bitwise: ["error", { "allow": ["^=",] }] */

import { BRD_SQ_NUM, COLOURS, CastleKeys, PieceKeys, SQUARES, SideKey, PIECES, SQ120, MAXDEPTH, MAXPOSITIONMOVES, RANKS, FILES, FR2SQ } from './defs';

export const GameBoard = {
  pieces: new Array(BRD_SQ_NUM),
  side: COLOURS.WHITE,
  fiftyMove: 0,
  hisPly: 0,
  ply: 0,
  castlePerm: 0,
  material: new Array(2), // WHITE,BLACK material of pieces
  pceNum: new Array(13), // indexed by Pce
  pList: new Array(14 * 10),
  posKey: 0,
  moveList: new Array(MAXDEPTH * MAXPOSITIONMOVES),
  moveScores: new Array(MAXDEPTH * MAXPOSITIONMOVES),
  moveListStart: new Array(MAXDEPTH),
};

export function PCEINDEX(pce, pceNum) {
  return ((pce * 10) + pceNum);
}

export function GeneratePosKey() {
  let sq = 0;
  let finalKey = 0;
  let piece = PIECES.EMPTY;

  for (sq = 0; sq < BRD_SQ_NUM; sq += 1) {
    piece = GameBoard.pieces[sq];
    if (piece !== PIECES.EMPTY && piece !== SQUARES.OFFBOARD) {
      finalKey ^= PieceKeys[(piece * 120) + sq];
    }
  }

  if (GameBoard.side === COLOURS.WHITE) {
    finalKey ^= SideKey;
  }

  if (GameBoard.enPas !== SQUARES.NO_SQ) {
    finalKey ^= PieceKeys[GameBoard.enPas];
  }

  finalKey ^= CastleKeys[GameBoard.castlePerm];

  return finalKey;
}

export function ResetBoard() {
  let index = 0;

  for (index = 0; index < BRD_SQ_NUM; index += 1) {
    GameBoard.pieces[index] = SQUARES.OFFBOARD;
  }

  for (index = 0; index < 64; index += 1) {
    GameBoard.pieces[SQ120(index)] = PIECES.EMPTY;
  }

  for (index = 0; index < 14 * 120; index += 1) {
    GameBoard.pList[index] = PIECES.EMPTY;
  }

  for (index = 0; index < 2; index += 1) {
    GameBoard.material[index] = 0;
  }

  for (index = 0; index < 13; index += 1) {
    GameBoard.pceNum[index] = 0;
  }

  GameBoard.side = COLOURS.BOTH;
  GameBoard.enPas = SQUARES.NO_SQ;
  GameBoard.fiftyMove = 0;
  GameBoard.ply = 0;
  GameBoard.hisPly = 0;
  GameBoard.castlePerm = 0;
  GameBoard.posKey = 0;
  GameBoard.moveListStart[GameBoard.ply] = 0;
}

export function ParseFen(fen) {
  ResetBoard();
  let rank = RANKS.RANK_8;
  let file = FILES.FILE_A;
  let piece = 0;
  let count = 0;
  let i = 0;
  let sq120 = 0;
  let fenCnt = 0; // fen[fenCnt]
  const brdPieces = [];

  while ((rank >= RANKS.RANK_1) && fenCnt < fen.length) {
    count = 1;
    switch (fen[fenCnt]) {
      case 'p': piece = PIECES.bP; break;
      case 'r': piece = PIECES.bR; break;
      case 'n': piece = PIECES.bN; break;
      case 'b': piece = PIECES.bB; break;
      case 'k': piece = PIECES.bK; break;
      case 'q': piece = PIECES.bQ; break;
      case 'P': piece = PIECES.wP; break;
      case 'R': piece = PIECES.wR; break;
      case 'N': piece = PIECES.wN; break;
      case 'B': piece = PIECES.wB; break;
      case 'K': piece = PIECES.wK; break;
      case 'Q': piece = PIECES.wQ; break;

      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
        piece = PIECES.EMPTY;
        count = fen[fenCnt].charCodeAt() - '0'.charCodeAt();
        break;

      case '/':
      case ' ':
        rank -= 1;
        file = FILES.FILE_A;
        fenCnt += 1;
        // eslint-disable-next-line
        continue;
      default:
        // eslint-disable-next-line
        console.log('FEN error');
        return;
    }

    for (i = 0; i < count; i += 1) {
      sq120 = FR2SQ(file, rank);
      brdPieces[sq120] = piece;
      file += 1;
    }
    fenCnt += 1;
  }
}
