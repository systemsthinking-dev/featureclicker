import { StatusReport } from "@/system/Individual_within_Team";
// import { ChartDataSets, ChartPoint } from "chart.js";

export type TimeGraphData = [{ name: "vps", data: Record<number, number> }];

export type DataAccumulation = Record<number, number>; // exported only for tests

export const emptyAccumulator: DataAccumulation = {}; // exported only for tests

export function accumulateEvents(accum: DataAccumulation, event: StatusReport): DataAccumulation {
  accum[event.tick] = event.vps;
  return accum;
}

export function toGraphData(accum: DataAccumulation): TimeGraphData {
  return [{
    name: "vps", data: accum
  }];
}
