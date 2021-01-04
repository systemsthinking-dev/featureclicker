/* eslint-disable */
import { Observable, of, ReplaySubject, Subject } from "rxjs";
import type { ValuePerSecond, SecondsSinceBegin } from "./IndividualWork";
import { webSocket } from "rxjs/webSocket";
import { catchError, filter, map, scan, withLatestFrom } from "rxjs/operators";
import { v4 as uuid } from "uuid";
import type { Individual_within_Team } from "./Individual_within_Team";

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
type MessageToEveryone = {
  action: "sendmessage"; // the backend route
  data: string; // JSON.stringified TeamEvent;
} // what we send

function isNotMessageToEveryone<U>(msg: U | MessageToEveryone): msg is U {
  const te = msg as MessageToEveryone;
  return !(te.action === "sendmessage")
}

const yourName = of("Fred"); // TODO: Wire up an input

/**
 * Websocket Handling
 * T: the type that we send
 * U: the type we receive
 * @param websocketSubject
 * @param teamMemberId
 * @param yourName
 * @param secondsSinceBegin
 */
function wireUpTheWebsocket<U>(backendUrl: string): [Observable<U>, Subject<U>] {
  const selfSubject = new ReplaySubject<MessageToEveryone>(1);
  const selfObservable: Observable<U> = selfSubject.pipe(map(mte => JSON.parse(mte.data)));

  // we receive U from the websocket, but we always send MessageToEveryone
  const websocketSubject: Subject<U | MessageToEveryone> = webSocket(backendUrl);
  // this is for debugging. However there is always a chance that removing
  // it will change behavior: it's the first subscribe that triggers connection.
  websocketSubject.subscribe((m) =>
    console.log("Received from websocket: " + JSON.stringify(m))
  );

  const eventsFrom: Observable<U> = websocketSubject.pipe(
    catchError(e => {
      console.log("oops, websocket failure: ", e);
      return selfObservable;
    }), filter(isNotMessageToEveryone));

  const eventsTo = new Subject<U>(); // captured in returned function

  // any event in the myEvents stream gets sent to the server along with metadata.
  // someday, break this websocket stuff into a different file. it is not core domain, only supporting
  eventsTo.subscribe((myTeamEvent: U) => {
    const mfe: MessageToEveryone = {
      action: "sendmessage",
      data: JSON.stringify(myTeamEvent)
    };
    console.log("Sending: ", mfe);
    websocketSubject.next(mfe);
    selfSubject.next(mfe); // backup in case the websocket goes down
  });

  return [eventsFrom, eventsTo];
}

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
