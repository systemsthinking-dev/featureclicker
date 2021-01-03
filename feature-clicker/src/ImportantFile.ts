
import { Subject, BehaviorSubject, Observable, timer, of } from "rxjs";
import { scan, delay, first, mergeMap, startWith, withLatestFrom, map, filter } from "rxjs/operators";

console.log("Does this happen?");

export type ClickOnFeatureWork = { event: Event };
export type SecondsSinceBegin = number;
export type ValueCreated = number;
export type ValuePerSecond = number;

export type TeamMemberScore = { teamMemberId: TeamMemberId; name: TeamMemberName; vps: ValuePerSecond }
export type TeamMemberName = string;
export type TeamMemberId = string;
export type MyEvent = { vps: ValuePerSecond } // temporary
export type TeamEvent = {
  from: {
    teamMemberId: TeamMemberId;
    teamMemberName: TeamMemberName;
    tick: SecondsSinceBegin;
  }; about: MyEvent;
} // what we receive
export type MessageToEveryone = {
  action: "sendmessage"; // the backend route
  data: TeamEvent;
} // what we send
function isTeamEvent(tore: TeamEvent | MessageToEveryone): tore is TeamEvent {
  const te = tore as TeamEvent;
  return !!te.from && !!te.from.teamMemberId && (te.from.tick !== undefined);
}

const yourName = of("Fred"); // TODO: Wire up an input

function wireUpTheWebsocket(websocketSubject: Subject<TeamEvent | MessageToEveryone>,
  teamMemberId: TeamMemberId, yourName: Observable<TeamMemberName>, secondsSinceBegin: Observable<SecondsSinceBegin>): [Observable<TeamEvent>, Subject<MyEvent>] {
  const eventsFrom = websocketSubject.pipe(filter(isTeamEvent)); // does that count as subscribing?

  const eventsTo = new Subject<MyEvent>();

  // any event in the myEvents stream gets sent to the server along with metadata.
  // someday, break this websocket stuff into a different file. it is not core domain, only supporting
  eventsTo.pipe(withLatestFrom(secondsSinceBegin, yourName),
    map(([myEvent, tick, yourName]) => ({ from: { teamMemberId, teamMemberName: yourName, tick }, about: myEvent })))
    .subscribe((myTeamEvent: TeamEvent) => {
      const mfe: MessageToEveryone = {
        action: "sendmessage",
        data: JSON.stringify(myTeamEvent) as any
      };
      console.log("Sending: ", mfe);
      websocketSubject.next(mfe);
    });
  return [eventsFrom, eventsTo];
}

export class ImportantThings {
  constructor(private websocketSubject: Subject<TeamEvent | MessageToEveryone>,
    public teamMemberId: TeamMemberId) {
    this.featureWorkDone = new Subject<ClickOnFeatureWork>();
    this.capabilityStock = new BehaviorSubject<ValuePerSecond>(0);
    this.totalValueCreated = new BehaviorSubject<ValueCreated>(0);
    this.secondsSinceBegin = this.featureWorkDone.pipe(
      first(), // on the first click,
      mergeMap(_t => timer(0, 1000)), // start emitting numbers every second
      startWith(0)); // before that, be 0

    [this.eventsFromServer, this.myEvents] = wireUpTheWebsocket(websocketSubject, teamMemberId, yourName, this.secondsSinceBegin);

    this.teamScores = this.eventsFromServer.pipe(scan((accum, e) => {
      console.log("I see an event: ", e);
      accum.push({ teamMemberId: e.from.teamMemberId, name: e.from.teamMemberName, vps: e.about.vps });
      return accum;
    }, [] as Array<TeamMemberScore>)
    );

    const valueOfEachClick = 1;
    const workFlowingIntoCapabilities: Observable<number> = this.featureWorkDone.pipe(
      scan(countSoFar => countSoFar + valueOfEachClick, 0),
      delay(2000)
    );

    workFlowingIntoCapabilities.subscribe(this.capabilityStock);

    const valueFlowingFromCapabilities: Observable<number> =
      this.secondsSinceBegin.pipe(withLatestFrom(this.capabilityStock), map(([_tick, vps]) => vps));

    valueFlowingFromCapabilities.pipe(scan((accum, moreValue) => accum + moreValue, 0)).subscribe(this.totalValueCreated);

    this.sendToServer({ vps: 0 });
  }

  private myEvents: Subject<MyEvent>;

  sendToServer(event: MyEvent) {
    this.myEvents.next(event);
  }

  public eventsFromServer: Observable<TeamEvent>;

  public featureWorkDone: Subject<ClickOnFeatureWork>;

  public capabilityStock: BehaviorSubject<number>; // TODO: I think all these should be exposed as Observable

  public secondsSinceBegin: Observable<SecondsSinceBegin>;

  public totalValueCreated: BehaviorSubject<ValueCreated>;

  public teamScores: Observable<TeamMemberScore[]>;
}

export const fakeImportantThings: ImportantThings = {

} as ImportantThings;
