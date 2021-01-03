<template>
  <div class="team-board">
    <div class="team-title">Team {{ teamName }}</div>
    <ul>
      <li v-for="mate in teammates" :key="mate.teamMemberId">
        {{ mate.name }} {{ mate.vps }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { of, Observable } from "rxjs";
import { TeamMemberScore } from "@/ImportantFile";

@Component({
  subscriptions() {
    return {
      teammates: of([{ teamMemberId: "2l34kj3;kf;e", name: "Jim", vps: 42 }]),
    };
  },
})
export default class TeamBoard extends Vue {
  public teamName = "Woozles";

  private teammates!: Observable<TeamMemberScore>;
}
</script>

<style scoped>
.team-board {
  border: 3px darkblue solid;
  padding: 5px;
  display: inline-block;
  background-color: white;
}

.team-title {
  font-weight: bold;
}
</style>
