<template>
  <div class="team-board">Team {{ teamName }}</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class TeamBoard extends Vue {
  public teamName = "Woozles";
}
</script>

<style scoped>
.team-board {
  border: 3px darkblue solid;
  padding: 5px;
  display: inline;
  background-color: white;
}
</style>
