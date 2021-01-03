<template>
  <svg>
    <rect
      v-stream:click.prevent="clickingOnButton"
      class="send-status-report"
      x="10"
      y="10"
      height="40"
      width="100"
    ></rect>
    <text x="60" y="35" text-anchor="middle">TPS report</text>
  </svg>
</template>

<script lang=ts>
import { SendStatusReportPlease } from "@/system/IndividualWork";
import { Subject, Observer, Observable } from "rxjs";
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapTo } from "rxjs/operators";
@Component
export default class SendStatusReport extends Vue {
  @Prop({ required: true })
  private sendReport!: Observer<SendStatusReportPlease>;

  constructor() {
    super();
    this.clickingOnButton.subscribe((t) => console.log("TPS report triggered"));
    const tpsReports: Observable<SendStatusReportPlease> = this.clickingOnButton.pipe(
      mapTo("tps")
    );
    tpsReports.subscribe(this.sendReport);
  }

  private clickingOnButton: Subject<{ event: Event }> = new Subject();
}
</script>

<style scoped>
rect.send-status-report {
  rx: 0;
  transition-duration: 0.25s;
}
rect.send-status-report:active {
  fill: purple;
  rx: 10;
}
text {
  user-select: none;
  pointer-events: none;
}
.send-status-report {
  fill: lightcoral;
  stroke: black;
  stroke-width: 2px;
}
</style>