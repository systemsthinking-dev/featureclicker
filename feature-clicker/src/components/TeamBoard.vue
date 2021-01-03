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
import { Component, Prop, Vue } from "vue-property-decorator";
import { of, Observable } from "rxjs";
import { TeamMemberScore } from "@/ImportantFile";

@Component<TeamBoard>({
  subscriptions() {
    return {
      teammates: this.teamScores,
    };
  },
})
export default class TeamBoard extends Vue {
  @Prop({ required: true }) private teamScores!: Observable<TeamMemberScore[]>;

  public teamName = "Woozles";

  private teammates!: Observable<TeamMemberScore[]>;
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
