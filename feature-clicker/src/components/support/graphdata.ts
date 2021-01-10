import { StatusReport } from "@/system/Individual_within_Team";
import { ChartData, ChartPoint } from "chart.js";
// import { ChartDataSets, ChartPoint } from "chart.js";

export type DataAccumulation = ChartPoint[]; // exported only for tests

export const emptyAccumulator: DataAccumulation = []; // exported only for tests

export function accumulateEvents(accum: DataAccumulation, event: StatusReport): DataAccumulation {
  accum.push({ x: event.tick, y: event.vps });
  return accum;
}

export function toGraphData(accum: DataAccumulation): ChartData {
  return {
    datasets: [{
      label: "vps",
      data: accum
    }]
  };
}
