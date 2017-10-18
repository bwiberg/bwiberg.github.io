<template>
    <canvas ref="canvas" :width="width" :height="height"></canvas>
</template>

<script lang="ts">
import Vue from "vue"
import {Component, Inject, Provide, Model, Prop, Watch} from "vue-property-decorator";
import {
    State, Getter, Action, Mutation, namespace
} from "vuex-class";

@Component({
    components: {}
})
export default class CanvasDoodle extends Vue {
    @Prop() width: number;
    @Prop() height: number;

    protected context: CanvasRenderingContext2D;

    mounted(): void {
        const canvas: HTMLCanvasElement = this.refs.canvas;
        console.log(canvas);
    }
}
</script>
<style lang="scss" scoped>
@import "../../style/utils.scss";
</style>
