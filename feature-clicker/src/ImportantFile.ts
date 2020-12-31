
import { Subject, BehaviorSubject, Observable, timer } from "rxjs";
import { scan, delay, first, mergeMap, startWith, withLatestFrom, map } from "rxjs/operators";

console.log("Does this happen?");

export type ClickOnFeatureWork = { event: Event };
export type SecondsSinceBegin = number;
export type ValueCreated = number;

export class ImportantThings {
  constructor() {
    this.featureWorkDone = new Subject<ClickOnFeatureWork>();
    this.capabilityStock = new BehaviorSubject<number>(0);
    this.totalValueCreated = new BehaviorSubject<ValueCreated>(0);
    this.secondsSinceBegin = this.featureWorkDone.pipe(
      first(), // on the first click,
      mergeMap(_t => timer(0, 1000)), // start emitting numbers every second
      startWith(0)); // before that, be 0

    const workFlowingIntoCapabilities: Observable<number> = this.featureWorkDone.pipe(
      scan(countSoFar => countSoFar + 1, 0),
      delay(2000)
    );

    workFlowingIntoCapabilities.subscribe(this.capabilityStock);

    const valueFlowingFromCapabilities: Observable<number> =
      this.secondsSinceBegin.pipe(withLatestFrom(this.capabilityStock), map(([_tick, vps]) => vps));

    valueFlowingFromCapabilities.pipe(scan((accum, moreValue) => accum + moreValue, 0)).subscribe(this.totalValueCreated);
  }

  public featureWorkDone: Subject<ClickOnFeatureWork>;

  public capabilityStock: BehaviorSubject<number>;

  public secondsSinceBegin: Observable<SecondsSinceBegin>;

  public totalValueCreated: BehaviorSubject<ValueCreated>;
}

export const importantThings = new ImportantThings();

// @ts-ignore
window.things = importantThings;

// importantThings.featureWorkDone.subscribe(stuff => { console.log("Got event at time: " + stuff.event?.timeStamp) });
