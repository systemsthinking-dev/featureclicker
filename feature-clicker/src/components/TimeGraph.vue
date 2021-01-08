<template>
  <line-chart :data="chartData" />
</template>

<script lang=ts>
import { Component, Vue } from "vue-property-decorator";

@Component
export default class TimeGraph extends Vue {
  get chartData() {
    return [
      {
        name: "Workout",
        data: {
          "2017-01-01 00:00:00 -0800": 3,
          "2017-01-02 00:00:00 -0800": 4,
        },
      },
      {
        name: "Call parents",
        data: {
          "2017-01-01 00:00:00 -0800": 5,
          "2017-01-02 00:00:00 -0800": 3,
        },
      },
    ];
  }
}
</script>

<style scoped>
</style>
