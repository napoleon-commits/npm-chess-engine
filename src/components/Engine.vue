<template>
  <div>
      <header>
          <h3>NPM Chess Engine</h3>
      </header>
      <div>
          Fen:<br />
          <input type="text"/>
          <button type="button">
              Set Position
          </button>
      </div>
  </div>
</template>

<script>
/* eslint no-bitwise: ["error", { "allow": ["^=",] }] */

import { InitFilesRanksBrd, InitHashKeys, InitSq120To64 } from '@/utils/engine/main';
import { ParseFen, PrintBoard } from '@/utils/engine/board';
import { START_FEN } from '@/utils/engine/defs';

export default {
  mounted() {
    this.init();
    // eslint-disable-next-line
    console.log("Main Init Called");
    ParseFen(START_FEN);
    PrintBoard();
  },
  methods: {
    init() {
      // eslint-disable-next-line
        console.log("init() called");
      InitFilesRanksBrd();
      InitHashKeys();
      InitSq120To64();
    },
  },
};
</script>

<style>

</style>
