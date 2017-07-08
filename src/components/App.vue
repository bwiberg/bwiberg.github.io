<template>
    <v-app dark>
        <v-toolbar class="primary">
            <v-toolbar-side-icon></v-toolbar-side-icon>
            <v-toolbar-title>Benjamin Wiberg</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
                <v-icon>more_vert</v-icon>
            </v-btn>
        </v-toolbar>
        <Ultragrid :data="['Item 1', 'Item 2', 'Item 3']">
            <template slot="item" scope="props">
                <div>
                    <p>{{ props.data }}</p>
                </div>
            </template>
        </Ultragrid>
    </v-app>
</template>

<script lang="ts">
import Vue from "vue"
import {Component, Inject, Provide, Model, Prop, Watch} from "vue-property-decorator";
import {
    State, Getter, Action, Mutation, namespace
} from "vuex-class";

import Ultragrid from "components/ultragrid/Ultragrid";

@Component({
    components: {
        Ultragrid
    }
})
export default class App extends Vue {
}
</script>
<style lang="scss" scoped>
$primaryFontSize: 36px;

div {
    h1 {
        font-size: $primaryFontSize;
    }
}
</style>
