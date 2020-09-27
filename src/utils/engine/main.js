import { FILES, RANKS, SQUARES, BRD_SQ_NUM, FilesBrd, RanksBrd, FR2SQ } from './defs';

// eslint-disable-next-line
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

  //   eslint-disable-next-line
    console.log(`FilesBrd[0]:${FilesBrd[0]} RanksBrd[0]:${RanksBrd[0]}`);
  //   eslint-disable-next-line
    console.log(`FilesBrd[SQUARES.A1]:${FilesBrd[SQUARES.A1]} RanksBrd[SQUARES.A1]:${RanksBrd[SQUARES.A1]}`);
  //   eslint-disable-next-line
    console.log(`FilesBrd[SQUARES.E8]:${FilesBrd[SQUARES.E8]} RanksBrd[SQUARES.E8]:${RanksBrd[SQUARES.E8]}`);
}
