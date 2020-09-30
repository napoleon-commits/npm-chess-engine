<template>
  <div>
      <header>
          <h3>NPM Chess Engine</h3>
      </header>
      <div>
          Fen:<br />
          <input type="text" v-model="fenIn"/>
          <button type="button" @click="vueSetFen">
              Set Position
          </button>
      </div>
  </div>
</template>

<script>
/* eslint no-bitwise: ["error", { "allow": ["^=",] }] */

import { InitFilesRanksBrd } from '@/utils/engine/main';
import { RAND_32 } from '@/utils/engine/defs';

export default {
  data() {
    return {
      fenIn: '',
    };
  },
  mounted() {
    this.init();
    // eslint-disable-next-line
    console.log("Main Init Called");

    /*
    unique?
    Piece on Sq
    Side
    Castle
    EnPas

    posKey ^= RandNum for all pces on sq
    posKey ^= RandNum side.. and so on
    */

    const piece1 = RAND_32();
    const piece2 = RAND_32();
    const piece3 = RAND_32();
    const piece4 = RAND_32();

    let key = 0;
    key ^= piece1;
    key ^= piece2;
    key ^= piece3;
    key ^= piece4;
    // eslint-disable-next-line
    console.log("key:" + key.toString(16));	
    key = 0;
    key ^= piece4;
    key ^= piece2;
    key ^= piece1;
    key ^= piece3;
    // eslint-disable-next-line
    console.log("key:" + key.toString(16));
  },
  methods: {
    vueSetFen() {
      // eslint-disable-next-line
      console.log(this.fenIn);
    },
    init() {
      // eslint-disable-next-line
      console.log("init() called");
      InitFilesRanksBrd();
    },
  },
};
</script>

<style>

</style>
