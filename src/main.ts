import Vue from "vue";

import "normalize.css/normalize.css";

import "vuetify/dist/vuetify.min.css";
import Vuetify from "vuetify";

import App from "components/App";
import store from "./store";

Vue.use(Vuetify);

new Vue({
    el: "#app",
    store,
    render: h => h(App)
});
