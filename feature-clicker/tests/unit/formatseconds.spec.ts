/* eslint-disable */
import { formatSeconds } from "@/components/TotalValueCreated.vue";
import { assert, expect } from "chai";


describe("formatSeconds looks nice", () => {
  it("shows 0:00 for 0", () => {
    expect(formatSeconds(0)).to.be.equal("0:00");
  })

  it("shows 0:10 when 10 seconds have passed", () => {
    expect(formatSeconds(10)).to.be.equal("0:10");
  })

  it("shows 1:00 for 60 seconds", () => {
    expect(formatSeconds(60)).to.be.equal("1:00");
  })


  it("shows 1:10:00 for an hour and ten minutes", () => {
    expect(formatSeconds(60 * 60 + 600)).to.be.equal("1:10:00");
  })


  it("shows 1:01:00 for an hour and one minute", () => {
    expect(formatSeconds(60 * 60 + 60)).to.be.equal("1:01:00");
  })


})
