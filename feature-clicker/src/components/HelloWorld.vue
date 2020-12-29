<template>
  <main class="hello">
    {{ msg }}
    <svg class="yo" width="800" height="400">
      Feature Clicker Goes Here
      <DoFeatureWork :doWork="importantThings.featureWorkDone" />
      <capability-stock quantity="7" />
    </svg>
  </main>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { ImportantThings } from "../ImportantFile";
import DoFeatureWork from "./DoFeatureWork.vue";
import CapabilityStock from "./CapabilityStock.vue";

@Component({
  components: {
    DoFeatureWork,
    CapabilityStock,
  },
})
export default class HelloWorld extends Vue {
  @Prop({ default: "Yo there" }) private msg!: string;

  @Prop({ required: true }) private importantThings!: ImportantThings;
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
