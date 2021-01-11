import { accumulateEvents, accumulateTeamVps, emptyAccumulator, emptyTeamVpsAccumulation, teamVpsAccumulationToGraphData, toGraphData } from "@/components/support/graphdata";
import { StatusReport } from "@/system/Individual_within_Team";
import { TeamEvent } from "@/system/TeamSystem";
import { assert } from "chai";
import { ChartData, ChartDataSets } from "chart.js";


describe("converting status reports into graph data", () => {
  it("makes an empty graph for no data", () => {
    const result = toGraphData(emptyAccumulator);
    const emptyGraph = {
      datasets: [{
        label: "vps",
        data: [],
      }]
    };
    assert.deepEqual(result, emptyGraph);
  });
  it("does a simple thing", () => {
    const inputEvents: StatusReport[] = [
      { tick: 0, vps: 0 },
      { tick: 1, vps: 1 },
      { tick: 4, vps: 10 }];
    const accumulated = inputEvents.reduce(accumulateEvents, emptyAccumulator);
    const result = toGraphData(accumulated);
    const likeThis: ChartData = {
      datasets: [{
        label: "vps",
        data: [
          { x: 0, y: 0 },
          { x: 1, y: 1 },
          { x: 4, y: 10 },
        ],
      }]
    };
    assert.deepEqual(result, likeThis, "Make sure it can fail");
  });
});


describe("Converting team events to a series of total VPS over time", () => {
  it("returns a single record", () => {
    const teamEvents: TeamEvent[] = [{
      from: { teamMemberId: "aaa", teamMemberName: "Fred" },
      about: { tick: 1, vps: 3 }
    }];
    const accumulated = teamEvents.reduce(accumulateTeamVps, emptyTeamVpsAccumulation);
    const result = teamVpsAccumulationToGraphData(accumulated);

    const expected: ChartDataSets = { label: "team vps", data: [{ x: 1, y: 3 }] };
    assert.deepEqual(result, expected, "single case");

  })
})