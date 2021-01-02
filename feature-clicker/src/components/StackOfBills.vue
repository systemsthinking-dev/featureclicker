<template>
  <svg>
    <hundred-dollar-bill x="135" y="336" />
    <hundred-dollar-bill x="135" y="331" bottom="true" />
  </svg>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import HundredDollarBill from "./HundredDollarBill.vue";

@Component({
  components: { HundredDollarBill },
})
export default class StackOfBills extends Vue {}
</script>
