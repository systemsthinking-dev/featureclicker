import { Observable, of, ReplaySubject, Subject } from "rxjs";
import type { ValuePerSecond, SecondsSinceBegin } from "./IndividualWork";
import { webSocket } from "rxjs/webSocket";
import { catchError, filter, map, scan, withLatestFrom } from "rxjs/operators";
import { v4 as uuid } from "uuid";

export type TeamMemberScore = { teamMemberId: TeamMemberId; name: TeamMemberName; vps: ValuePerSecond }
export type TeamMemberName = string;
export type TeamMemberId = string;
export type MyEvent = { tick: SecondsSinceBegin; vps: ValuePerSecond } // temporary
export type TeamEvent = {
  from: {
    teamMemberId: TeamMemberId;
    teamMemberName: TeamMemberName;
  }; about: MyEvent;
} // what we receive
export type MessageToEveryone = {
  action: "sendmessage"; // the backend route
  data: string; // JSON.stringified TeamEvent;
} // what we send

function isTeamEvent(tore: TeamEvent | MessageToEveryone): tore is TeamEvent {
  const te = tore as TeamEvent;
  return !!te.from && !!te.from.teamMemberId;
}

const yourName = of("Fred"); // TODO: Wire up an input

/**
 * Websocket Handling
 * @param websocketSubject
 * @param teamMemberId
 * @param yourName
 * @param secondsSinceBegin
 */
function wireUpTheWebsocket(websocketSubject: Subject<TeamEvent | MessageToEveryone>,
  teamMemberId: TeamMemberId,
  yourName: Observable<TeamMemberName>): [Observable<TeamEvent>, Subject<MyEvent>] {
  const selfSubject = new ReplaySubject<MessageToEveryone>(1);
  const selfObservable: Observable<TeamEvent> = selfSubject.pipe(map(mte => JSON.parse(mte.data)));

  const eventsFrom = websocketSubject.pipe(
    catchError(e => {
      console.log("oops, websocket failure: ", e);
      return selfObservable;
    }), filter(isTeamEvent));

  const eventsTo = new Subject<MyEvent>(); // captured in returned function

  // any event in the myEvents stream gets sent to the server along with metadata.
  // someday, break this websocket stuff into a different file. it is not core domain, only supporting
  eventsTo.pipe(withLatestFrom(yourName),
    map(([myEvent, yourName]) => ({ from: { teamMemberId, teamMemberName: yourName }, about: myEvent })))
    .subscribe((myTeamEvent: TeamEvent) => {
      const mfe: MessageToEveryone = {
        action: "sendmessage",
        data: JSON.stringify(myTeamEvent)
      };
      console.log("Sending: ", mfe);
      try {
        websocketSubject.next(mfe);
      } catch (e) {
        console.log("oh ook!", e);
      }
      selfSubject.next(mfe);
    });

  return [eventsFrom, eventsTo];
}

export class TeamSystem {
  constructor(backendUrl: string) {
    this.teamMemberId = uuid();

    const websocketSubject: Subject<TeamEvent | MessageToEveryone> = webSocket(
      backendUrl
    );

    // this is for debugging. However there is always a chance that removing
    // it will change behavior: it's the first subscribe that triggers connection.
    websocketSubject.subscribe((m) =>
      console.log("Received from websocket: " + JSON.stringify(m))
    );

    const [eventsFromServer, eventsTo] = wireUpTheWebsocket(websocketSubject,
      this.teamMemberId, yourName);
    this.eventsFromServer = eventsFromServer;
    this.sendToServer = (event: MyEvent) => {
      eventsTo.next(event);
    };

    this.teamScores = this.eventsFromServer.pipe(scan((accum, e) => {
      console.log("I see an event: ", e);
      accum.push({ teamMemberId: e.from.teamMemberId, name: e.from.teamMemberName, vps: e.about.vps });
      return accum;
    }, [] as Array<TeamMemberScore>)
    );
  }

  private teamMemberId: string;

  sendToServer: (event: MyEvent) => void;

  public eventsFromServer: Observable<TeamEvent>;

  public teamScores: Observable<TeamMemberScore[]>;
}
