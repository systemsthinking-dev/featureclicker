<template>
  <div id="app">
    <main class="hello">
      <span class="title">{{ msg }}</span>
      <TeamBoard :teamScores="teamSystem.teamScores" />
      <HelloWorld :individualWork="individualWork" />
    </main>

    <a href="https://systemsthinking.dev" target="_blank">
      <img
        alt="SystemsThinking.dev logo"
        class="stdev-logo"
        src="./assets/logo.png"
      />
    </a>
    <a
      href="https://github.com/systemsthinking-dev/featureclicker"
      target="_blank"
    >
      <img alt="GitHub" class="github-logo" src="./assets/GitHub_Logo.png" />
    </a>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "./components/HelloWorld.vue";
import TeamBoard from "./components/TeamBoard.vue";
import { IndividualWork } from "./system/IndividualWork";
import { TeamSystem } from "./system/TeamSystem";
import VueRx from "vue-rx";
import { webSocket } from "rxjs/webSocket";
import { Subject } from "rxjs";

Vue.use(VueRx);

// set up the websockets
const backendUrl = process.env.VUE_APP_BACKEND;
console.log("The backend is at: " + backendUrl);

const individualWork = new IndividualWork();
const teamSystem = new TeamSystem(backendUrl);

// @ts-ignore
window.things = individualWork; // play in the console

@Component({
  components: {
    HelloWorld,
    TeamBoard,
  },
})
export default class App extends Vue {
  private msg = "Software Development Simulator";

  get individualWork() {
    return individualWork;
  }

  get teamSystem() {
    return teamSystem;
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

.github-logo {
  width: 100px;
}

.stdev-logo {
  width: 20%;
  margin: 20px;
  background-color: white;
  padding: 10px;
}

body {
  background: rgb(0, 212, 255);
  background: linear-gradient(
    90deg,
    rgba(0, 212, 255, 1) 0%,
    rgba(225, 236, 245, 1) 50%,
    rgba(0, 212, 255, 1) 100%
  );
}

.title {
  font-weight: bold;
  font-size: x-large;
  padding: 20px;
}
</style>
