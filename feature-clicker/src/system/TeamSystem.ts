/* eslint-disable */
import { BehaviorSubject, Observable, Observer, of, Subject } from "rxjs";
import type { ValuePerSecond, SecondsSinceBegin } from "./IndividualWork";
import { map, scan, startWith, withLatestFrom } from "rxjs/operators";
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

type MemberNameChangeEvent = {
  event: {
    name: "nameChange",
    msg: TeamMemberName,
  }
}

export class TeamSystem {
  constructor(backendUrl: string, individualRelationship: Individual_within_Team) {
    const defaultName = "Fred";

    const [eventsFromServer, eventsToServer] = wireUpTheWebsocket<TeamEvent>(backendUrl);
    this.eventsFromServer = eventsFromServer;

    this.teamScores = this.eventsFromServer.pipe(scan((accum, e) => {
      console.log("I see an event: ", e);
      accum.push({ teamMemberId: e.from.teamMemberId, name: e.from.teamMemberName, vps: e.about.vps });
      return accum;
    }, [] as Array<TeamMemberScore>)
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

  public memberNameChangeEvent: Observer<MemberNameChangeEvent>;

  private teamMemberId = uuid();

  public eventsFromServer: Observable<TeamEvent>;

  public teamScores: Observable<TeamMemberScore[]>;
}
