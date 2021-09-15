import Vue from "vue";
import App from "./App.vue";
import { sendSomethingToHoneycomb } from "./system/honeycomb";

Vue.config.productionTip = false;


const data = { hello: "jess" };

sendSomethingToHoneycomb(data);

new Vue({
  render: h => h(App)
}).$mount("#app");

