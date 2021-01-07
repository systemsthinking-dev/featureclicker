import { Observable, Observer, ReplaySubject, Subject, merge, of } from "rxjs";
import { catchError, filter, map, mapTo, startWith, } from "rxjs/operators";
import { webSocket } from "rxjs/webSocket";

type MessageToEveryone = {
  action: "sendmessage"; // the backend route
  data: string; // JSON.stringified TeamEvent;
} // what we send

function isNotMessageToEveryone<U>(msg: U | MessageToEveryone): msg is U {
  const te = msg as MessageToEveryone;
  return !(te.action === "sendmessage")
}

export enum ConnectionStatus {
  Connected, NotYetConnected, FailedConnection
}

/**
 * Websocket Handling. Declare a websocketSubject for the URL received.
 * That websocket is expecting to talk to this app: https://github.com/aws-samples/simple-websockets-chat-app
 * That app expects messages that look like MessageToEveryone, and then it echoes to all connections
 * just the data part.
 * 
 * This function gives you the two sides -- an Observable to receive your messages, and an Observer to send them.
 * 
 * If the websocket fails, then this function wires up your sender to your receiver,
 * so you'll get your own messages from then on. The fallback is, you're chatting to yourself.
 * 
 * Returned:
 * - an observable that will give you the messages from the server, or your own messages if the server connection fails
 * - an observer that, when you subscribe it to something, wraps up what it receives to send to the server.
 */
export function wireUpTheWebsocket<U>(backendUrl: string): [Observable<U>, Observer<U>, Observable<ConnectionStatus>] {
  const selfSubject = new ReplaySubject<MessageToEveryone>(1);
  const selfObservable: Observable<U> = selfSubject.pipe(map(mte => JSON.parse(mte.data)));
  const openObserver = new Subject<Event>();

  // we receive U from the websocket, but we always send MessageToEveryone
  const websocketSubject: Subject<U | MessageToEveryone> = webSocket({ url: backendUrl, openObserver });
  // this is for debugging. However there is always a chance that removing
  // it will change behavior: it's the first subscribe that triggers connection.
  websocketSubject.subscribe((m) =>
    console.log("Received from websocket: " + JSON.stringify(m))
  );

  const errorAlert = new Subject<Error>();
  const eventsFrom: Observable<U> = websocketSubject.pipe(
    catchError(e => {
      errorAlert.next(e);
      console.log("oops, websocket failure: ", e);
      return selfObservable;
    }), filter(isNotMessageToEveryone));

  const eventsTo = new Subject<U>(); // captured in returned function

  // any event in the myEvents stream gets sent to the server along with metadata.
  eventsTo.pipe(map(u => {
    const mfe: MessageToEveryone = {
      action: "sendmessage",
      data: JSON.stringify(u)
    };
    console.log("Sending: ", mfe);
    return mfe;
  })).subscribe(mfe => {
    websocketSubject.next(mfe);
    selfSubject.next(mfe); // backup in case the websocket goes down
  });

  const connectionStatus: Observable<ConnectionStatus> = merge(
    eventsFrom.pipe(mapTo(ConnectionStatus.Connected)), // we get an event, must be OK
    openObserver.pipe(mapTo(ConnectionStatus.Connected)), // we notice the socket was opened
    errorAlert.pipe(mapTo(ConnectionStatus.FailedConnection))).pipe(startWith(ConnectionStatus.NotYetConnected));

  return [eventsFrom, eventsTo, connectionStatus];
}
