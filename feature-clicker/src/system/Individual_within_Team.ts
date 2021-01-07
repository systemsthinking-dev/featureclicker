/**
 * Yeah, I know the casing is nonstandard
 * I really want to use dashes, to represent that
 * this is an edge. Settling for underscores.
 */

import { Observable, Observer, Subject } from "rxjs";
import { map, withLatestFrom, startWith } from "rxjs/operators";
import { SecondsSinceBegin, ValuePerSecond } from "./IndividualWork";

export type StatusReport = { tick: SecondsSinceBegin; vps: ValuePerSecond } // temporary

export type IndividualInterface = {
  clock: Observable<SecondsSinceBegin>;
  vps: Observable<ValuePerSecond>;
}

export type TeamInterface = {
  individualStatus: Observer<StatusReport>;
}

export class Individual_within_Team {
  public clock = new Subject<SecondsSinceBegin>();
  public vps = new Subject<ValuePerSecond>();

  constructor() {
    this.clock.next(0);
    this.vps.next(0);
  }

  public hookUpIndividual(individual: IndividualInterface) {
    individual.clock.subscribe(this.clock);
    individual.vps.subscribe(this.vps);
  }

  public hookUpTeam(team: TeamInterface) {
    this.clock.pipe(
      withLatestFrom(this.vps),
      map(([tick, vps]) => ({ tick, vps })),
      startWith({ tick: 0, vps: 0 }))
      .subscribe(team.individualStatus);
  }
}
