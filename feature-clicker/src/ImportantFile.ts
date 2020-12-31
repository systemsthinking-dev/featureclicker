
import { Subject, BehaviorSubject, Observable, timer } from "rxjs";
import { scan, delay } from "rxjs/operators";

console.log("Does this happen?");

export type ClickOnFeatureWork = { event: Event };
export type SecondsSinceBegin = number;

export class ImportantThings {
  constructor() {
    this.featureWorkDone = new Subject<ClickOnFeatureWork>();
    this.capabilityStock = new BehaviorSubject<number>(0);
    this.secondsSinceBegin = timer(1000, 1000); // really I want it to start on the first click

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

importantThings.featureWorkDone.subscribe(stuff => { console.log("Got event at time: " + stuff.event?.timeStamp) });
