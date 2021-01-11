
import { Subject, BehaviorSubject, Observable, timer } from "rxjs";
import { scan, delay, first, mergeMap, startWith, withLatestFrom, map } from "rxjs/operators";
import type { Individual_within_Team } from "./Individual_within_Team";

console.log("Does this happen?");

export type ClickOnFeatureWork = { event: Event };
export type SecondsSinceBegin = number;
export type ValueCreated = number;
export type ValuePerSecond = number;

export class IndividualWork {
  constructor(teamRelationship: Individual_within_Team) {
    this.featureWorkDone = new Subject<ClickOnFeatureWork>();
    this.capabilityStock = new BehaviorSubject<ValuePerSecond>(0);
    this.totalValueCreated = new BehaviorSubject<ValueCreated>(0);
    this.secondsSinceBegin = this.featureWorkDone.pipe(
      first(), // on the first click,
      mergeMap(_t => timer(0, 1000)), // start emitting numbers every second
      startWith(0)); // before that, be 0

    const valueOfEachClick = 1;
    const workFlowingIntoCapabilities: Observable<number> = this.featureWorkDone.pipe(
      scan(countSoFar => countSoFar + valueOfEachClick, 0),
      delay(2000)
    );

    workFlowingIntoCapabilities.subscribe(this.capabilityStock);

    const valueFlowingFromCapabilities: Observable<number> =
      this.secondsSinceBegin.pipe(withLatestFrom(this.capabilityStock), map(([_tick, vps]) => vps));

    valueFlowingFromCapabilities.pipe(scan((accum, moreValue) => accum + moreValue, 0)).subscribe(this.totalValueCreated);

    teamRelationship.hookUpIndividual({
      clock: this.secondsSinceBegin, vps: this.capabilityStock
    });
  }

  public featureWorkDone: Subject<ClickOnFeatureWork>;

  public capabilityStock: BehaviorSubject<ValuePerSecond>; // TODO: I think all these should be exposed as Observable

  public secondsSinceBegin: Observable<SecondsSinceBegin>;

  public totalValueCreated: BehaviorSubject<ValueCreated>;

}

export const fakeIndividualWork: IndividualWork = {

} as IndividualWork;
