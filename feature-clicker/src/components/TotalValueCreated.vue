<template>
  <svg x="600" y="10" height="100%">
    <text x="50" y="20">{{ elapsedTime }}</text>
    <text x="50" y="40">{{ money }}</text>
  </svg>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Observable } from "rxjs";
import { SecondsSinceBegin, ValueCreated } from "../ImportantFile";
import { map } from "rxjs/operators";

export function formatSeconds(allTheSeconds: number): string {
  function padTo2Digits(n: number): string {
    return n < 10 ? "0" + n : "" + n;
  }
  const hours = Math.floor(allTheSeconds / (60 * 60));
  const minutes = Math.floor((allTheSeconds % (60 * 60)) / 60);
  const seconds = allTheSeconds % 60;
  return (
    (hours ? hours + ":" + padTo2Digits(minutes) : minutes) +
    ":" +
    padTo2Digits(seconds)
  );
}

@Component<TotalValueCreated>({
  subscriptions() {
    return {
      elapsedTime: this.secondsSinceBegin.pipe(map(formatSeconds)),
      money: this.totalValueCreated,
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
}
</style>
