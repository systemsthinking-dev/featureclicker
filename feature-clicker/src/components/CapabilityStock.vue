<template>
  <text class="capability-quantity" x="500" y="100">{{ quantity }}</text>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Observable } from "rxjs";
import VueRx from "vue-rx";
import { importantThings } from "../ImportantFile";

@Component<CapabilityStock>({
  subscriptions() {
    return {
      quantity: this.quantityObservable,
    };
  },
})
export default class CapabilityStock extends Vue {
  @Prop({ required: true }) private quantityObservable!: Observable<number>;
}
</script>

<style scoped>
</style>
