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
import { Subject, Observable } from "rxjs";
import { pluck, scan } from "rxjs/operators";
import { ClickOnFeatureWork } from "../ImportantFile";
import { Timestamped, allRecent } from "../TryThis";

@Component<DoFeatureWork>({
  subscriptions() {
    return {
      theWork: this.doWork.pipe(
        pluck("data"),
        scan(allRecent(3000), [] as Array<Timestamped>)
      ),
    };
  },
})
export default class DoFeatureWork extends Vue {
  @Prop({ required: true }) private doWork!: Subject<ClickOnFeatureWork>;

  // subscription
  private theWork!: Observable<Timestamped>;
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
