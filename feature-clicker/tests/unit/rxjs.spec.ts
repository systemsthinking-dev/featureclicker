import { Subject, Observable } from "rxjs";
import { expect } from "chai";
import { allRecent, Timestamped } from "@/TryThis";
import * as fc from "fast-check";
import { sortBy, last } from "lodash";

/* eslint-disable */

describe("allRecent", () => {
  const timestampedGenerator = fc.integer(0, 12).map(i => ({ timestamp: i }));
  const intervalGenerator = fc.integer(0, 10);
  const listOfTimestampedGenerator = fc.array(timestampedGenerator, { minLength: 1, maxLength: 10 }).map(a => sortBy(a, "timestamp"));

  it("In a sequence of calls with elements of increasing timestamp, the output always includes the most recent", () => {
    fc.assert(fc.property(listOfTimestampedGenerator, intervalGenerator, (arr, interval) => {
      let soFar: Array<Timestamped> = [];
      //let descriptionSoFar = "";
      arr.forEach(elem => {
        const countBefore = soFar.length;
        const firstWithinInterval = soFar.findIndex(e => e.timestamp > (elem.timestamp - interval));
        const keepQuantity = firstWithinInterval === -1 ? 0 : countBefore - firstWithinInterval;
        soFar = allRecent(interval)(soFar, elem);
        //descriptionSoFar = descriptionSoFar + JSON.stringify(elem) + " got us " + JSON.stringify(soFar) + " ...then... ";
        // always that last one is in there
        expect(last(soFar)).to.deep.equal(elem, "the current element is always last."); // happened: " + descriptionSoFar);
        // they continue to be in order
        expect(soFar).to.deep.equal(sortBy(soFar, "timestamp"), "the array is still sorted");
        // the oldest one is within the interval
        expect(soFar[0].timestamp).to.be.greaterThan(elem.timestamp - interval - 0.1 /* or equal */,
          "The oldest one is within the interval."); // Happened: " + descriptionSoFar);
        // only old ones were removed
        expect(soFar.length).to.equal(keepQuantity + 1 /* the element added */); //, "Happened: " + descriptionSoFar);
      });
    }));
  })


});

describe("how to test rxjs stuff", () => {
  it("tells me it received a thing", () => {
    // given a Subject B , I can subscribe it to an observable A , 
    // send something Foo to observable A,
    // and then subscribe observer C to the Subject,
    // and then observer C receives something Foo.
    const A = new Subject();
    const foo = "Foo";
    const B = new Observable((observer) => { observer.next(foo) });
  });
});