<template>
  <div id="app">
    <main class="hello">
      <div class="one">
        <div class="title">{{ msg }}</div>
        <NameInput v-stream:nameChange="teamSystem.memberNameChangeEvent" />
      </div>
      <TeamBoard :teamSystem="teamSystem" />
      <HelloWorld :individualWork="individualWork" />
      <TimeGraph :statusEvents="teamSystem.eventsFromServer" />
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
import VueRx from "vue-rx";
import HelloWorld from "./components/HelloWorld.vue";
import TeamBoard from "./components/TeamBoard.vue";
import NameInput from "./components/NameInput.vue";
import TimeGraph from "./components/TimeGraph.vue";
import { IndividualWork } from "./system/IndividualWork";
import { TeamSystem } from "./system/TeamSystem";
import { Individual_within_Team } from "./system/Individual_within_Team";

Vue.use(VueRx);

// set up the websockets
const backendUrl = process.env.VUE_APP_BACKEND;
console.log("The backend is at: " + backendUrl);

const relationship = new Individual_within_Team();
const individualWork = new IndividualWork(relationship);
const teamSystem = new TeamSystem(backendUrl, relationship);

// @ts-ignore
window.things = individualWork; // play in the console

@Component({
  components: {
    HelloWorld,
    NameInput,
    TeamBoard,
    TimeGraph,
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

.one {
  display: inline-block;
  vertical-align: middle;
}

.title {
  font-weight: bold;
  font-size: x-large;
  padding: 20px;
}
</style>
