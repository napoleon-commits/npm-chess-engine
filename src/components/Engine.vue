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
import { InitFilesRanksBrd } from '../utils/engine/main';

export default {
  mounted() {
    this.init();
    // eslint-disable-next-line
    console.log("Main Init Called");	
  },
  methods: {
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
