import { FILES, RANKS, SQUARES, BRD_SQ_NUM, FilesBrd, RanksBrd, FR2SQ, RAND_32, CastleKeys, SideKey, PieceKeys, Sq120ToSq64, Sq64ToSq120, NOMOVE, GameBoard, MAXGAMEMOVES } from './defs';

export function InitFilesRanksBrd() {
  let index = 0;
  let file = FILES.FILE_A;
  let rank = RANKS.RANK_1;
  let sq = SQUARES.A1;

  for (index = 0; index < BRD_SQ_NUM; index += 1) {
    FilesBrd[index] = SQUARES.OFFBOARD;
    RanksBrd[index] = SQUARES.OFFBOARD;
  }

  for (rank = RANKS.RANK_1; rank <= RANKS.RANK_8; rank += 1) {
    for (file = FILES.FILE_A; file <= FILES.FILE_H; file += 1) {
      sq = FR2SQ(file, rank);
      FilesBrd[sq] = file;
      RanksBrd[sq] = rank;
    }
  }
}

export function InitHashKeys() {
  let index = 0;

  for (index = 0; index < 14 * 120; index += 1) {
    PieceKeys[index] = RAND_32();
  }

  SideKey[0] = RAND_32();

  for (index = 0; index < 16; index += 1) {
    CastleKeys[index] = RAND_32();
  }
}

export function InitSq120To64() {
  let index = 0;
  let file = FILES.FILE_A;
  let rank = RANKS.RANK_1;
  let sq = SQUARES.A1;
  let sq64 = 0;

  for (index = 0; index < BRD_SQ_NUM; index += 1) {
    Sq120ToSq64[index] = 65;
  }

  for (index = 0; index < 64; index += 1) {
    Sq64ToSq120[index] = 120;
  }

  for (rank = RANKS.RANK_1; rank <= RANKS.RANK_8; rank += 1) {
    for (file = FILES.FILE_A; file <= FILES.FILE_H; file += 1) {
      sq = FR2SQ(file, rank);
      Sq64ToSq120[sq64] = sq;
      Sq120ToSq64[sq] = sq64;
      sq64 += 1;
    }
  }
}

export function InitBoardVars() {
  let index = 0;
  for (index = 0; index < MAXGAMEMOVES; index += 1) {
    GameBoard.history.push({
      move: NOMOVE,
      castlePerm: 0,
      enPas: 0,
      fiftyMove: 0,
      posKey: 0,
    });
  }
}
