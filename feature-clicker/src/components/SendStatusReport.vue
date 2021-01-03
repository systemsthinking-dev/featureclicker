<template>
  <svg>
    <rect
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
import { Component, Vue } from "vue-property-decorator";

@Component
export default class SendStatusReport extends Vue {}
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