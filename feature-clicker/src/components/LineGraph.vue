<template>
  <div>
    <canvas id="yoyoiamthechart" ref="canvas" />
  </div>
</template>

<script lang=ts>
import { Component, Prop, Vue } from "vue-property-decorator";
import Chart, { ChartConfiguration, ChartData, ChartOptions } from "chart.js";

@Component({
  data() {
    return {
      _chart: null, // not sure why
    };
  },
})
export default class LineChart extends Vue {
  @Prop({ required: true }) private chartData!: ChartData;

  created() {
    console.log("CREATED was called");
    this.$watch("chartData", this.dataHandler);
  }

  get options(): ChartOptions {
    // somewhat pilfered from chartkick.js
    return {
      scales: {
        xAxes: [
          {
            type: "linear",
            gridLines: {
              drawOnChartArea: false,
            },
            scaleLabel: {
              display: true,
              labelString: "time (seconds) since you started work",
              fontSize: 16,
              // fontStyle: "bold",
              fontColor: "#333",
            },
            time: {},
            ticks: { min: 0 },
          },
        ],
        yAxes: [
          {
            ticks: {
              min: 0,
              maxTicksLimit: 4,
            },
            scaleLabel: {
              display: true,
              labelString: "capability units",
              fontSize: 16,
              // fontStyle: "bold",
              fontColor: "#333",
            },
          },
        ],
      },
    };
  }

  private renderChart() {
    console.log("I am rendering the chart.");
    if (this.$data._chart) this.$data._chart.destroy();
    const canvas: HTMLCanvasElement = this.$refs.canvas as HTMLCanvasElement;
    const chartConfiguration: ChartConfiguration = {
      type: "line",
      data: this.chartData,
      options: this.options,
    };
    this.$data._chart = new Chart(canvas.getContext("2d")!, chartConfiguration);
  }

  mounted() {
    this.renderChart();
  }

  beforeDestroy() {
    if (this.$data._chart) {
      this.$data._chart.destroy();
    }
  }

  /**
   * This code was pilfered from: https://github.com/apertureless/vue-chartjs/blob/b947123fed793d1834c45ab2cc03a5fe0dc990cf/src/mixins/index.js
   *
   * i couldn't use their library because the types are a lie.
   * So I consulted their code.
   */
  private dataHandler(newData: ChartData, oldData: ChartData) {
    console.log("DATA HANDLER was called");
    if (oldData) {
      let chart = this.$data._chart;

      // Get new and old DataSet Labels
      let newDatasetLabels = newData.datasets!.map((dataset) => {
        return dataset.label;
      });

      let oldDatasetLabels = oldData.datasets!.map((dataset) => {
        return dataset.label;
      });

      // Stringify 'em for easier compare
      const oldLabels = JSON.stringify(oldDatasetLabels);
      const newLabels = JSON.stringify(newDatasetLabels);

      // Check if Labels are equal and if dataset length is equal
      if (
        newLabels === oldLabels &&
        oldData.datasets!.length === newData.datasets!.length
      ) {
        newData.datasets!.forEach((dataset, i) => {
          // Get new and old dataset keys
          const oldDatasetKeys = Object.keys(oldData.datasets![i]);
          const newDatasetKeys = Object.keys(dataset);

          // Get keys that aren't present in the new data
          const deletionKeys = oldDatasetKeys.filter((key) => {
            return key !== "_meta" && newDatasetKeys.indexOf(key) === -1;
          });

          // Remove outdated key-value pairs
          deletionKeys.forEach((deletionKey) => {
            delete chart.data.datasets[i][deletionKey];
          });

          // Update attributes individually to avoid re-rendering the entire chart
          for (const attribute in dataset) {
            if (dataset.hasOwnProperty(attribute)) {
              // @ts-ignore
              chart.data.datasets[i][attribute] = dataset[attribute];
            }
          }
        });

        if (newData.hasOwnProperty("labels")) {
          chart.data.labels = newData.labels;
        }
        chart.update();
      } else {
        if (chart) {
          chart.destroy();
        }
        this.renderChart();
      }
    } else {
      if (this.$data._chart) {
        this.$data._chart.destroy();
      }
      this.renderChart();
    }
  }
}

//   dataset { backgroundColor: chart.options.colors || defaultColors
const defaultColors = [
  "#3366CC",
  "#DC3912",
  "#FF9900",
  "#109618",
  "#990099",
  "#3B3EAC",
  "#0099C6",
  "#DD4477",
  "#66AA00",
  "#B82E2E",
  "#316395",
  "#994499",
  "#22AA99",
  "#AAAA11",
  "#6633CC",
  "#E67300",
  "#8B0707",
  "#329262",
  "#5574A6",
  "#651067",
];
</script>

<style scoped>
</style>
