
import { packageAsNewTrace, Traced } from "@/tracing";
import { Subject, BehaviorSubject, Observable, timer, combineLatest } from "rxjs";
import { scan, delay, first, mergeMap, startWith, withLatestFrom, map } from "rxjs/operators";
import { sendSomethingToHoneycomb } from "./honeycomb";
import type { Individual_within_Team } from "./Individual_within_Team";

console.log("Does this happen?");

export type ClickOnFeatureWork = { event: Event };
export type SecondsSinceBegin = number;
export type ValueCreated = number;
export type ValuePerSecond = number;
type CapabilityStockGeneratedPerClickOfWork = number;




export class IndividualWork {
  constructor(teamRelationship: Individual_within_Team) {
    this.featureWorkDone = new Subject<ClickOnFeatureWork>();
    this.capabilityStock = new BehaviorSubject<ValuePerSecond>(0);
    this.totalValueCreated = new BehaviorSubject<ValueCreated>(0);
    const everySecond = timer(0, 1000).pipe(map(seconds =>
      packageAsNewTrace("tick", seconds, { tick: seconds })));
    this.secondsSinceBegin = this.featureWorkDone.pipe(
      first(), // on the first click,
      mergeMap(_firstClickStartsTheClock => everySecond), // start emitting numbers every second
      startWith(packageAsNewTrace("starting value of secondsSinceBegin in IndividualWork", 0))); // before that, be 0

    const teamCapabilityStock: Subject<ValuePerSecond> = new BehaviorSubject(0);
    const valueOfEachClick: Observable<CapabilityStockGeneratedPerClickOfWork> =
      combineLatest([teamCapabilityStock, this.capabilityStock]).pipe(
        map(([teamVps, myVps]) => {
          //console.log("Got team VPS: " + teamVps + " and myVPS " + myVps);
          if (myVps === 0) {
            return 1;
          }
          const nonzeroTeamVps = Math.max(myVps, teamVps); // maybe no one has reported; my work counts then.
          const percentageOfCapabilitiesThatIWrote = myVps / nonzeroTeamVps;
          // Vary the amount of capability added for each click of work I do, based on my familiarity with the codebase.
          // https://www.wolframalpha.com/input/?i=plot+-0.25%2F%28x-1.1%29
          // x = percentageOfCapabilitiesThatIWrote
          // y = capabilityAddedWhenIClick 
          // When I wrote all the work, x = 1, so y = 4. We get 4 vps per click
          // When I wrote none of the work, x = 0, so y = 0.23. I get very little work per click.
          const capabilityAddedWhenIClick = (-0.25) / (percentageOfCapabilitiesThatIWrote - 1.1);
          sendSomethingToHoneycomb({
            "name": "calculateValueOfClick",
            "input.teamVps": teamVps, "input.myVps": myVps,
            "capabilityAddedWhenIClick": capabilityAddedWhenIClick
          })
          return capabilityAddedWhenIClick;
        })
      );
    const workFlowingIntoCapabilities: Observable<number> = this.featureWorkDone.pipe(
      withLatestFrom(valueOfEachClick),
      scan((countSoFar, [_click, valueOfEachClick]) => countSoFar + valueOfEachClick, 0),
      delay(2000),
    );

    workFlowingIntoCapabilities.subscribe(this.capabilityStock);

    const valueFlowingFromCapabilities: Observable<number> =
      this.secondsSinceBegin.pipe(withLatestFrom(this.capabilityStock), map(([_tick, vps]) => vps));

    valueFlowingFromCapabilities.pipe(scan((accum, moreValue) => accum + moreValue, 0)).subscribe(this.totalValueCreated);



    teamRelationship.hookUpIndividual({
      clock: this.secondsSinceBegin, vps: this.capabilityStock, teamCapabilityStock
    });
  }

  public featureWorkDone: Subject<ClickOnFeatureWork>;

  public capabilityStock: BehaviorSubject<ValuePerSecond>; // TODO: I think all these should be exposed as Observable

  public secondsSinceBegin: Observable<Traced<SecondsSinceBegin>>;

  public totalValueCreated: BehaviorSubject<ValueCreated>;

}

export const fakeIndividualWork: IndividualWork = {

} as IndividualWork;
