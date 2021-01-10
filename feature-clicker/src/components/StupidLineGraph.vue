<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import type { ChartData } from "chart.js";
import { Line } from "vue-chartjs";

@Component({ mixins: [Line] })
export default class StupidLineGraph extends Vue {
  @Prop({ required: true }) chartData!: ChartData;

  get options() {
    return {};
  }
  mounted() {
    this.renderChart(this.chartData, this.options);
  }
}
</script>