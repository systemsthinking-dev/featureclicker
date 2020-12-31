
import { Subject, BehaviorSubject, Observable, timer } from "rxjs";
import { scan, delay, first, mergeMap, startWith } from "rxjs/operators";

console.log("Does this happen?");

export type ClickOnFeatureWork = { event: Event };
export type SecondsSinceBegin = number;

export class ImportantThings {
  constructor() {
    this.featureWorkDone = new Subject<ClickOnFeatureWork>();
    this.capabilityStock = new BehaviorSubject<number>(0);
    this.secondsSinceBegin = this.featureWorkDone.pipe(
      first(),
      mergeMap(_t => timer(0, 1000)),
      startWith(0)); // start on the first click

    const thing: Observable<number> = this.featureWorkDone.pipe(
      scan(countSoFar => countSoFar + 1, 0),
      delay(2000)
    );

    thing.subscribe(this.capabilityStock);
  }

  public featureWorkDone: Subject<ClickOnFeatureWork>;

  public capabilityStock: BehaviorSubject<number>;

  public secondsSinceBegin: Observable<SecondsSinceBegin>;
}

export const importantThings = new ImportantThings();

// @ts-ignore
window.things = importantThings;

// importantThings.featureWorkDone.subscribe(stuff => { console.log("Got event at time: " + stuff.event?.timeStamp) });
