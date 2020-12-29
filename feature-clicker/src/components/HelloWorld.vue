<template>
  <main class="hello">
    <svg class="yo" width="800" height="400">
      Feature Clicker Goes Here
      <circle
        class="feature-work"
        cx="230"
        cy="100"
        stroke="black"
        fill="orange"
      />
      <text x="100" y="100" font-size="20" text-anchor="middle" fill="black">
        <tspan>Work on</tspan>
        <tspan x="100" dy="1.2em">features</tspan>
      </text>
    </svg>
  </main>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;
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

circle.feature-work {
  r: 70;
  transition-property: r;
  transition-duration: 0.5s;
}
circle.feature-work:active {
  r: 65;
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
