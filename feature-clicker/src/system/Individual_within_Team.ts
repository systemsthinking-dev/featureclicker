/**
 * Yeah, I know the casing is nonstandard
 * I really want to use dashes, to represent that
 * this is an edge. Settling for underscores.
 */

import { Traced, tracedInSpan } from "@/tracing";
import { combineLatest, merge, Observable, Observer, Subject } from "rxjs";
import { map, withLatestFrom, startWith, pluck } from "rxjs/operators";
import { SecondsSinceBegin, ValuePerSecond } from "./IndividualWork";
import { TeamVpsAtTime } from "./TeamSystem";

export type StatusReport = { tick: SecondsSinceBegin; vps: ValuePerSecond } // temporary

export function isDifferentStatus(a: StatusReport, b: StatusReport): boolean {
  // the tick doesn't matter
  return a.vps !== b.vps;
}

export type IndividualInterface = {
  clock: Observable<Traced<SecondsSinceBegin>>;
  vps: Observable<ValuePerSecond>;
  teamCapabilityStock: Observer<ValuePerSecond>;
}

export type TeamInterface = {
  individualStatus: Observer<StatusReport>;
  teamCapabilityStockAtTime: Observable<TeamVpsAtTime>;
}

export class Individual_within_Team {
  public clock = new Subject<Traced<SecondsSinceBegin>>();
  public vps = new Subject<ValuePerSecond>();
  public teamCapabilityStockAtTime = new Subject<TeamVpsAtTime>();

  constructor() {
    this.clock.next(0);
    this.vps.next(0);
  }

  public hookUpIndividual(individual: IndividualInterface) {
    individual.clock.subscribe(this.clock);
    individual.vps.subscribe(this.vps);
    this.teamCapabilityStockAtTime.pipe(pluck('total')).subscribe(
      individual.teamCapabilityStock)
  }

  public hookUpTeam(team: TeamInterface) {
    // fire whenever vps changes or the clock ticks
    combineLatest([this.vps, this.clock]).pipe(
      map<[ValuePerSecond, Traced<SecondsSinceBegin>], Traced<{ tick: SecondsSinceBegin, vps: ValuePerSecond }>>(
        ([vps, tracedTick]) => {
          const tick = tracedTick.data;
          return tracedInSpan(tracedTick.trace, { tick, vps })
        }),
      startWith({ tick: 0, vps: 0 }))
      .subscribe(team.individualStatus);
    team.teamCapabilityStockAtTime.subscribe(this.teamCapabilityStockAtTime);
  }
}
