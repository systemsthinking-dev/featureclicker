import { Observable, ReplaySubject, Subject } from "rxjs";
import { catchError, filter, map } from "rxjs/operators";
import { webSocket } from "rxjs/webSocket";

type MessageToEveryone = {
  action: "sendmessage"; // the backend route
  data: string; // JSON.stringified TeamEvent;
} // what we send

function isNotMessageToEveryone<U>(msg: U | MessageToEveryone): msg is U {
  const te = msg as MessageToEveryone;
  return !(te.action === "sendmessage")
}

/**
 * Websocket Handling
 * T: the type that we send
 * U: the type we receive
 * @param websocketSubject
 * @param teamMemberId
 * @param yourName
 * @param secondsSinceBegin
 */
export function wireUpTheWebsocket<U>(backendUrl: string): [Observable<U>, Subject<U>] {
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
