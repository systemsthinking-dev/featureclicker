/**
 * Yeah, I know the casing is nonstandard
 * I really want to use dashes, to represent that
 * this is an edge. Settling for underscores.
 */

import { Observable, Observer, ReplaySubject, Subject } from "rxjs";
import { StatusReport } from "./TeamSystem";

export type IndividualInterface = {
  statusReports: Observable<StatusReport>;
}

export type TeamInterface = {
  outgoingStatusReports: Observer<StatusReport>;
}

export class Individual_within_Team {
  public statusReportSubject = new ReplaySubject<StatusReport>();

  constructor() {
    this.statusReportSubject.subscribe(s => console.log("There is a status report", s));
  }

  public hookUpIndividual(individual: IndividualInterface) {
    individual.statusReports.subscribe(this.statusReportSubject);
  }

  public hookUpTeam(team: TeamInterface) {
    this.statusReportSubject.subscribe(team.outgoingStatusReports);
  }
}
