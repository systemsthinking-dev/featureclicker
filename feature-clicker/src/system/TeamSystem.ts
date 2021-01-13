/* eslint-disable */
import { combineLatest, Observable, Observer, of, Subject, timer } from "rxjs";
import type { SecondsSinceBegin, ValuePerSecond } from "./IndividualWork";
import { map, scan, startWith, withLatestFrom } from "rxjs/operators";
import { v4 as uuid } from "uuid";
import { Individual_within_Team, isDifferentStatus, StatusReport } from "./Individual_within_Team";
import { ConnectionStatus, wireUpTheWebsocket } from "./backendInterface";

//export type TeamConnectionStatus = Connected | NotYetConnected | Failed
export { ConnectionStatus } from "./backendInterface";
export type TeamMemberScore = { teamMemberId: TeamMemberId; name: TeamMemberName; vps: ValuePerSecond }
export type TeamMemberName = string;
export type TeamMemberId = string;
export type TeamStatusSummary = Record<TeamMemberId, StatusReport & { name: TeamMemberName }>;
export type SendStatusReportPlease = "tps";
export type TeamEvent = ReceivedEvent & {
  when: SecondsSinceBegin
}

export type ReceivedEvent = {
  from: {
    teamMemberId: TeamMemberId;
    teamMemberName: TeamMemberName;
  };
  about: StatusReport;
}// what we receive

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

type TeamVpsAccumulation = { when: SecondsSinceBegin, total: ValuePerSecond, currentVpsByPerson: Record<TeamMemberId, ValuePerSecond> };
function emptyTeamVpsAccumulation() { return { when: 0, total: 0, currentVpsByPerson: {} } };
function accumulateTeamVps(accum: TeamVpsAccumulation, event: TeamEvent): TeamVpsAccumulation {
  const currentVpsByPerson = { ...accum.currentVpsByPerson };
  currentVpsByPerson[event.from.teamMemberId] = event.about.vps;
  const total = Object.values(currentVpsByPerson).reduce((a, v) => a + v, 0);
  const newAccum = { when: event.when, total, currentVpsByPerson }
  return newAccum;
}

export type TeamVpsAtTime = { when: SecondsSinceBegin, total: ValuePerSecond };
function teamVpsAccumulationToTotal(accum: TeamVpsAccumulation): TeamVpsAtTime {
  const { when, total } = accum;
  return { when, total };
}

export class TeamSystem {
  constructor(backendUrl: string, individualRelationship: Individual_within_Team) {
    const defaultName = "Fred";

    const myOwnDamnClock: Observable<SecondsSinceBegin> = timer(0, 1000);

    const [eventsFromServer, eventsToServer, connectionStatus] = wireUpTheWebsocket<ReceivedEvent>(backendUrl);
    this.eventsFromServer = eventsFromServer.pipe(withLatestFrom(timer(0, 1000)), map(([te, tick]) => ({ ...te, when: tick })));
    this.connectionStatus = connectionStatus;

    this.teamScores = this.eventsFromServer.pipe(scan((accum, e) => {
      console.log("I see an event: ", e);
      const newbie = { ...accum };
      newbie[e.from.teamMemberId] = { name: e.from.teamMemberName, ...e.about };
      return newbie;
    }, {} as TeamStatusSummary)
    );
    const teamCapabilityStockAtTime: Observable<TeamVpsAtTime> = this.eventsFromServer.pipe(
      scan(accumulateTeamVps, emptyTeamVpsAccumulation()), map(teamVpsAccumulationToTotal));

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
        const te: ReceivedEvent = { from: { teamMemberId, teamMemberName: yourName }, about: myEvent };
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
          if (isDifferentStatus(currentStatus, lastSentStatus)) {
            return StatusStatus.OutOfDate; // something has changed since it was sent
          }
          if (latestName !== lastMessageSent.from.teamMemberName) {
            return StatusStatus.OutOfDate; // I changed my name since last send
          }
          return StatusStatus.UpToDate; // well, looks like they're close enough
        }));


    individualRelationship.hookUpTeam({
      teamCapabilityStockAtTime,
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
