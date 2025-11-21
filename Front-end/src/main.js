import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import VueSimpleAlert from "vue-simple-alert";
import BootstrapVue from "bootstrap-vue";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.use(BootstrapVue);
Vue.use(VueSimpleAlert);

// Global error handler with redirect on auth errors
Vue.prototype.$alertError = function(error, title = "Erro") {
  const message = error.message || error;

  this.$alert(message, title, "error").then(() => {
    // If authorization error, redirect to home with full page refresh
    if (message.includes("autorizado")) {
      window.location.href = "/";
    }
  });
};

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
