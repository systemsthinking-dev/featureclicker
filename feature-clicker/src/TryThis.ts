
/**
 * Accumulates all objects with a timestamp within the last so many milliseconds
 * Mutates the input array and then returns it.
 */
export type Timestamped = { timestamp: number };
export function allRecent(
  millis: number
): (arr: Array<Timestamped>, one: Timestamped) => Array<Timestamped> {
  /* mutates the array */
  function removeAllOlderThan(
    timestamp: number,
    arr: Array<Timestamped>
  ): void {
    // assumption: oldest ones are first
    if (arr.length === 0) {
      return;
    }
    if (arr[0].timestamp > timestamp) {
      // first one is new enough
      return;
    }
    // console.log("Removing a timestamp " + arr[0].timestamp + " because it's older than " + timestamp);
    arr.shift();
    removeAllOlderThan(timestamp, arr);
  }

  return (all, one) => {
    const now = one.timestamp;
    removeAllOlderThan(now - millis, all);
    // the new one goes last
    all.push(one);
    return all;
  };
}
