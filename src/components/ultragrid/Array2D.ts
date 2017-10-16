import Vector2 from './util/Vector2';
/**
 * Created by benjamin on 7/11/17.
 */

export default class Array2D<T> {
    /** PUBLIC FIELDS **/

    rows: number;
    cols: number;
    readonly data: T[][]; // T[rows][cols]

    /** PRIVATE FIELDS **/


    /** PUBLIC METHODS **/

    // todo doc
    constructor(rows: number, columns: number, initialData: T | T[][]) {
        this.rows = rows;
        this.cols = columns;

        if (Array.isArray(initialData)) {
            const arrayData: T[][] = <T[][]>initialData;
            if (arrayData.length === this.rows && arrayData.every(row => row.length === this.cols)) {
                this.data = initialData;
            } else {
                throw new Error("initialData array don't match rows/columns");
            }
        } else {
            this.data = [];
            for(let row = 0; row < this.rows; ++row) {
                this.data.push(Array
                    .apply(null, Array(this.cols))
                    .map((entry: any) => initialData)
                );
            }
        }
    }

    setActiveArea(rows: number, cols: number): void {
        this.rows = rows;
        this.cols = cols;

        if (this.data[0].length < cols) {
            for(let row = 0; row < this.data.length; ++row) {
                this.data[row].length = cols;
            }
        }

        if (this.data.length < rows) {
            for(let row = this.data.length; row < rows; ++row) {
                const column: T[] = <T[]>[];
                column.length = cols;
                this.data[row] = column;
            }
        }
    }

    clear(value: T): void {
        for(let row = 0; row < this.data.length; ++row) {
            for(let col = 0; col < this.data[0].length; ++col) {
                this.data[row][col] = value;
            }
        }
    }

    areaContainsOnly(startRow: number, startCol: number, height: number, width: number, value: T): boolean {
        if (startRow < 0)                   throw new Error("startRow < 0");
        if (startRow + height > this.rows) throw new Error("startRow + height >= this.rows");
        if (startCol < 0)                   throw new Error("startCol < 0");
        if (startCol + width > this.cols)  throw new Error("startCol + width >= this.cols");

        for(let row = startRow; row < startRow + height && row < this.rows; ++row) {
            for(let col = startCol; col < startCol + width && col < this.cols; ++col) {
                if (this.data[row][col] !== value) {
                    return false;
                }
            }
        }
        return true;
    }

    setArea(startRow: number, startCol: number, height: number, width: number, value: T | Array2D<T>): void {
        if (startRow < 0)                   throw new Error("startRow < 0");
        if (startRow + height > this.rows) throw new Error("startRow + height >= this.rows");
        if (startCol < 0)                   throw new Error("startCol < 0");
        if (startCol + width > this.cols)  throw new Error("startCol + width >= this.cols");

        for(let row = startRow; row < startRow + height && row < this.rows; ++row) {
            for(let col = startCol; col < startCol + width && col < this.cols; ++col) {
                this.data[row][col] = value instanceof Array2D ?
                    (<any>value).rows[row][col] : value;
            }
        }
    }

    forEach(cb: (value: T, row: number, col: number) => boolean): Vector2 | true {
        for(let row = 0; row < this.rows; ++row) {
            for(let col = 0; col < this.cols; ++col) {
                if (!cb(this.data[row][col], row, col)) {
                    return new Vector2(row, col);
                }
            }
        }
        return true;
    }

    toString(): string {
        const rows: string[] = <string[]>[];

        for(let i = 0; i < this.data.length; ++i) {
            let row: T[] = <T[]>[];
            for(let j = 0; j < this.data[0].length; ++j) {
                row.push(this.data[i][j]);
            }
            rows.push(`[${row.join()}]`);
        }

        return `[${rows.join(',\n ')}]`;
    }

    equals(that: Array2D<T>): boolean {
        if (this.rows !== that.rows || this.cols !== that.cols) {
            return false;
        }

        for(let row = 0; row < this.data.length; ++row) {
            for(let col = 0; col < this.data[0].length; ++col) {
                if (this.data[row][col] !== that.data[row][col]) {
                    return false;
                }
            }
        }
        return true;
    }
}
