<template>
  <div>
    <StupidLineGraph :chartData="chartData" />
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
import StupidLineGraph from "./StupidLineGraph.vue";

@Component<TimeGraph>({
  components: {
    StupidLineGraph,
  },
  subscriptions() {
    return {
      chartData: this.statusEvents.pipe(
        map((te) => te.about),
        scan(accumulateEvents, emptyAccumulator),
        map(toGraphData),
        map((gd) => {
          return gd;
        })
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
  width: 80%;
  margin: auto;
}
</style>
