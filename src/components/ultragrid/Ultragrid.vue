<template>
    <div class="ultragrid">
        <div v-for="item, index in data" :key="index" class="ultragrid-item">
            <slot name="item" :data="item"></slot>
        </div>
    </div>
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
export default class Ultragrid extends Vue {
    @Prop() data: any[];

    @Watch("$children")
    onChildrenChanged(newChildren: Vue[], oldChildren: Vue[]): void {
        console.log(newChildren);
    }
}
</script>
<style lang="scss" scoped>
</style>
