<template>
  <svg x="600" y="10" height="100%">
    <text x="100" y="20">Total Value Created</text>
    <text x="100" y="40">{{ money }}</text>
    <linearGradient id="here-comes-money" x1="0" x2="0" y1="1" y2="0">
      <stop class="stop1" :offset="fullOfMoney" />
      <stop class="stop2" :offset="whiffOfMoney" />
    </linearGradient>
    <rect class="money-growing" x="75" width="50" y="60" height="300" />
    <hundred-dollar-bill x="135" y="336" />
    <hundred-dollar-bill x="135" y="331" bottom="true" />
  </svg>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Observable } from "rxjs";
import { SecondsSinceBegin, ValueCreated } from "../ImportantFile";
import { map } from "rxjs/operators";
import HundredDollarBill from "./HundredDollarBill.vue";

function padTo2Digits(n: number): string {
  return n < 10 ? "0" + n : "" + n;
}

export function formatSeconds(allTheSeconds: number): string {
  const hours = Math.floor(allTheSeconds / (60 * 60));
  const minutes = Math.floor((allTheSeconds % (60 * 60)) / 60);
  const seconds = allTheSeconds % 60;
  return (
    (hours ? hours + ":" + padTo2Digits(minutes) : minutes) +
    ":" +
    padTo2Digits(seconds)
  );
}

function formatMoney(valueCreated: ValueCreated) {
  const dollars = Math.floor(valueCreated / 100);
  const cents = valueCreated % 100;
  return "$" + dollars + "." + padTo2Digits(cents);
}

@Component<TotalValueCreated>({
  components: {
    HundredDollarBill,
  },
  subscriptions() {
    const valueToFillRectangle = 100000; // $1,000.00
    function percentageFullOfMoney(tv: ValueCreated) {
      return Math.max(0, (tv / valueToFillRectangle) * 100 - 2.5) + "%";
    }
    function percentageSniffingMoney(tv: ValueCreated) {
      return Math.min(100, (tv / valueToFillRectangle) * 100 + 2.5) + "%";
    }
    return {
      elapsedTime: this.secondsSinceBegin.pipe(map(formatSeconds)),
      money: this.totalValueCreated.pipe(map(formatMoney)),
      fullOfMoney: this.totalValueCreated.pipe(map(percentageFullOfMoney)),
      whiffOfMoney: this.totalValueCreated.pipe(map(percentageSniffingMoney)),
    };
  },
})
export default class TotalValueCreated extends Vue {
  @Prop({ required: true })
  private secondsSinceBegin!: Observable<SecondsSinceBegin>;

  @Prop({ required: true })
  private totalValueCreated!: Observable<ValueCreated>;

  private elapsedTime!: Observable<number>;
}
</script>

<style scoped>
text {
  fill: black;
  text-anchor: middle;
  user-select: none;
}
rect.money-growing {
  stroke: black;
  fill: url(#here-comes-money);
}
.stop2 {
  stop-color: black;
  stop-opacity: 0;
}
.stop1 {
  stop-color: green;
}
</style>
