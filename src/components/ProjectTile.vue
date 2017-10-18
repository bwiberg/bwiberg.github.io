<template>
    <transition name="project" appear>
        <div class="project-card-container">
            <div class="card -level-2 ultragrid-card -project"
                 @click="$emit('click', $event)"
                 @mousemove="onMouseMove($event)"
                 @mouseleave="onMouseLeave($event)">
                <div class="title-container">
                    <h3 class="title-text">{{ project.title }}</h3>
                </div>
                <img v-if="project.thumbnail != ''"
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
            console.log("onThumbnailLoaded()");
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
@import "../style/theme.scss";
@import "../style/utils.scss";

.ultragrid-card {
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
            filter: grayscale(40%) brightness(75%) contrast(70%);
            transition: filter 0.25s ease;

            &:hover {
                filter: grayscale(0%) brightness(100%) contrast(100%);
            }
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
    }

    pointer-events: none;
}
</style>
