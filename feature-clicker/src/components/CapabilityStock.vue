<template>
  <svg x="350" y="50">
    <line class="flow-of-created-value" x1="150" y1="50" y2="75" x2="325" />
    <circle class="capability-stock" :r="circleRadius" cx="150" cy="50" />
    <text
      class="capability-quantity"
      alignment-baseline="middle"
      x="150"
      y="50"
    >
      {{ quantity }}
    </text>
    <text class="vps" x="150" y="70">value per second</text>
  </svg>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import VueRx from "vue-rx";
import { importantThings } from "../ImportantFile";

@Component<CapabilityStock>({
  subscriptions() {
    return {
      quantity: this.quantityObservable,
      circleRadius: this.quantityObservable.pipe(map(this.calculateRadius)),
    };
  },
})
export default class CapabilityStock extends Vue {
  @Prop({ required: true }) private quantityObservable!: Observable<number>;

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

.flow-of-created-value {
  stroke: green;
  stroke-width: 5px;
}
</style>
