import { BRD_SQ_NUM, COLOURS } from './defs';

// eslint-disable-next-line
export const GameBoard = {
  pieces: new Array(BRD_SQ_NUM),
  side: COLOURS.WHITE,
  fiftyMove: 0,
  hisPly: 0,
  ply: 0,
  castlePerm: 0,
};
