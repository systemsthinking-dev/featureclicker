/* eslint-disable */
//import { formatSeconds } from "@/components/TotalValueCreated.vue";
import { assert, expect } from "chai";

function formatSeconds(seconds: number): string {
  const prettySeconds = seconds < 10 ? "0" + seconds : seconds;
  return "0:" + prettySeconds;
}

describe("formatSeconds looks nice", () => {
  it("shows 0:00 for 0", () => {
    expect(formatSeconds(0)).to.be.equal("0:00");
  })

  it("shows 0:10 when 10 seconds have passed", () => {
    expect(formatSeconds(10)).to.be.equal("0:10");
  })
})
