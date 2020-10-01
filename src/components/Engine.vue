<template>
  <div>
    <div>
      <span>Fen: </span>
      <input type="text" v-model="fenIn"/>
      <button @click="vueSetFen">Set Position</button>
    </div>
    <div>
      TABLE
    </div>
    <div>
      <span>Thinking Time:</span><br />
      <select v-model="thinkingTime">
        <option value="1">1s</option>
        <option value="2">2s</option>
        <option value="4">4s</option>
        <option value="6">6s</option>
        <option value="8">8s</option>
        <option value="10">10s</option>
      </select>
      <br/><br/><br/>
      <span>BestMove:</span><br />
      <span>Depth:</span><br />
      <span>Score:</span><br />
      <span>Nodes:</span><br />
      <span>Ordering:</span><br />
      <span>Time:</span><br />
      <button type="button">Move Now</button><br />
      <button type="button">New Game</button><br />
      <button type="button">Flip Board</button><br />
      <button type="button">Take Back</button><br />
      <span></span>
    </div>
  </div>
</template>

<script>
import { InitFilesRanksBrd, InitHashKeys, InitSq120To64, InitBoardVars } from '@/utils/main';
import { ParseFen, PrintBoard } from '@/utils/board';
import { START_FEN } from '@/utils/def';
import { SearchPosition } from '@/utils/search';
import { InitMvvLva } from '@/utils/movegen';

export default {
  data() {
    return {
      fenIn: '',
      thinkingTime: '1',
    };
  },
  mounted() {
    this.init();
    // eslint-disable-next-line
    console.log('Main Init Called');
    ParseFen(START_FEN);
    PrintBoard();
  },
  methods: {
    vueSetFen() {
      ParseFen(this.fenIn);
      PrintBoard();
      SearchPosition();
    },
    init() {
      // eslint-disable-next-line
        console.log('init() called');
      InitFilesRanksBrd();
      InitHashKeys();
      InitSq120To64();
      InitBoardVars();
      InitMvvLva();
    },
  },
};
</script>

<style>

</style>
