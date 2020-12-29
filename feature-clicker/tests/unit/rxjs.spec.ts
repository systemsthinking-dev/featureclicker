import { Subject, Observable } from "rxjs";

/* eslint-disable */

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