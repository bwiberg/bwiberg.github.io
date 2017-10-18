<template>
    <div>
        <ProjectModal v-if="currentProject"
                      :project="currentProject"
                      @close="currentProject = null">
        </ProjectModal>
        <div class="main-content">
            <Ultragrid :items="projects" :padding="18" :randomness="0.65" :seed="2">
                <template slot="item"
                          scope="props">
                    <ProjectTile :project="props.data"
                                 @click="openProjectModal(props.data, $event)"></ProjectTile>
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
import ProjectTile from './ProjectTile';

const PreloadImageURLs: string[] = [
    "https://s1.imgsha.com/2017/10/18/kRm6E.md.jpg",
    "https://s1.imgsha.com/2017/10/17/GByeF.md.jpg",
    "https://s1.imgsha.com/2017/10/17/GuKT2.jpg",
    "https://s1.imgsha.com/2017/10/17/GTMvy.md.jpg",
    "https://s1.imgsha.com/2017/10/17/GTRWs.jpg",
    "https://s1.imgsha.com/2017/10/17/GzZmd.md.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Vue.js_Logo.svg/480px-Vue.js_Logo.svg.png",
];

@Component({
    components: {
        Ultragrid, ProjectTile, ProjectModal
    }
})
export default class App extends Vue {
    @Action fetchProjects: () => Promise<null>;
    @Getter projects: Project[];

    @Model() currentProject: Project | null = null;

    beforeCreate(): void {
        // preload images
    }

    mounted(): void {
        this.fetchProjects();
    }

    openProjectModal(project: Project, event: MouseEvent) {
        this.currentProject = project;

        // clear hover effect
        const element: HTMLElement = <HTMLElement> event.currentTarget;
        element.style.webkitTransform = "";
        element.className = element.className.replace(" -hoverable", "");
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
        width: map-get($breakpoints, "tablet") - 50px;
    }
}

@include media(">desktop") {
    div.main-content {
        width: map-get($breakpoints, "desktop") - 50px;
    }
}

@include media(">1200px") {
    div.main-content {
        width: 1150px;
    }
}

.overflow-hider {
    @include size(100%, 100%);
    overflow: hidden;
}

.ultragrid-card {
    &.-placeholder {
        background: #555760;
    }
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
