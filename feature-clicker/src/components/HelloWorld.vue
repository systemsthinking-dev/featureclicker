<template>
  <svg class="yo" width="800" height="400">
    Feature Clicker Goes Here
    <DoFeatureWork :doWork="individualWork.featureWorkDone" />
    <capability-stock :quantityObservable="individualWork.capabilityStock" />
    <total-value-created
      :secondsSinceBegin="individualWork.secondsSinceBegin"
      :totalValueCreated="individualWork.totalValueCreated"
    />
    <send-status-report />
  </svg>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import type { IndividualWork } from "../system/IndividualWork";
import DoFeatureWork from "./DoFeatureWork.vue";
import CapabilityStock from "./CapabilityStock.vue";
import TotalValueCreated from "./TotalValueCreated.vue";
import SendStatusReport from "./SendStatusReport.vue";

@Component({
  components: {
    DoFeatureWork,
    CapabilityStock,
    TotalValueCreated,
    SendStatusReport,
  },
})
export default class HelloWorld extends Vue {
  @Prop({ required: true }) private individualWork!: IndividualWork;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only (wow) -->
<style scoped>
svg.yo {
  border: 5px solid gray;
  display: block;
  margin: auto;
  margin-top: 20px;
  width: 800px;
  height: 400px;
  background-color: white;
}

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
