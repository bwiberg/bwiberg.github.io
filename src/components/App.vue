<template>
    <div>
        <button @click="fetchProjects()">
            Load projects
        </button>
        <Modal v-if="currentProject">
            <ProjectModalContent slot="content"
                                 :project="currentProject"
                                 @close="currentProject = null"></ProjectModalContent>
        </Modal>
        <div class="main-content">
            <Ultragrid :items="projects" :padding="24">
                <template slot="item"
                          scope="props">
                    <transition name="project" appear>
                        <div class="project-card-container">
                            <div class="card -level-2 ultragrid-card -project"
                                 @click="openProjectModal(props.data, $event)"
                                 @mousemove="onMouseMove($event)"
                                 @mouseleave="onMouseLeave($event)">
                                <div class="title-container">
                                    <h3 class="title-text skew-5"><strong>{{ props.data.title }}</strong></h3>
                                </div>
                                <img :src="`${props.data.thumbnail}`"/>
                            </div>
                        </div>
                    </transition>
                </template>
                <template slot="placeholder" scope="props">
                    <div class="project-card-container">
                        <div class="card -level-2 ultragrid-card">
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
import Modal from './Modal';
import ProjectModalContent from './ProjectModalContent';

@Component({
    components: {
        Ultragrid, Modal, ProjectModalContent
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

        console.log(`∂x=${dx} ∂y=${dy}`);

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
        width: 60%;
        min-width: 600px;
        margin-left: auto;
        margin-right: auto;
    }
}

.overflow-hider {
    @include size(100%, 100%);
    overflow: hidden;
}

.project-card-container {
    perspective: 600px;
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
            max-width: 100%;
            max-height: 100%;
        }

        &:hover div.title-container {
            @include center(translateZ(4em));
        }
    }

}

div.title-container {
    @include transition(transform ease 0.3s);
    @include center();

    h3 {
        text-align: center;
        font-size: 1.2em;
        text-transform: uppercase;
    }
}

@include keyframes(fadein) {
    0% {
        opacity: 0;
        @include scale(0.1);
        @include transform-origin(top left);
    }
    99% {
        @include transform-origin(center);
    }
}
</style>
