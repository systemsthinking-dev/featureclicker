<script lang="ts">
import type { ChartData } from "chart.js";
import { Line } from "vue-chartjs";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class StupidLineGraph extends Line {
  @Prop({ required: true }) chartData!: ChartData;

  get options() {
    return {};
  }
  mounted() {
    this.renderChart(this.chartData, this.options);
  }
}
</script>