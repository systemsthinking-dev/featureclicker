/* eslint-disable */
import { BehaviorSubject, Observable, Observer, of, Subject } from "rxjs";
import type { ValuePerSecond, SecondsSinceBegin } from "./IndividualWork";
import { map, scan, startWith, withLatestFrom } from "rxjs/operators";
import { v4 as uuid } from "uuid";
import type { Individual_within_Team } from "./Individual_within_Team";
import { ConnectionStatus, wireUpTheWebsocket } from "./backendInterface";

//export type TeamConnectionStatus = Connected | NotYetConnected | Failed
export { ConnectionStatus } from "./backendInterface";
export type TeamMemberScore = { teamMemberId: TeamMemberId; name: TeamMemberName; vps: ValuePerSecond }
export type TeamMemberName = string;
export type TeamMemberId = string;
export type TeamStatusSummary = Record<TeamMemberId, StatusReport & { name: TeamMemberName }>;
export type StatusReport = { tick: SecondsSinceBegin; vps: ValuePerSecond } // temporary
export type TeamEvent = {
  from: {
    teamMemberId: TeamMemberId;
    teamMemberName: TeamMemberName;
  }; about: StatusReport;
} // what we receive

// this is a UI detail, but I don't know how else to get the events right now
type MemberNameChangeEvent = {
  event: {
    name: "nameChange",
    msg: TeamMemberName,
  }
}

export class TeamSystem {
  constructor(backendUrl: string, individualRelationship: Individual_within_Team) {
    const defaultName = "Fred";

    const [eventsFromServer, eventsToServer, connectionStatus] = wireUpTheWebsocket<TeamEvent>(backendUrl);
    this.eventsFromServer = eventsFromServer;
    this.connectionStatus = connectionStatus;

    this.teamScores = this.eventsFromServer.pipe(scan((accum, e) => {
      console.log("I see an event: ", e);
      accum[e.from.teamMemberId] = { name: e.from.teamMemberName, ...e.about };
      return accum;
    }, {} as TeamStatusSummary)
    );

    /*
     * Member name is noticed
     */
    const nameChanges = new Subject<MemberNameChangeEvent>();
    const memberName: Observable<TeamMemberName> = nameChanges.pipe(
      map(mnce => mnce.event.msg),
      startWith(defaultName));
    memberName.subscribe(c => console.log("My name is now ", c));
    this.memberNameChangeEvent = nameChanges;

    /**
     * status reports go out
     */
    const teamMemberId = this.teamMemberId;
    const outgoingStatusReports = new Subject<StatusReport>();
    // wrap status report in message details, so it's the same format we expect to receive
    outgoingStatusReports.pipe(withLatestFrom(memberName),
      map(([myEvent, yourName]) => {
        const te: TeamEvent = { from: { teamMemberId, teamMemberName: yourName }, about: myEvent };
        return te;
      }))
      .subscribe(eventsToServer)



    individualRelationship.hookUpTeam({
      outgoingStatusReports,
    });
  }

  public connectionStatus: Observable<ConnectionStatus>;

  public memberNameChangeEvent: Observer<MemberNameChangeEvent>;

  private teamMemberId = uuid();

  public eventsFromServer: Observable<TeamEvent>;

  public teamScores: Observable<TeamStatusSummary>;
}
