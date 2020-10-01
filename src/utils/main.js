/* eslint no-bitwise: ["error", { "allow": ["^=","^"] }] */

import { FILES, MAXGAMEMOVES, Sq120ToSq64, Sq64ToSq120, FR2SQ, RANKS, NOMOVE, PVENTRIES, GameBoard, RAND_32, SQUARES, SideKey, PieceKeys, BRD_SQ_NUM, FilesBrd, RanksBrd, CastleKeys } from './def';

// $(function() {
// init();
// console.log("Main Init Called");
// NewGame(START_FEN);
// });

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

  for (index = 0; index < PVENTRIES; index += 1) {
    GameBoard.PvTable.push({
      move: NOMOVE,
      posKey: 0,
    });
  }
}

export function InitBoardSquares() {
//   let light = 0;
  //   let rankName;
  //   let fileName;
  //   let divString;
//   let lastLight = 0;
  let rankIter = 0;
  let fileIter = 0;
  //   let lightString;

  for (rankIter = RANKS.RANK_8; rankIter >= RANKS.RANK_1; rankIter -= 1) {
    // light = lastLight ^ 1;
    // lastLight ^= 1;
    // rankName = `rank${rankIter + 1}`;
    for (fileIter = FILES.FILE_A; fileIter <= FILES.FILE_H; fileIter += 1) {
    //   fileName = `file${fileIter + 1}`;

      //   if (light === 0) lightString = 'Light';
      //   else lightString = 'Dark';
      //   divString = `<div class="Square ${rankName} ${fileName} ${lightString}"/>`;
    //   light ^= 1;
    //   $('#Board').append(divString);
    }
  }
}

// function InitBoardSquares() {
//   let light = 1;
//   let rankName;
//   let fileName;
//   let divString;
//   let rankIter;
//   let fileIter;
//   let lightString;

//   for (rankIter = RANKS.RANK_8; rankIter >= RANKS.RANK_1; rankIter--) {
//     light ^= 1;
//     rankName = `rank${rankIter + 1}`;
//     for (fileIter = FILES.FILE_A; fileIter <= FILES.FILE_H; fileIter++) {
//       fileName = `file${fileIter + 1}`;
//       if (light === 0) lightString = 'Light';
//       else lightString = 'Dark';
//       light ^= 1;
//       divString = `<div class="Square ${rankName} ${fileName} ${lightString}"/>`;
//       $('#Board').append(divString);
//     }
//   }
// }

