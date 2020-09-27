import { BRD_SQ_NUM, COLOURS } from './defs';

// eslint-disable-next-line
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
};
