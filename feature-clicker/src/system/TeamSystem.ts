/* eslint-disable */
import { Observable, of, Subject } from "rxjs";
import type { ValuePerSecond, SecondsSinceBegin } from "./IndividualWork";
import { map, scan, withLatestFrom } from "rxjs/operators";
import { v4 as uuid } from "uuid";
import type { Individual_within_Team } from "./Individual_within_Team";
import { wireUpTheWebsocket } from "./backendInterface";

export type TeamMemberScore = { teamMemberId: TeamMemberId; name: TeamMemberName; vps: ValuePerSecond }
export type TeamMemberName = string;
export type TeamMemberId = string;
export type StatusReport = { tick: SecondsSinceBegin; vps: ValuePerSecond } // temporary
export type TeamEvent = {
  from: {
    teamMemberId: TeamMemberId;
    teamMemberName: TeamMemberName;
  }; about: StatusReport;
} // what we receive

const yourName = of("Fred"); // TODO: Wire up an input

export class TeamSystem {
  constructor(backendUrl: string, individualRelationship: Individual_within_Team) {

    const [eventsFromServer, eventsToServer] = wireUpTheWebsocket<TeamEvent>(backendUrl);
    this.eventsFromServer = eventsFromServer;

    this.teamScores = this.eventsFromServer.pipe(scan((accum, e) => {
      console.log("I see an event: ", e);
      accum.push({ teamMemberId: e.from.teamMemberId, name: e.from.teamMemberName, vps: e.about.vps });
      return accum;
    }, [] as Array<TeamMemberScore>)
    );

    const teamMemberId = this.teamMemberId;
    const outgoingStatusReports = new Subject<StatusReport>();
    // wrap status report in message details, so it's the same format we expect to receive
    outgoingStatusReports.pipe(withLatestFrom(yourName),
      map(([myEvent, yourName]) => {
        const te: TeamEvent = { from: { teamMemberId, teamMemberName: yourName }, about: myEvent };
        return te;
      }))
      .subscribe(eventsToServer)

    individualRelationship.hookUpTeam({
      outgoingStatusReports,
    });
  }

  private teamMemberId = uuid();

  public eventsFromServer: Observable<TeamEvent>;

  public teamScores: Observable<TeamMemberScore[]>;
}
