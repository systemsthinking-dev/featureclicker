<template>
  <svg x="600" y="10" height="100%">
    <text x="50" y="20">{{ elapsedTime }}</text>
  </svg>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Observable } from "rxjs";
import { SecondsSinceBegin } from "../ImportantFile";
import { map } from "rxjs/operators";

function formatSeconds(seconds: number): string {
  return "" + seconds;
}

@Component<TotalValueCreated>({
  subscriptions() {
    return {
      elapsedTime: this.secondsSinceBegin.pipe(map(formatSeconds)),
    };
  },
})
export default class TotalValueCreated extends Vue {
  @Prop({ required: true })
  private secondsSinceBegin!: Observable<SecondsSinceBegin>;

  private elapsedTime!: Observable<number>;
}
</script>

<style scoped>
text {
  fill: black;
}
</style>
