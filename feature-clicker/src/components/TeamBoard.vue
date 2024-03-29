<template>
  <div class="team-board">
    <div class="team-stats">
      <div class="team-title" v-if="connected">Team {{ teamName }}</div>
      <div class="team-title lack-of-team" v-else>working alone</div>
      <table>
        <thead>
          <tr>
            <th scope="col">resource</th>
            <th scope="col">vps</th>
          </tr>
        </thead>
        <tr v-for="(mate, id) of teammates" :key="id">
          <td>{{ mate.name }}</td>
          <td>{{ Math.round(mate.vps) }}</td>
        </tr>
      </table>
    </div>
    <button
      v-stream:click.stop="teamSystem.triggerReport"
      :class="{ needed: reportNeeded }"
    >
      Integrate
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { of, Observable } from "rxjs";
import {
  ConnectionStatus,
  StatusStatus,
  TeamMemberId,
  TeamMemberScore,
  TeamSystem,
} from "@/system/TeamSystem";
import { map } from "rxjs/operators";
import { withSpan } from "@/tracing";

@Component<TeamBoard>({
  subscriptions() {
    return {
      teammates: this.teamSystem.teamScores,
      connected: this.teamSystem.connectionStatus.pipe(
        map((status) => status === ConnectionStatus.Connected)
      ),
      reportNeeded: this.teamSystem.statusUptodateness.pipe(
        map((traced) =>
          withSpan(
            traced,
            "determine reportNeeded",
            (s) => s === StatusStatus.OutOfDate
          )
        )
      ),
    };
  },
})
export default class TeamBoard extends Vue {
  @Prop({ required: true }) private teamSystem!: TeamSystem;

  public teamName = "Woozles";

  private teammates!: Observable<TeamMemberScore[]>;
}
</script>

<style scoped>
table {
  border: 1px solid black;
  border-collapse: collapse;
  width: 100%;
}
td,
th {
  border: 1px solid black;
}
.team-board {
  border: 3px darkblue solid;
  padding: 5px;
  display: inline-block;
  background-color: white;
  vertical-align: middle;
}

.team-title {
  font-weight: bolder;
  padding: 5px;
}

.team-stats {
  display: inline-block;
  vertical-align: middle;
}

button {
  margin: 10px;
  padding: 10px;
  height: 5em;
  font-weight: bold;
  border-width: 2px;
}
button.needed {
  background-color: coral;
}
button:active {
  background-color: purple;
}

.lack-of-team {
  color: red;
}
</style>
