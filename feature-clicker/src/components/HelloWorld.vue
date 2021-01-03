<template>
  <main class="hello">
    <span class="title">{{ msg }}</span>
    <TeamBoard :teamScores="individualWork.teamScores" />
    <svg class="yo" width="800" height="400">
      Feature Clicker Goes Here
      <DoFeatureWork :doWork="individualWork.featureWorkDone" />
      <capability-stock :quantityObservable="individualWork.capabilityStock" />
      <total-value-created
        :secondsSinceBegin="individualWork.secondsSinceBegin"
        :totalValueCreated="individualWork.totalValueCreated"
      />
    </svg>
  </main>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { IndividualWork } from "../IndividualWork";
import DoFeatureWork from "./DoFeatureWork.vue";
import CapabilityStock from "./CapabilityStock.vue";
import TotalValueCreated from "./TotalValueCreated.vue";
import TeamBoard from "./TeamBoard.vue";

@Component({
  components: {
    DoFeatureWork,
    CapabilityStock,
    TotalValueCreated,
    TeamBoard,
  },
})
export default class HelloWorld extends Vue {
  @Prop({ default: "Software Development Simulator" }) private msg!: string;

  @Prop({ required: true }) private individualWork!: IndividualWork;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only (wow) -->
<style scoped>
.title {
  font-weight: bold;
  font-size: x-large;
  padding: 20px;
}
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
