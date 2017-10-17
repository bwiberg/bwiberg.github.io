<template>
    <div>
        <ProjectModal v-if="currentProject"
                      :project="currentProject"
                      @close="currentProject = null">
        </ProjectModal>
        <div class="main-content">
            <Ultragrid :items="projects" :padding="18" :randomness="0.3">
                <template slot="item"
                          scope="props">
                    <transition name="project" appear>
                        <div class="project-card-container">
                            <div class="card -level-2 ultragrid-card -project"
                                 @click="openProjectModal(props.data, $event)"
                                 @mousemove="onMouseMove($event)"
                                 @mouseleave="onMouseLeave($event)">
                                <div class="title-container">
                                    <h3 class="title-text">{{ props.data.title }}</h3>
                                </div>
                                <img v-if="props.data.thumbnail != ''" :src="`${props.data.thumbnail}`"/>
                            </div>
                        </div>
                    </transition>
                </template>
                <template slot="placeholder" scope="props">
                    <div class="project-card-container">
                        <div class="card -level-2 ultragrid-card -placeholder">
                            <!--<v-btn v-if="props.index + 1 === props.numPlaceholders"
                                   @click.native="loadProjects()">
                                Load more projects
                            </v-btn>-->
                        </div>
                    </div>
                </template>
            </Ultragrid>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue"
import {Component, Inject, Provide, Model, Prop, Watch} from "vue-property-decorator";
import {
    State, Getter, Action, Mutation, namespace
} from "vuex-class";

import Ultragrid from "components/ultragrid/Ultragrid";
import Array2D from './ultragrid/Array2D';
import SimpleWorker from '../thirdparty/simple-worker/index';
import UltragridItem from './ultragrid/props/UltragridItem';
import DomUtils from '../util/DomUtils';
import Project from '../Project';
import ProjectModal from './ProjectModal';

@Component({
    components: {
        Ultragrid, ProjectModal
    }
})
export default class App extends Vue {
    @Action fetchProjects: () => Promise<null>;
    @Getter projects: Project[];

    @Model() currentProject: Project | null = null;

    mounted() {
        this.fetchProjects();
    }

    openProjectModal(project: Project, event: MouseEvent) {
        this.currentProject = project;

        // clear hover effect
        const element: HTMLElement = <HTMLElement> event.currentTarget;
        element.style.webkitTransform = "";
        element.className = element.className.replace(" -hoverable", "");
    }

    onMouseMove(event: MouseEvent): void {
        const element: HTMLElement = <HTMLElement> event.currentTarget;
        const {top, left, width, height} = element.getBoundingClientRect();

        const factor: number = 0.025;
        const dx: number = left - event.clientX + width / 2;
        const dy: number = top - event.clientY + height / 2;

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
@import "../style/theme";
@import "../style/utils";

$primaryFontSize: 36px;

.project-enter-active, .project-leave-active {
    transition: opacity 0.25s ease-out;
}

.project-enter, .project-leave-to {
    opacity: 0;
}

div {
    h1 {
        font-size: $primaryFontSize;
    }

    &.main-content {
        margin-left: auto;
        margin-right: auto;
    }
}

@include media("<=tablet") {
    div.main-content {
        width: 100%;
        margin: 0;
    }
}

@include media(">tablet", "<=desktop") {
    div.main-content {
        width: 80%;
    }
}

@include media(">desktop") {
    div.main-content {
        width: 60%;
    }
}

.overflow-hider {
    @include size(100%, 100%);
    overflow: hidden;
}

.project-card-container {
    perspective: 400px;
    @include transform-style-preserve-3d();
    width: 100%;
    height: 100%;
    &:hover {
        z-index: 100;
    }
}

.ultragrid-card {
    width: 100%;
    height: 100% !important;
    margin: 0;
    @include animation(fadein 0.5s);
    @include transition(all ease 0.15s);
    @include transform-style-preserve-3d();

    &.-project {
        cursor: pointer;
        background-color: transparent;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;

        img {
            @include border-radius;
            @include size(100%, 100%);
            object-fit: cover;
            filter: grayscale(10%) brightness(75%) contrast(70%);
            transition: filter 0.25s ease;

            &:hover {
                filter: grayscale(0%) brightness(100%) contrast(100%);
            }
        }
    }

    &.-placeholder {
        background: #555760;
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
    }

    pointer-events: none;
}

@include keyframes(fadein) {
    0% {
        opacity: 0;
        @include scale(0.1);
        @include transform-origin(center);
    }
    99% {
        @include transform-origin(center);
    }
}

@include keyframes(translateZ-title) {
    50% {
        @include center(scale($div-title-container-scale));
    }
}
</style>
