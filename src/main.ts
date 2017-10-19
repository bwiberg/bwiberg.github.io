import Vue, {PluginObject} from "vue";

import "normalize.css/normalize.css";
import "style/theme.scss";

import VTooltip = require("v-tooltip");

import App from "components/App";
import store from "./store";

Vue.use(<PluginObject<{}>> VTooltip);

Vue.mixin({
    methods: {
        $info: function (arg: any) {
            console.info(arg);
        },

        $log: function (arg: any) {
            console.log(arg);
        },

        $warn: function (arg: any) {
            console.warn(arg);
        },

        $error: function (arg: any) {
            console.error(arg);
        },
    },
});

new Vue({
    el: "#app",
    store,
    render: h => h(App)
});
