<template>
    <transition :name="transition" appear>
        <div class="modal-mask">
            <div class="modal-wrapper"
                 ref="wrapper"
                 @click="handleOutsideClick">
                <section class="modal-container card">
                    <!--<div class="section header"
                         :style="{'background-color': project.color}">-->
                    <header>
                        <h1>{{ project.title }}</h1>
                        <div class="close"
                             @click="$emit('close')">
                            <span class="x"></span>
                        </div>
                    </header>
                    <article>
                        <!--<div class="tags">
                            <span v-for="tag in project.tags">{{ tag }}</span>
                        </div>-->
                        <div class="description" v-html="markdownToHtml">
                            <!--<p v-for="section in descriptionSections">
                                {{ section }}
                            </p>-->
                        </div>
                        <div class="youtube"
                             v-if="project.youtube">
                            <iframe width="560"
                                    height="315"
                                    :src="project.youtube"
                                    frameborder="0"
                                    allowfullscreen></iframe>
                        </div>
                    </article>
                    <footer v-if="hasLinks" class="links">
                        <div>
                            <div class="github" v-if="project.github">
                                <a :href="project.github" target="_blank">
                                    <i class="octicon octicon-mark-github"></i>
                                    <span>Source</span>
                                </a>
                            </div>
                            <div class="webpage" v-if="project.webpage">
                                <a :href="project.webpage" target="_blank">
                                    <i class="octicon octicon-globe"
                                       :class="'octicon-' + project.webpageOcticon"></i>
                                    <span>{{ project.webpageLabel }}</span>
                                </a>
                            </div>
                        </div>
                    </footer>
                </section>
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
import * as MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

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

        this.$emit("close");
    }

    get hasLinks(): boolean {
        return !!this.project.github || !!this.project.webpage;
    }

    get markdownToHtml(): string {
        return md.render(this.project.description);
    }

    mounted(): void {
        let className: string = document.body.className;
        if (className.includes("modal-open")) {
            return;
        }

        let klass: string = "modal-open";
        if (className.length > 0) {
            klass = " " + klass;
        }
        className += klass;
        document.body.className = className;

        window.addEventListener("keydown", this.onKeyDown.bind(this));
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.keyCode == 27) {
            // ESC
            this.$emit("close");
        }
    }

    beforeDestroy(): void {
        let className: string = document.body.className;
        className = className.replace(" modal-open", "").replace("modal-open", "");
        document.body.className = className;

        window.removeEventListener("keydown", this.onKeyDown.bind(this));
    }
}
</script>
<style lang="scss">
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
    @include size(100%, 100%);
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: all .3s ease;
}

.modal-wrapper {
    //    @include center();
    position: relative;
    @include size(100%, 100%);
}

section.modal-container {
    display: flex;
    flex-direction: column;

    @include center();
    height: auto;
    max-height: 90%;

    header, article, footer {
        &:not(:first-child) {
            border-top: 1px solid #eeeeee;
        }

        $verticalPadding: .5em;
        $horizontalPadding: .5em;
        padding: $verticalPadding $horizontalPadding $verticalPadding $horizontalPadding;
    }

    header {
        @include border-radius(top-left top-right);
        flex-shrink: 0;
        position: relative;

        h1 {
            display: inline-block;
            margin: 0;
        }
        div.close {
            cursor: pointer;
            display: inline-block;
            @include vertical-align(absolute);
            right: 12px;
            margin: 0;
            padding: .4em;
            @include size(36px, 36px);
        }
    }

    article {
        flex: 1 1 auto;
        overflow-y: auto;
        min-height: 0px;

        :last-child {
            margin-bottom: 1em;
        }

        .tags {
            span {
                background-color: lightgrey;
                border-radius: 5px;
                padding-left: .2em;
                padding-right: .2em;
                margin-right: 0.6em;
            }
        }

        .description {

        }

        .youtube {
            iframe {
                display: block;
                margin: auto;
            }
        }

        .images {

        }
    }

    footer.links {
        text-align: center;

        a {
            white-space: nowrap;
            text-decoration: none;
            color: $linkBlue;
            transition: color .1s ease;
            &:not(:hover) {
                color: black;
            }
            &:before {
                background-color: transparent;
            }
        }

        div {
            margin: 0;
            padding: 0;
            display: inline-block;

            div {
                &:not(:first-child) {
                    margin-left: 1em;
                }
            }
        }
    }
}

@include media("<=tablet") {
    .modal-container {
        @include transform(translate(0, 0));
        top: 0%;
        left: 0%;
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

    div {
        &:first-child {
            margin-top: 1em;
        }
        margin-bottom: 1em;
    }
}
</style>
