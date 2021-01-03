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
text {
  user-select: none;
}
.send-status-report {
  fill: lightcoral;
  stroke: black;
  stroke-width: 2px;
}
</style>