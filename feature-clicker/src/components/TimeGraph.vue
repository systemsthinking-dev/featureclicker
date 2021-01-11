<template>
  <div>
    <line-chart width="80%" :chartData="chartData" />
  </div>
</template>

<script lang=ts>
import { TeamEvent, TeamMemberId } from "@/system/TeamSystem";
import { ChartData, ChartDataSets } from "chart.js";
import { combineLatest, Observable } from "rxjs";
import { filter, map, scan } from "rxjs/operators";
import { Component, Prop, Vue } from "vue-property-decorator";
import LineChart from "./LineGraph.vue";
import {
  accumulateEvents,
  accumulateTeamVps,
  emptyAccumulator,
  emptyTeamVpsAccumulation,
  teamVpsAccumulationToGraphData,
  toGraphData,
} from "./support/graphdata";

@Component<TimeGraph>({
  components: {
    LineChart,
  },
  subscriptions() {
    const myData: Observable<ChartDataSets> = this.statusEvents.pipe(
      filter((te) => te.from.teamMemberId === this.myTeamMemberId),
      map((te) => te.about),
      scan(accumulateEvents, emptyAccumulator()),
      map(toGraphData)
    );
    const teamData: Observable<ChartDataSets> = this.statusEvents.pipe(
      scan(accumulateTeamVps, emptyTeamVpsAccumulation()),
      map(teamVpsAccumulationToGraphData)
    );
    return {
      chartData: combineLatest([myData, teamData]),
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
