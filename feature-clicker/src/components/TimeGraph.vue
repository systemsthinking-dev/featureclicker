<template>
  <line-chart :data="chartData" />
</template>

<script lang=ts>
import { TeamEvent } from "@/system/TeamSystem";
import { Observable } from "rxjs";
import { scan } from "rxjs/operators";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component<TimeGraph>({
  subscriptions() {
    return {
      // chartData: this.statusEvents.pipe(
      //   scan((eventsToGraph, e) => {
      //     return eventsToGraph;
      //   }),
      // ),
    };
  },
})
export default class TimeGraph extends Vue {
  @Prop({ required: true }) statusEvents!: Observable<TeamEvent>;

  get chartData() {
    return [
      {
        name: "vps",
        data: {
          0: 0,
          1: 1,
          4: 10,
        },
      },
    ];
  }
}
</script>

<style scoped>
</style>
