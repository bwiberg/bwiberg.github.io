<template>
    <transition :name="transition" appear>
        <div class="modal-mask">
            <div class="modal-wrapper"
                 ref="wrapper"
                 @click="handleOutsideClick">
                <div class="modal-container card">
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
            </div>
        </div>
    </transition>
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
export default class ProjectModal extends Vue {
    @Prop({default: "modal-default"}) transition: string;
    @Prop({default: true}) closeOnOutsideClick: boolean;
    @Prop() project: Project;

    get descriptionSections(): string[] {
        return this.project.description.split("\n\n");
    }

    private handleOutsideClick(event: Event): void {
        if (event.target !== this.$refs.wrapper) {
            return;
        }

        this.$emit('close');
    }
}
</script>
<style lang="scss" scoped>
@import "../style/theme";
@import "../style/utils";

.modal-enter-active, .modal-leave-active {
    transition: transform 10s ease;
}

.modal-enter, .modal-leave-to {
    opacity: 0;
    @include scale(0.8);
}

.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: all .3s ease;
}

.modal-wrapper {
    display: table-cell;
    vertical-align: middle;
}

.modal-container {
    @include center();
    height: auto !important;
    overflow: auto;
    display: block;
}

@include media(">phone", "<=tablet") {
    .modal-container {
        width: 100%;
        margin: 0;
    }
}

@include media(">tablet", "<=desktop") {
    .modal-container {
        width: 600px;
    }
}

@include media(">desktop") {
    .modal-container {
        width: 800px;
    }
}

.modal-default-button {
    float: right;
}

.modal-default-enter-active, .modal-default-leave-active {
    transition: all 0.2s ease;
}

.modal-default-enter, .modal-default-leave-to {
    opacity: 0;
}

div.section {
    padding-left: 20px;
    padding-right: 20px;
}

div.section.header {
    position: relative;
    @include border-radius(top-left top-right);

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
