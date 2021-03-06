<template>
  <svg>
    <line x1="230" y1="100" x2="500" y2="100" />
    <circle
      v-for="dot in theWork"
      :key="dot.timestamp"
      :id="'dot' + dot.timestamp"
      class="feature-work-on-the-move"
      cx="500"
      cy="100"
      r="5"
    />
    <radialGradient id="PrettyOrangeButton">
      <stop offset="0%" stop-color="rgba(138, 216, 252, 1)" />
      <stop offset="89" stop-color="rgba(118, 200, 222, 1)" />
      <stop offset="100%" stop-color="rgba(255, 255, 255, 1) " />
    </radialGradient>
    <circle
      v-stream:click.stop="doWork"
      class="feature-work"
      cx="230"
      cy="100"
      fill="url(#PrettyOrangeButton)"
    />
    <text x="100" y="100" font-size="20" text-anchor="middle" fill="black">
      <tspan>Work on</tspan>
      <tspan x="100" dy="1.2em">features</tspan>
    </text>
    <text
      v-if="!hasDoneAnyWork"
      x="230"
      y="100"
      font-size="30"
      text-anchor="middle"
      fill="white"
    >
      <tspan>Click</tspan>
      <tspan x="230" dy="1.2em">Here</tspan>
    </text>
    <text
      v-else-if="!understandsHowToWork"
      x="230"
      y="100"
      font-size="20"
      text-anchor="middle"
      fill="white"
    >
      <tspan>Keep</tspan>
      <tspan x="230" dy="1.2em">Clicking</tspan>
    </text>
  </svg>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Subject, Observable, of } from "rxjs";
import {
  map,
  scan,
  first,
  startWith,
  mapTo,
  take,
  concat,
} from "rxjs/operators";
import { ClickOnFeatureWork } from "../system/IndividualWork";
import { Timestamped, allRecent } from "../TryThis";

@Component<DoFeatureWork>({
  subscriptions() {
    return {
      theWork: this.doWork.pipe(
        map((p) => ({ timestamp: p.event.timeStamp })),
        scan(allRecent(3000), [] as Array<Timestamped>)
      ),
      hasDoneAnyWork: this.doWork.pipe(first(), mapTo(true), startWith(false)),
      understandsHowToWork: this.doWork.pipe(
        take(10),
        mapTo(false),
        concat(of(true))
      ),
    };
  },
})
export default class DoFeatureWork extends Vue {
  @Prop({ required: true }) private doWork!: Subject<ClickOnFeatureWork>;

  // subscription
  private theWork!: Observable<Timestamped>;
  private hasDoneAnyWork!: Observable<boolean>;
}
</script>

<style scoped>
line {
  stroke: orange;
  stroke-width: 0.5px;
}
text {
  pointer-events: none;
  user-select: none;
}
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
  fill: orange;
}

@keyframes zoop {
  0% {
    cx: 230;
  }
  100% {
    cx: 500;
  }
}
</style>
