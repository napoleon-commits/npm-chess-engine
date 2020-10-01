<template>
  <div>
    <div>
      <span>Fen: </span>
      <input type="text" v-model="fenIn"/>
      <button @click="vueSetFen">Set Position</button>
    </div>
    <div>
      <table id="chessboard" class="m-auto">
        <tbody>
          <tr v-for="(rank, rankIndex) in chessboard" :key="rankIndex">
            <td
              v-for="(square, fileIndex) in rank"
              :key="fileIndex"
              v-html="getHTMLChessPiece(square)"
              :class="`
                ${(((rankIndex+fileIndex)%2)===0)?'bg-white':'dark-square'}
                ${(chessboard[rankIndex][fileIndex] !== '.')?' c-pointer':''}
              `"
              @click="vueClickedSquare(fileIndex, 7 - rankIndex, square)"
            />
          </tr>
        </tbody>
      </table>
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
import { getHTMLChessPiece, getJ2DBoard } from '@/utils/vueboard';
import { ClickedSpace, ClickedPiece } from '@/utils/gui';

export default {
  data() {
    return {
      fenIn: '',
      thinkingTime: '1',
      chessboard: [],
    };
  },
  mounted() {
    this.init();
    // eslint-disable-next-line
    console.log('Main Init Called');
    ParseFen(START_FEN);
    PrintBoard();
    this.chessboard = getJ2DBoard();
  },
  methods: {
    vueSetFen() {
      ParseFen(this.fenIn);
      PrintBoard();
      SearchPosition();
    },
    vueClickedSquare(file, rank, square) {
      if (square === '.') {
        ClickedSpace(file, rank);
      } else {
        ClickedPiece(file, rank);
      }
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
    getHTMLChessPiece,
  },
};
</script>

<style>
  .dark-square{
    background-color: #42b983;
  }
  #chessboard{
    border: 4px solid black;
  }
</style>
