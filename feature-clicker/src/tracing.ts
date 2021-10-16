import * as uuid from "uuid";

type TraceId = string; // really should be as specified in w3c tracing spec
type SpanId = string;
type ParentSpanId = string | undefined;
type SpanBeginTimestamp = number; // Unix timestamp
type TraceMetadata = {
  trace_id: TraceId,
  span_id: SpanId,
  parent_id: ParentSpanId,
};
export type Traced<T> = {
  trace: TraceMetadata,
  timestamp: SpanBeginTimestamp,
  duration_ms: number,
  spanName: string,
  data: T,
};


function generateSpanId() {
  return uuid.v1();
}

// I can enumerate these here if I want
type TopLevelSpanName = string;

export function packageAsNewTrace<T>(spanName: TopLevelSpanName, data: T, moarAttributes: object = {}): Traced<T> {
  // really should be like this: https://github.com/open-telemetry/opentelemetry-js/blob/main/packages/opentelemetry-core/src/platform/browser/RandomIdGenerator.ts#L34
  const newTraceId = uuid.v4();
  const newSpanId: string = generateSpanId();
  const result: Traced<T> = {
    trace: {
      trace_id: newTraceId,
      span_id: newSpanId,
      parent_id: undefined,
    },
    timestamp: Date.now(),
    duration_ms: 0,
    spanName,
    data,
  };
  sendSpanEventToHoneycomb(result, moarAttributes);
  return result;
}

export function generateInnerSpanMetadata<T>(trace: TraceMetadata): TraceMetadata {
  const newSpanId: string = generateSpanId();
  return {
    trace_id: trace.trace_id,
    span_id: newSpanId,
    parent_id: trace.span_id,
  };
}

export function withSpan<T, R>(traced: Traced<T>, spanName: string, f: (data: T) => R, moarAttributes: object = {}): Traced<R> {
  const newSpanTraceMetadata = generateInnerSpanMetadata(traced.trace);
  const timestamp = Date.now();
  const res = f(traced.data);
  const endTimestamp = Date.now();
  const tracedResult: Traced<R> = {
    trace: newSpanTraceMetadata,
    timestamp,
    duration_ms: endTimestamp - timestamp,
    spanName,
    data: res,
  }
  sendSpanEventToHoneycomb(tracedResult, moarAttributes);
  return tracedResult;
}

// set once per program
const sessionId: string = uuid.v4();


// deprecated
export function sendSomethingToHoneycomb(data: object) {
  const augmentedData = { ...data, sessionId }
  fetch('https://api.honeycomb.io/1/events/featureclicker',
    {
      method: 'POST',
      body: JSON.stringify(augmentedData),
      headers: {
        'Content-Type': 'application/json',
        'X-Honeycomb-Team': '430eb2f22c137f6ff63980a3a332b4ac'
      },
    })
    .then(response => {
      // console.log("Got from honeycomb: ", response);
      if (response.status === 200) {
        console.log("Transmitted to Honeycomb: ", data);
      } else {
        console.error("Failed to send data to Honeycomb: ", response);
      }
    });
}


const ServiceName = "featureclicker";

// https://docs.honeycomb.io/getting-data-in/tracing/send-trace-data/#manual-tracing
function sendSpanEventToHoneycomb(traced: Traced<any>, moar: object) {
  const augmentedData = {
    "app.data": JSON.stringify(traced.data),
    "app.sessionId": sessionId,
    "duration_ms": traced.duration_ms,
    "name": traced.spanName,
    "service_name": ServiceName,
    "trace.trace_id": traced.trace.trace_id,
    "trace.parent_id": traced.trace.parent_id,
    "trace.span_id": traced.trace.span_id,
    "app.timestamp": "" + traced.timestamp, // this is for my own info
    app: { moar },
  }
  fetch('https://api.honeycomb.io/1/events/featureclicker',
    {
      method: 'POST',
      body: JSON.stringify(augmentedData),
      headers: {
        'Content-Type': 'application/json',
        'X-Honeycomb-Team': '430eb2f22c137f6ff63980a3a332b4ac',
        'X-Honeycomb-Event-Time': "" + traced.timestamp,
      },
    })
    .then(response => {
      // console.log("Got from honeycomb: ", response);
      if (response.status === 200) {
        console.log("Transmitted to Honeycomb: ", augmentedData);
      } else {
        console.error("Failed to send data to Honeycomb: ", response);
      }
    });
}
