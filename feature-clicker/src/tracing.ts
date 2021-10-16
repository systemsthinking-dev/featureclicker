import * as uuid from "uuid";

type TraceId = string; // really should be as specified in w3c tracing spec
type SpanId = string;
type ParentSpanId = string | undefined;
type TraceMetadata = {
  trace_id: TraceId,
  span_id: SpanId,
  parent_id: ParentSpanId,
};
export type Traced<T> = {
  trace: TraceMetadata,
  data: T,
  name: string,
};


function generateSpanId() {
  return uuid.v1();
}

// I can enumerate these here if I want
type TopLevelSpanName = string;

export function packageAsNewTrace<T>(spanName: TopLevelSpanName, data: T): Traced<T> {
  // really should be like this: https://github.com/open-telemetry/opentelemetry-js/blob/main/packages/opentelemetry-core/src/platform/browser/RandomIdGenerator.ts#L34
  const newTraceId = uuid.v4();
  const newSpanId: string = generateSpanId();
  return {
    trace: {
      trace_id: newTraceId,
      span_id: newSpanId,
      parent_id: undefined,
    },
    name: spanName,
    data,
  }
}

export function generateInnerSpanMetadata<T>(trace: TraceMetadata): TraceMetadata {
  const newSpanId: string = generateSpanId();
  return {
    trace_id: trace.trace_id,
    span_id: newSpanId,
    parent_id: trace.span_id,
  };
}

export function withSpan<T, R>(traced: Traced<T>, spanName: string, f: (data: T) => R): Traced<R> {
  const newSpanTraceMetadata = generateInnerSpanMetadata(traced.trace);

  const res = f(traced.data);
  return {
    trace: newSpanTraceMetadata,
    name: spanName,
    data: res,
  }
}

// set once per program
const sessionId: string = uuid.v4();

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
