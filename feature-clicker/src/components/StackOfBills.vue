<template>
  <svg>
    <hundred-dollar-bill
      v-for="n in parseInt(quantity)"
      :key="'bill' + n"
      x="135"
      :y="heightOfBill(n)"
      :bottom="n === 1"
    />
  </svg>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import HundredDollarBill from "./HundredDollarBill.vue";

@Component({
  components: { HundredDollarBill },
})
export default class StackOfBills extends Vue {
  @Prop({ required: true }) private quantity!: number;

  private heightOfBill(n: number) {
    console.log("Calculating height for n = " + n);
    return 341 - n * 5;
  }
}
</script>
