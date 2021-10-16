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
};

export function packageAsNewTrace<T>(data: T): Traced<T> {
  // really should be like this: https://github.com/open-telemetry/opentelemetry-js/blob/main/packages/opentelemetry-core/src/platform/browser/RandomIdGenerator.ts#L34
  const newTraceId = uuid.v4();
  const newSpanId: string = uuid.v1();
  return {
    trace: {
      trace_id: newTraceId,
      span_id: newSpanId,
      parent_id: undefined,
    },
    data,
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
