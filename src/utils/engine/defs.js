/* eslint no-bitwise: ["error", { "allow": ["|","<<"] }] */

export const PIECES = {
  EMPTY: 0,
  wP: 1,
  wN: 2,
  wB: 3,
  wR: 4,
  wQ: 5,
  wK: 6,
  bP: 7,
  bN: 8,
  bB: 9,
  bR: 10,
  bQ: 11,
  bK: 12,
};

export const BRD_SQ_NUM = 120;

export const FILES = {
  FILE_A: 0,
  FILE_B: 1,
  FILE_C: 2,
  FILE_D: 3,
  FILE_E: 4,
  FILE_F: 5,
  FILE_G: 6,
  FILE_H: 7,
  FILE_NONE: 8,
};

export const RANKS = {
  RANK_1: 0,
  RANK_2: 1,
  RANK_3: 2,
  RANK_4: 3,
  RANK_5: 4,
  RANK_6: 5,
  RANK_7: 6,
  RANK_8: 7,
  RANK_NONE: 8,
};

export const COLOURS = { WHITE: 0, BLACK: 1, BOTH: 2 };

export const SQUARES = {
  A1: 21,
  B1: 22,
  C1: 23,
  D1: 24,
  E1: 25,
  F1: 26,
  G1: 27,
  H1: 28,
  A8: 91,
  B8: 92,
  C8: 93,
  D8: 94,
  E8: 95,
  F8: 96,
  G8: 97,
  H8: 98,
  NO_SQ: 99,
  OFFBOARD: 100,
};

export const BOOL = { FALSE: 0, TRUE: 1 };

export const FilesBrd = new Array(BRD_SQ_NUM);
export const RanksBrd = new Array(BRD_SQ_NUM);

export function FR2SQ(f, r) {
  return ((21 + (f)) + ((r) * 10));
}

export const CASTLEBIT = { WKCA: 1, WQCA: 2, BKCA: 4, BQCA: 8 };

export const PieceBig = [
  BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE,
  BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE,
];
export const PieceMaj = [
  BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE,
  BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE,
];
export const PieceMin = [
  BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE,
  BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE,
];
export const PieceVal = [0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000];
export const PieceCol = [
  COLOURS.BOTH, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE,
  COLOURS.WHITE, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK,
  COLOURS.BLACK,
];
export const PiecePawn = [
  BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE,
  BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE,
];
export const PieceKnight = [
  BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE,
  BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE,
];
export const PieceKing = [
  BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE,
  BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE,
];
export const PieceRookQueen = [
  BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE,
  BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE,
];
export const PieceBishopQueen = [
  BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE,
  BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE,
];
export const PieceSlides = [
  BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE,
  BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE,
];

export function RAND_32() {
  return (
    (Math.floor((Math.random() * 255) + 1) << 23)
    | (Math.floor((Math.random() * 255) + 1) << 16)
    | (Math.floor((Math.random() * 255) + 1) << 8)
    | (Math.floor((Math.random() * 255) + 1))
  );
}

export const PieceKeys = new Array(14 * 120);
export const SideKey = [];
export const CastleKeys = new Array(16);

export const Sq120ToSq64 = new Array(BRD_SQ_NUM);
export const Sq64ToSq120 = new Array(64);

export function SQ64(sq120) {
  return Sq120ToSq64[(sq120)];
}

export function SQ120(sq64) {
  return Sq64ToSq120[(sq64)];
}

export const MAXGAMEMOVES = 2048;
export const MAXPOSITIONMOVES = 256;
export const MAXDEPTH = 64;
