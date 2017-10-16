<template>
    <transition :name="transition">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <slot name="content">
                    <div class="modal-container">
                        Default content
                        <button class="modal-default-button" @click="$emit('close')">
                            OK
                        </button>
                    </div>
                </slot>
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
export default class App extends Vue {
    @Prop({default: "modal-default"}) transition: string;
}
</script>
<style lang="scss" scoped>
@import "../style/utils";

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
    width: 200px;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
}

.modal-default-button {
    float: right;
}

.modal-default-enter, .modal-default-leave-active {
    opacity: 0;
    .modal-container {
        @include translate(0, -50px);
    }
}
</style>
