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

export default {
  data() {
    return {
      fenIn: '',
    };
  },
  methods: {
    vueSetFen() {
      // eslint-disable-next-line
      console.log(this.fenIn);
    },
  },
};
</script>

<style>

</style>
