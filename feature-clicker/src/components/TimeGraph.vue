<template>
  <div>
    <line-chart width="80%" :chartData="chartData" />
  </div>
</template>

<script lang=ts>
import { TeamEvent, TeamMemberId } from "@/system/TeamSystem";
import { ChartData } from "chart.js";
import { Observable } from "rxjs";
import { filter, map, scan } from "rxjs/operators";
import { Component, Prop, Vue } from "vue-property-decorator";
import LineChart from "./LineGraph.vue";
import {
  accumulateEvents,
  emptyAccumulator,
  toGraphData,
} from "./support/graphdata";

@Component<TimeGraph>({
  components: {
    LineChart,
  },
  subscriptions() {
    return {
      chartData: this.statusEvents.pipe(
        filter((te) => te.from.teamMemberId === this.myTeamMemberId),
        map((te) => te.about),
        scan(accumulateEvents, emptyAccumulator()),
        map(toGraphData),
        map((a) => [a])
      ),
      // moreData: this.statusEvents.pipe(
      //   scan((accum, ev) => { return accum}, {}),
      //   map((accum) => )
      // )
    };
  },
})
export default class TimeGraph extends Vue {
  @Prop({ required: true }) myTeamMemberId!: TeamMemberId;
  @Prop({ required: true }) statusEvents!: Observable<TeamEvent>;

  private chartData!: Observable<ChartData>;
}
</script>

<style scoped>
div {
  margin: auto;
  width: 80%;
}
</style>
