<template>
  <svg x="600" y="10" height="100%">
    <text x="100" y="20">Total Value Created</text>
    <text x="100" y="40">{{ money }}</text>
    <linearGradient id="here-comes-money" x1="0" x2="0" y1="1" y2="0">
      <stop class="stop1" offset="0%" />
      <stop class="stop2" offset="5%" />
    </linearGradient>
    <rect
      class="money-growing"
      x="75"
      width="50"
      y="60"
      :height="totalHeight"
    />
    <rect
      class="money-growing-upper"
      x="75"
      width="50"
      y="60"
      :height="unfilledHeight"
    />
    <rect
      class="money-growing-outline"
      x="75"
      width="50"
      y="60"
      :height="totalHeight"
    />
    <stack-of-bills :quantity="quantityOfBills" />
  </svg>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Observable } from "rxjs";
import { SecondsSinceBegin, ValueCreated } from "../IndividualWork";
import { map } from "rxjs/operators";
import StackOfBills from "./StackOfBills.vue";

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
    StackOfBills,
  },
  subscriptions() {
    const valueToFillRectangle = 10000; // $100.00
    function percentComplete(tv: ValueCreated) {
      return ((tv % valueToFillRectangle) / valueToFillRectangle) * 100;
    }
    function percentageFullOfMoney(tv: ValueCreated) {
      return Math.max(0, percentComplete(tv) - 2.5) + "%";
    }
    function percentageSniffingMoney(tv: ValueCreated) {
      return Math.min(100, percentComplete(tv) + 2.5) + "%";
    }
    function numberOfBills(tv: ValueCreated) {
      return Math.floor(tv / valueToFillRectangle);
    }
    const totalHeight = this.totalHeight;
    function heightIncomplete(tv: ValueCreated) {
      return (
        totalHeight -
        ((tv % valueToFillRectangle) / valueToFillRectangle) * totalHeight
      );
    }
    return {
      elapsedTime: this.secondsSinceBegin.pipe(map(formatSeconds)),
      money: this.totalValueCreated.pipe(map(formatMoney)),
      unfilledHeight: this.totalValueCreated.pipe(map(heightIncomplete)),
      // fullOfMoney: this.totalValueCreated.pipe(map(percentageFullOfMoney)),
      // whiffOfMoney: this.totalValueCreated.pipe(map(percentageSniffingMoney)),
      quantityOfBills: this.totalValueCreated.pipe(map(numberOfBills)),
    };
  },
})
export default class TotalValueCreated extends Vue {
  @Prop({ required: true })
  private secondsSinceBegin!: Observable<SecondsSinceBegin>;

  @Prop({ required: true })
  private totalValueCreated!: Observable<ValueCreated>;

  private elapsedTime!: Observable<number>;

  private totalHeight = 300;
}
</script>

<style scoped>
text {
  fill: black;
  text-anchor: middle;
  user-select: none;
}
rect.money-growing {
  fill: green;
}
rect.money-growing-upper {
  fill: url(#here-comes-money);
  transition: 1s linear;
}
rect.money-growing-outline {
  stroke: black;
  fill: none;
}
.stop2 {
  stop-color: white;
}
.stop1 {
  stop-color: green;
}
</style>
