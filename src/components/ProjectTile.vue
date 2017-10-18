<template>
    <transition name="project" appear>
        <div class="project-card-container">
            <div class="card -level-2 ultragrid-card -project"
                 @click="$emit('click', $event)"
                 @mousemove="onMouseMove($event)"
                 @mouseleave="onMouseLeave($event)">
                <div class="title-container">
                    <h3 v-if="imageIsLoaded"
                        class="title-text"
                        :class="project.title.toLowerCase().includes('about') ? 'about' : ''">{{ project.title }}</h3>
                </div>
                <div v-if="!imageIsLoaded" class="sk-double-bounce">
                    <div class="sk-child sk-double-bounce1"></div>
                    <div class="sk-child sk-double-bounce2"></div>
                </div>
                <img v-if="project.thumbnail != ''"
                     v-show="imageIsLoaded"
                     ref="thumbnail"
                     :src="`${project.thumbnail}`"/>
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
export default class ProjectTile extends Vue {
    @Prop() project: Project;

    private imageIsLoaded: boolean = false;

    mounted(): void {
        const thumbnail: HTMLImageElement = <HTMLImageElement> this.$refs.thumbnail;

        const callback = () => {
            this.imageIsLoaded = true;
            thumbnail.removeEventListener("load", callback);
        };

        if (thumbnail.complete) {
            callback();
        } else {
            thumbnail.addEventListener("load", callback);
            thumbnail.addEventListener("error", (e) => console.error(e));
        }
    }

    onMouseMove(event: MouseEvent): void {
        const element: HTMLElement = <HTMLElement> event.currentTarget;
        const {top, left, width, height} = element.getBoundingClientRect();

        const factor: number = 4;
        const dx: number = (left - event.clientX + width / 2) / width;
        const dy: number = (top - event.clientY + height / 2) / height;

        // console.log(`∂x=${dx} ∂y=${dy}`);

        element.style.webkitTransform = `rotateY(${-factor * dx}deg) rotateX(${factor * dy}deg) translateZ(1em)`;
        if (!element.className.includes("-hoverable")) {
            element.className = element.className + " -hoverable";
        }
    }

    onMouseLeave(event: MouseEvent): void {
        const element: HTMLElement = <HTMLElement> event.currentTarget;
        element.style.webkitTransform = "";
    }
}
</script>
<style lang="scss" scoped>
@import "../style/theme.scss";
@import "../style/utils.scss";
@import '../../node_modules/spinkit/scss/spinners/2-double-bounce';

$projectTransitionDuration: 0.1s;
$projectTransitionInterp: ease-out;
.ultragrid-card {
    &.-project {
        cursor: pointer;
        background-color: lightgrey;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        transition: transform $projectTransitionDuration $projectTransitionInterp;

        img {
            @include border-radius;
            @include size(100%, 100%);
            object-fit: cover;
            filter: grayscale(40%) brightness(75%) contrast(70%);
            transition: filter $projectTransitionDuration $projectTransitionInterp;

            &:hover {
                filter: grayscale(0%) brightness(100%) contrast(100%);
            }
        }

        div.sk-double-bounce {
            @include center();
            margin: 0;
            padding: 0;
            @include size(60px, 60px);
        }
    }
}

$div-title-container-translationZ: 6em;
$div-title-container-scale: 0.75;
div.title-container {
    @include animation(translateZ-title 1.0s ease);
    @include center(translateZ($div-title-container-translationZ) scale($div-title-container-scale));

    h3 {
        font-size: 1.7em;
        letter-spacing: 1px;
        text-align: center;
        text-transform: uppercase;
        color: white;
        text-shadow: 0px 0px 8px rgba(0, 0, 0, 1.0);
        pointer-events: none;

        &.about {
            text-shadow: 0px 0px 8px rgba(0, 0, 0, 0);
            color: transparent;
        }
    }

    pointer-events: none;
}
</style>
