<template>
  <svg x="350" y="10">
    <text x="150" y="20">value per second</text>
    <text x="150" y="40">{{ quantity }}</text>
    <line class="flow-of-created-value" x1="150" y1="90" y2="115" x2="325" />
    <circle
      class="capability-stock"
      :r="circleRadius"
      cx="150"
      :cy="circleCenter"
    />

    <text class="vps" x="150" :y="belowCircle">
      <tspan>Software</tspan>
      <tspan x="150" dy="1.2em">Capabilities</tspan>
    </text>
  </svg>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import VueRx from "vue-rx";
import { importantThings } from "../ImportantFile";

const circleCenter = 90;

@Component<CapabilityStock>({
  subscriptions() {
    const radius = this.quantityObservable.pipe(map(this.calculateRadius));
    return {
      quantity: this.quantityObservable,
      circleRadius: radius,
      belowCircle: radius.pipe(map((r) => circleCenter + r + 20)),
    };
  },
})
export default class CapabilityStock extends Vue {
  @Prop({ required: true }) private quantityObservable!: Observable<number>;

  private circleCenter = circleCenter;

  calculateRadius(capabilityQuantity: number): number {
    const coefficient = 1; // later: 1 / Math.PI;
    const startingRadius = 5; // later: 0;
    return Math.sqrt(capabilityQuantity) * coefficient + startingRadius;
    // return Math.pow(capabilityQuantity, 2) + 10; <- see it go really fast
  }
}
</script>

<style scoped>
circle.capability-stock {
  fill: lightgreen;
  transition-duration: 1s;
}
text {
  text-anchor: middle;
  user-select: none;
}
.vps {
  transition-duration: 1s;
}

.flow-of-created-value {
  stroke: green;
  stroke-width: 5px;
}
</style>
