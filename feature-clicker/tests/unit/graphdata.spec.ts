import { accumulateEvents, emptyAccumulator, TimeGraphData, toGraphData } from "@/components/support/graphdata";
import { StatusReport } from "@/system/Individual_within_Team";
import { assert } from "chai";


describe("converting status reports into graph data", () => {
  it("makes an empty graph for no data", () => {
    const result = toGraphData(emptyAccumulator);
    const emptyGraph = [{
      name: "vps",
      data: {},
    }];
    assert.deepEqual(result, emptyGraph);
  });
  it("does a simple thing", () => {
    const inputEvents: StatusReport[] = [
      { tick: 0, vps: 0 },
      { tick: 1, vps: 1 },
      { tick: 4, vps: 10 }];
    const accumulated = inputEvents.reduce(accumulateEvents, emptyAccumulator);
    const result = toGraphData(accumulated);
    const likeThis: TimeGraphData = [{
      name: "vps",
      data: {
        0: 0,
        1: 1,
        4: 10,
      }
    }];
    assert.deepEqual(result, likeThis, "Make sure it can fail");
  });
});
