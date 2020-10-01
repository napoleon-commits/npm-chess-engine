<template>
  <div>
      <span>Fen: </span>
      <input type="text" v-model="fenIn"/>
      <button @click="vueSetFen">Set Position</button>
  </div>
</template>

<script>
import { InitFilesRanksBrd, InitHashKeys, InitSq120To64, InitBoardVars } from '@/utils/main';
import { ParseFen, PrintBoard, PrintPieceLists, CheckBoard } from '@/utils/board';
import { GenerateMoves } from '@/utils/movegen';
import { PrintMoveList } from '@/utils/io';
import { START_FEN, GameBoard } from '@/utils/def';
import { MakeMove } from '@/utils/makemove';

export default {
  data() {
    return {
      fenIn: '',
    };
  },
  mounted() {
    this.init();
    // eslint-disable-next-line
    console.log('Main Init Called');
    ParseFen(START_FEN);
    PrintBoard();
    GenerateMoves();
    PrintMoveList();
    PrintPieceLists();
    CheckBoard();
    MakeMove(GameBoard.moveList[0]);
    PrintBoard();
    CheckBoard();
  },
  methods: {
    vueSetFen() {
      ParseFen(this.fenIn);
      PrintBoard();
      PrintMoveList();
    },
    init() {
      // eslint-disable-next-line
        console.log('init() called');
      InitFilesRanksBrd();
      InitHashKeys();
      InitSq120To64();
      InitBoardVars();
    },
  },
};
</script>

<style>

</style>
