import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

function sendSomethingToHoneycomb() {
  const data = { hello: "jess" };
  fetch('https://api.honeycomb.io/1/events/featureclicker',
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'X-Honeycomb-Team': '430eb2f22c137f6ff63980a3a332b4ac'
      },
    })
    .then(response => {
      // console.log("Got from honeycomb: ", response);
      if (response.status === 200) {
        console.log("Transmitted to Honeycomb: ", data);
      } else {
        console.error("Failed to send data to Honeycomb: ", response);
      }
    });
}

sendSomethingToHoneycomb();

new Vue({
  render: h => h(App)
}).$mount("#app");

