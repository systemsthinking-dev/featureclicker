import { StatusReport } from "@/system/Individual_within_Team";
import { ChartData, ChartDataSets, ChartPoint } from "chart.js";

export type TimeGraphData = [ChartDataSets];

export type DataAccumulation = ChartPoint[]; // exported only for tests

export const emptyAccumulator: DataAccumulation = []; // exported only for tests

export function accumulateEvents(accum: DataAccumulation, event: StatusReport): DataAccumulation {
  accum.push({ x: event.tick, y: event.vps })
  return accum;
}

export function toGraphData(accum: DataAccumulation): ChartData {
  return {
    labels: ["vps"],
    datasets: [{ xAxisID: "seconds since you started work", data: accum }]
  };
}
