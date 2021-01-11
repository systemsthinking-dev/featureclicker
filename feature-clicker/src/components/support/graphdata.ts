import { ValuePerSecond } from "@/system/IndividualWork";
import { StatusReport } from "@/system/Individual_within_Team";
import { TeamEvent, TeamMemberId } from "@/system/TeamSystem";
import { ChartData, ChartDataSets, ChartPoint } from "chart.js";
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

export type TeamVpsAccumulation = { datapoints: ChartPoint[], currentVpsByPerson: Record<TeamMemberId, ValuePerSecond> };
export const emptyTeamVpsAccumulation = { datapoints: [], currentVpsByPerson: {} };
export function accumulateTeamVps(accum: TeamVpsAccumulation, event: TeamEvent): TeamVpsAccumulation {
  accum.datapoints.push({ x: event.about.tick, y: event.about.vps });
  return accum;
}

export function teamVpsAccumulationToGraphData(accum: TeamVpsAccumulation): ChartDataSets {
  return { label: "team vps", data: accum.datapoints }
}