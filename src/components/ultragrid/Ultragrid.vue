<template>
    <div class="ultragrid"
         :style="gridStyle">
        <div v-for="item, index in items"
             :key="index"
             class="ultragrid-tile"
             :style="tileStyle(index)">
            <slot name="item" :data="item"></slot>
        </div>
        <div v-for="style, index in placeholderLayouts"
             :key="index + items.length"
             class="ultragrid-tile"
             :style="style">
            <slot name="placeholder" :index="index" :numPlaceholders="placeholderLayouts.length"></slot>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue"
import _ = require("lodash");

import {Component, Inject, Provide, Model, Prop, Watch} from "vue-property-decorator";
import {
    State, Getter, Action, Mutation, namespace
} from "vuex-class";
import {Breakpoint, DefaultBreakpoints} from './props/Breakpoint';
import UltragridItem from './props/UltragridItem';
import SimpleWorker from '../../thirdparty/simple-worker/index';
import Array2D from './Array2D';
import Box from './util/Box';
import Utils from './util/Utils';
import Vector2 from './util/Vector2';

interface ItemPosition {
    row: number;
    col: number;
}

interface TileLayout {
    top: number;
    left: number;
    height: number;
    width: number;
}

const INVALID_NUMBER: -1 = -1;
const RESIZE: "resize" = "resize";
const ARRAY2D_INITIAL_ROWS: number = 20;
const ARRAY2D_INITIAL_COLS: number = 20;

@Component({
    components: {}
})
export default class Ultragrid extends Vue {
    @Prop({"default": () => []}) items: UltragridItem[];
    @Prop({"default": () => DefaultBreakpoints}) breakpoints: Breakpoint[];
    @Prop({"default": 4}) padding: number;

    @Model() pixelWidth: number = INVALID_NUMBER;
    @Model() itemPositions: ItemPosition[] = <ItemPosition[]>[];

    layoutArray2D: Array2D<number> = new Array2D(10, 10, INVALID_NUMBER);

    get tileLayouts(): TileLayout[] {
        const itemLayouts: TileLayout[] = <TileLayout[]>[];
        for(let i = 0; i < this.items.length; ++i) {
            let item: UltragridItem = this.items[i];
            let itemPosition: ItemPosition = this.itemPositions[i];
            const tileLayout: TileLayout = <TileLayout>{
                top: itemPosition.row * this.unitLength + this.padding,
                left: itemPosition.col * this.unitLength + this.padding,
                width: item.cols * this.unitLength - this.padding,
                height: item.rows * this.unitLength - this.padding,
            };

            itemLayouts[i] = tileLayout;
        }
        return itemLayouts;
    }

    get placeholderLayouts(): object[] {
        const placeholderLayouts: object[] = <object[]>[];
        this.layoutArray2D.forEach((value: number, row: number, col: number) => {
            if (row >= this.numRowsUsed) {
                return false;
            }
            if (value === INVALID_NUMBER) {
                const layout: object = {
                    top: `${row * this.unitLength + this.padding}px`,
                    left: `${col * this.unitLength + this.padding}px`,
                    width: `${this.unitLength - this.padding}px`,
                    height: `${this.unitLength - this.padding}px`,
                };
                placeholderLayouts.push(layout);
            }
            return true;
        });
        return placeholderLayouts;
    }

    get numRowsUsed(): number {
        return Math.max(0, ...this.itemPositions
            .map((itemPosition: ItemPosition, index: number) => itemPosition.row + this.items[index].rows));
    }

    get pixelHeight(): number {
        return this.numRowsUsed * this.unitLength + this.padding;
    }

    get unitLength(): number {
        if (this.columns < 1 || this.pixelWidth < 1) {
            return INVALID_NUMBER;
        }
        return (this.pixelWidth - this.padding) / this.columns;
    }

    get columns(): number {
        if (this.pixelWidth === INVALID_NUMBER) {
            return INVALID_NUMBER;
        }

        for(let breakpoint of this.breakpoints) {
            if (this.pixelWidth >= breakpoint.min && this.pixelWidth <= breakpoint.max) {
                return breakpoint.columns;
            }
        }

        return INVALID_NUMBER;
    }

    @Watch("items")
    onItemsUpdated(newData: any[], oldData: any[]): void {
        this.layoutTiles();
    }

    @Watch("pixelWidth")
    layoutTiles(): void {
        if (this.items.length === 0 || this.columns === INVALID_NUMBER || this.pixelWidth === INVALID_NUMBER) {
            return;
        }

        console.time("layoutTiles");

        const area: number = this.items
            .map((item: UltragridItem) => item.rows * item.cols)
            .reduce((sum: number, current: number) => sum + current);

        // recalculate item positions
        const itemPositions: ItemPosition[] = <ItemPosition[]>[];

        const numRowsGuess: number = 2 * Math.ceil(area / this.columns);

        const array2D: Array2D<number> = this.layoutArray2D;
        array2D.setActiveArea(numRowsGuess, this.columns);
        array2D.clear(INVALID_NUMBER);

        this.items.forEach((item: UltragridItem, i: number) => {
            Utils.forEach2D(new Vector2(array2D.rows + 1 - item.rows, array2D.cols + 1 - item.cols), (row: number, col: number) => {
                if (array2D.areaContainsOnly(row, col, item.rows, item.cols, -1)) {
                    array2D.setArea(row, col, item.rows, item.cols, i);

                    itemPositions[i] = <ItemPosition>{
                        row: row,
                        col: col
                    };
                    return Utils.STOP;
                }
                return Utils.CONTINUE;
            });
        });

        this.itemPositions = itemPositions;
        console.timeEnd("layoutTiles");
    }

    tileStyle(index: number): object {
        const tileLayout: TileLayout = this.tileLayouts[index];
        return {
            top: `${tileLayout.top}px`,
            left: `${tileLayout.left}px`,
            width: `${tileLayout.width}px`,
            height: `${tileLayout.height}px`
        }
    }

    get gridStyle(): object {
        return {
            height: `${this.pixelHeight}px`,
        };
    }

    placeholderIndex(index: number): number {
        return index + this.items.length;
    }

    mounted(): void {
        this.updatePixelWidth = _.debounce(() => {
            if (this.$el) {
                this.pixelWidth = this.$el.clientWidth;
            }
        }, 500);

        this.updatePixelWidth();
        window.addEventListener(RESIZE, this.onWindowResize, true)
    }

    beforeDestroy(): void {
        window.removeEventListener(RESIZE, this.onWindowResize, true);
    }

    onWindowResize(event: Event): void {
        this.updatePixelWidth();
    }

    updatePixelWidth: () => void;

    testArray2D(): void {
        const arr: Array2D<number> = new Array2D<number>(1, 1, 0);
        console.log("Expect [[0]]");
        console.log(arr.toString());

        arr.setActiveArea(10, 1);
        arr.clear(1);
        console.log("Expect [[1], x 10]")
        console.log(arr.toString());

        arr.setActiveArea(1, 12);
        arr.clear(2);
        console.log(arr.toString());

        console.log("Expect value===2 rows===0 and cols within [0, 11]");
        arr.forEach((value: number, row: number, col: number) => {
            console.log(`value=${value} row=${row} col=${col}`);
            return true;
        });
    }
}
</script>
<style lang="scss" scoped>
@import "../../style/utils";

.ultragrid {
    position: relative;
}

.ultragrid-tile {
    position: absolute;
    margin: 0 !important;
    padding: 0 !important;
    width: 100%;
    height: 100%;

    @include transition(top ease 0.5s, left ease 0.5s, height ease 0.5s, width ease 0.5s);
}
</style>
