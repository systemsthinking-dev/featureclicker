<template>
  <text class="capability-quantity" x="500" y="100">6</text>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Subject } from "rxjs";
import Rx from "vue-rx";
import { importantThings } from "../ImportantFile";

@Component
export default class CapabilityStock extends Vue {}
</script>

<style scoped>
</style>
