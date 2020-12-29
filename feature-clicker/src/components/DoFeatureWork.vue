<template>
  <svg>
    <circle
      v-stream:click="doWork$"
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
  </svg>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Subject } from "rxjs";
import Rx from "vue-rx";
import { importantThings } from "../ImportantFile";

@Component<DoFeatureWork>({
  subscriptions() {
    return { theWork: this.doWork$ };
  },
})
export default class DoFeatureWork extends Vue {
  @Prop({ required: true }) private doWork$!: Subject<"yes">;
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
</style>
