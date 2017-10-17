<template>
    <transition :name="transition" appear>
        <div class="modal-mask">
            <div class="modal-wrapper"
                 ref="wrapper"
                 @click="handleOutsideClick">
                <div class="modal-container card">
                    <slot name="content">
                        Default content
                        <button class="modal-default-button" @click="$emit('close')">
                            OK
                        </button>
                    </slot>
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

@Component({
    components: {}
})
export default class Modal extends Vue {
    @Prop({default: "modal-default"}) transition: string;
    @Prop({default: true}) closeOnOutsideClick: boolean;

    private handleOutsideClick(event: Event): void {
        if (event.target !== this.$refs.wrapper) {
            return;
        }

        this.$emit('close');
    }
}
</script>
<style lang="scss" scoped>
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
}

@include media(">phone", "<=tablet") {
    .modal-container {
        width: 100%;
        margin: 0;
    }
}

@include media(">tablet", "<=desktop") {
    .modal-container {
        width: 400px;
    }
}

@include media(">desktop") {
    .modal-container {
        width: 600px;
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
</style>
