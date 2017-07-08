<template>
    <v-app dark>
        <v-toolbar class="primary">
            <v-toolbar-side-icon></v-toolbar-side-icon>
            <v-toolbar-title>Vue.js, Vuetify.js and TypeScript template</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
                <v-icon>search</v-icon>
            </v-btn>
            <v-btn icon>
                <v-icon>apps</v-icon>
            </v-btn>
            <v-btn icon>
                <v-icon>refresh</v-icon>
            </v-btn>
            <v-btn icon>
                <v-icon>more_vert</v-icon>
            </v-btn>
        </v-toolbar>
    </v-app>
</template>

<script lang="ts">
    import Vue from "vue"
    import {Component, Inject, Provide, Model, Prop, Watch} from "vue-property-decorator";
    import {
        State, Getter, Action, Mutation, namespace
    } from "vuex-class";

    @Component({
        components: {
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
