import { ValuePerSecond } from "@/system/IndividualWork";
import { StatusReport } from "@/system/Individual_within_Team";
import { TeamEvent, TeamMemberId } from "@/system/TeamSystem";
import { ChartData, ChartDataSets, ChartPoint } from "chart.js";
// import { ChartDataSets, ChartPoint } from "chart.js";

export type DataAccumulation = ChartPoint[]; // exported only for tests

export function emptyAccumulator(): DataAccumulation { return [] }; // exported only for tests

export function accumulateEvents(accum: DataAccumulation, event: StatusReport): DataAccumulation {
  accum.push({ x: event.tick, y: event.vps });
  return accum;
}

export function toGraphData(accum: DataAccumulation): ChartDataSets {
  return {
    label: "vps",
    data: accum
  };
}

export type TeamVpsAccumulation = { datapoints: ChartPoint[], currentVpsByPerson: Record<TeamMemberId, ValuePerSecond> };
export function emptyTeamVpsAccumulation() { return { datapoints: [], currentVpsByPerson: {} } };
export function accumulateTeamVps(accum: TeamVpsAccumulation, event: TeamEvent): TeamVpsAccumulation {
  accum.currentVpsByPerson[event.from.teamMemberId] = event.about.vps;
  const total = Object.values(accum.currentVpsByPerson).reduce((a, v) => a + v, 0);
  accum.datapoints.push({ x: event.when, y: total });
  return accum;
}

export function teamVpsAccumulationToGraphData(accum: TeamVpsAccumulation): ChartDataSets {
  return { label: "team vps", data: accum.datapoints }
}