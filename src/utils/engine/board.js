/* eslint no-bitwise: ["error", { "allow": ["^=",] }] */

import { BRD_SQ_NUM, COLOURS, CastleKeys, PieceKeys, SQUARES, SideKey, PIECES } from './defs';

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
