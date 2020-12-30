<template>
  <svg>
    <circle
      v-stream:click="{ subject: doWork, data: { timestamp: Date.now() } }"
      class="feature-work"
      cx="230"
      cy="100"
      stroke="black"
      fill="orange"
    />
    <text x="100" y="100" font-size="20" text-anchor="middle" fill="black">
      <tspan>Work on</tspan>
      <tspan x="100" dy="1.2em">features</tspan>
    </text>
    <circle
      v-for="dot in theWork"
      :key="dot.timestamp"
      :id="'dot' + dot.timestamp"
      class="feature-work-on-the-move"
      cx="400"
      cy="200"
      r="5"
    />
  </svg>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Subject } from "rxjs";
import { pluck, scan } from "rxjs/operators";
import { ClickOnFeatureWork } from "../ImportantFile";

/**
 * Accumulates all objects with a timestamp within the last so many seconds
 * Mutates the input array and then returns it.
 */
type Timestamped = { timestamp: number };
function allRecent(
  seconds: number
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
    arr.shift();
    removeAllOlderThan(timestamp, arr);
  }

  return (all, one) => {
    removeAllOlderThan(Date.now() - seconds * 1000, all);
    // the new one goes last
    all.push(one);
    return all;
  };
}

@Component<DoFeatureWork>({
  subscriptions() {
    return {
      theWork: this.doWork.pipe(
        pluck("data"),
        scan(allRecent(3), [] as Array<Timestamped>)
      ),
    };
  },
})
export default class DoFeatureWork extends Vue {
  @Prop({ required: true }) private doWork!: Subject<ClickOnFeatureWork>;
}
</script>

<style scoped>
circle.feature-work {
  r: 70;
  transition-property: r;
  transition-duration: 0.5s;
}
circle.feature-work:active {
  r: 65;
}
.feature-work-on-the-move {
  animation: zoop 2s;
  animation-timing-function: linear;
}

@keyframes zoop {
  0% {
    cx: 0;
  }
  100% {
    cx: 400;
  }
}
</style>
