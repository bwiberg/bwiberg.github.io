<template>
    <div class="project-modal">
        <div class="section header"
             :style="{'background-color': project.color}">
            <h1>{{ project.title }}</h1>
            <div class="close"
                 @click="$emit('close')">
                <svg viewbox="0 0 40 40" width="48px" height="48px">
                    <path class="close-x" d="M 10,10 L 30,30 M 30,10 L 10,30"/>
                </svg>
            </div>
        </div>
        <div class="section content">
            <div class="description">
                <p v-for="section in descriptionSections">
                    {{ section }}
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue"
import {Component, Inject, Provide, Model, Prop, Watch} from "vue-property-decorator";
import {
    State, Getter, Action, Mutation, namespace
} from "vuex-class";
import Project from '../Project';

@Component({
    components: {}
})
export default class ProjectModalContent extends Vue {
    @Prop() project: Project;

    get descriptionSections(): string[] {
        return this.project.description.split("\n\n");
    }
}
</script>
<style lang="scss" scoped>
@import "../style/utils.scss";

div.project-modal {
    @include center();
    @include size(100%, 100%);
    display: inline-block;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
}

div.section {
    padding-left: 20px;
    padding-right: 20px;
}

div.section.header {
    position: relative;
    h1 {
        display: inline-block;
        margin: 0;
        padding: 0.67em 0;
    }
    div.close {
        display: inline-block;
        @include vertical-align(absolute);
        right: 12px;
        margin: 0;
        width: 48px;
        height: 48px;
        background: #DDD;
        border-radius: 50%;

        svg  {
            border: solid 4px black;

            .close-x {
                stroke: black;
                fill: transparent;
                stroke-linecap: round;
                stroke-width: 2;
            }
        }
    }
}
</style>
