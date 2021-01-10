<template>
  <div>
    <line-chart width="80%" :data="chartData" />
  </div>
</template>

<script lang=ts>
import { TeamEvent } from "@/system/TeamSystem";
import { Observable } from "rxjs";
import { map, scan } from "rxjs/operators";
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  accumulateEvents,
  emptyAccumulator,
  toGraphData,
} from "./support/graphdata";

@Component<TimeGraph>({
  subscriptions() {
    return {
      chartData: this.statusEvents.pipe(
        map((te) => te.about),
        scan(accumulateEvents, emptyAccumulator),
        map(toGraphData)
      ),
    };
  },
})
export default class TimeGraph extends Vue {
  @Prop({ required: true }) statusEvents!: Observable<TeamEvent>;
}
</script>

<style scoped>
div {
  margin: auto;
}
</style>
