<template>
  <div id="app">
    <HelloWorld :msg="thinger" :importantThings="importantThings" />
    <a href="https://systemsthinking.dev">
      <img
        alt="SystemsThinking.dev logo"
        class="stdev-logo"
        src="./assets/logo.png"
      />
    </a>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "./components/HelloWorld.vue";
import { importantThings } from "./ImportantFile";
import VueRx from "vue-rx";

Vue.use(VueRx);

@Component({
  components: {
    HelloWorld,
  },
})
export default class App extends Vue {
  get importantThings() {
    return importantThings;
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.stdev-logo {
  width: 20%;
  margin: 20px;
}
</style>
