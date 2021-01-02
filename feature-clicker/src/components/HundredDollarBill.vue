<template>
  <svg
    :x="x"
    :y="y"
    class="dollars"
    width="51"
    height="24"
    viewBox="0 0 102.54 48.18"
  >
    <path
      id="bill"
      d="M104.18,69.31c-2.44-.76-4.84-1.59-7.26-2.39s-4.86-1.57-7.35-2.21a15.76,15.76,0,0,0-12.09-.34c-23,6.76-51.88,22.16-66.74,6-4.69-6.56,2.65-21.42,5.19-33,7.49,3.13,13.77,7.09,23.25,5.84C58.32,39.88,75.37,27.38,94,30.91a38.61,38.61,0,0,1,8.32,2.26A33.13,33.13,0,0,1,110,37.48c3.45,2.9-4.94,13.2-4.14,21.53C104.86,64.7,104.18,69.31,104.18,69.31Z"
      transform="translate(-8.73 -29.81)"
      fill="#39b54a"
      stroke="#006837"
      stroke-miterlimit="10"
      stroke-width="0.95"
    />
    <path
      v-if="bottom"
      id="bill-denomination"
      d="M21.59,64.46C31.8,68.14,39.65,67.93,45,67c14.07-2.45,19.93-11.39,34.35-12.1A39.3,39.3,0,0,1,95,57.43"
      transform="translate(-8.73 -29.81)"
      fill="none"
      stroke="none"
    />
    <text
      font-size="23"
      fill="#006837"
      font-family="Algerian"
      text-align="center"
    >
      <textPath
        startOffset="10"
        alignment-baseline="top"
        xlink:href="#bill-denomination"
      >
        $100
      </textPath>
    </text>
  </svg>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class HundredDollarBill extends Vue {
  @Prop({ required: true }) private x!: number;
  @Prop({ required: true }) private y!: number;
  @Prop({ default: false }) private bottom!: boolean;
}
</script>

<style scoped>
svg.dollars {
  width: 51px;
  height: 24px;
}
</style>
