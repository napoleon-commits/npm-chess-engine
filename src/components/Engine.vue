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

import { InitFilesRanksBrd, InitHashKeys, InitSq120To64 } from '@/utils/engine/main';

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
      InitHashKeys();
      InitSq120To64();
    },
  },
};
</script>

<style>

</style>
