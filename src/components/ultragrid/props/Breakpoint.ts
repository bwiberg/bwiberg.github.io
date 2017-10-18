/**
 * Created by benjamin on 7/12/17.
 */

export class Breakpoint {
    readonly min: number;
    readonly max: number;
    readonly columns: number;

    constructor(min: number, max: number, columns: number) {
        if (max <= min) {
            throw new Error(`Breakpoint: min (${min}) must be less than max (${max}).`);
        }
        if (columns < 1) {
            throw new Error(`Breakpoints: columns (${columns}) must be at least 1.`);
        }
        this.min = min;
        this.max = max;
        this.columns = columns;
    }
}

export const DefaultBreakpoints: Breakpoint[] = [
    [1, 479, 2],
    [480, 639, 3],
    [640, 767, 4],
    [768, 2**16, 6]
].map(arr => new Breakpoint(arr[0], arr[1], arr[2]));
