/* eslint-disable */
import { combineLatest, Observable, Observer, of, Subject } from "rxjs";
import type { ValuePerSecond, SecondsSinceBegin } from "./IndividualWork";
import { map, scan, startWith, withLatestFrom } from "rxjs/operators";
import { v4 as uuid } from "uuid";
import type { Individual_within_Team, StatusReport } from "./Individual_within_Team";
import { ConnectionStatus, wireUpTheWebsocket } from "./backendInterface";

//export type TeamConnectionStatus = Connected | NotYetConnected | Failed
export { ConnectionStatus } from "./backendInterface";
export type TeamMemberScore = { teamMemberId: TeamMemberId; name: TeamMemberName; vps: ValuePerSecond }
export type TeamMemberName = string;
export type TeamMemberId = string;
export type TeamStatusSummary = Record<TeamMemberId, StatusReport & { name: TeamMemberName }>;
export type SendStatusReportPlease = "tps";
export type TeamEvent = {
  from: {
    teamMemberId: TeamMemberId;
    teamMemberName: TeamMemberName;
  }; about: StatusReport;
} // what we receive

export enum StatusStatus {
  UpToDate, OutOfDate
}

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
      const newbie = { ...accum };
      newbie[e.from.teamMemberId] = { name: e.from.teamMemberName, ...e.about };
      return newbie;
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

    const triggerReport = new Subject<SendStatusReportPlease>();
    this.triggerReport = triggerReport;
    const individualStatus = new Subject<StatusReport>();
    const teamMemberId = this.teamMemberId;
    // wrap status report in message details, so it's the same format we expect to receive
    const reportsToSend = triggerReport.pipe(withLatestFrom(memberName, individualStatus),
      map(([_tps, yourName, myEvent]) => {
        const te: TeamEvent = { from: { teamMemberId, teamMemberName: yourName }, about: myEvent };
        return te;
      }))
    reportsToSend.subscribe(eventsToServer)

    // notice when the individual status report is newer than the last one sent
    this.statusUptodateness = combineLatest([individualStatus,
      reportsToSend.pipe(startWith(null)), // otherwise this observable won't fire until they all have a value
      memberName]).pipe(
        map(([currentStatus, lastMessageSent, latestName]) => {
          if (lastMessageSent === null) {
            // if a report hasn't fired yet, it's definitely out of date
            return StatusStatus.OutOfDate;
          }
          const lastSentStatus = lastMessageSent.about;
          if (currentStatus.vps !== lastSentStatus.vps) {
            return StatusStatus.OutOfDate; // something has changed since it was sent
          }
          if (latestName !== lastMessageSent.from.teamMemberName) {
            return StatusStatus.OutOfDate; // I changed my name since last send
          }
          return StatusStatus.UpToDate; // well, looks like they're close enough
        }));

    individualRelationship.hookUpTeam({
      individualStatus
    });

    triggerReport.next("tps");

  }

  public triggerReport: Observer<SendStatusReportPlease>;

  public statusUptodateness: Observable<StatusStatus>;

  public connectionStatus: Observable<ConnectionStatus>;

  public memberNameChangeEvent: Observer<MemberNameChangeEvent>;

  private teamMemberId = uuid();

  public eventsFromServer: Observable<TeamEvent>;

  public teamScores: Observable<TeamStatusSummary>;
}
