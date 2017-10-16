/**
 * Created by benjamin on 7/11/17.
 */

export default class Vector2 {
    /** PUBLIC FIELDS **/

    readonly x: number;
    readonly y: number;

    /** PUBLIC METHODS **/

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(rhs: Vector2 | number): Vector2 {
        if (rhs instanceof Vector2)
            return new Vector2(this.x + rhs.x, this.y + rhs.y);
        return new Vector2(this.x + rhs, this.y + rhs);
    }

    sub(rhs: Vector2 | number): Vector2 {
        if (rhs instanceof Vector2)
            return new Vector2(this.x - rhs.x, this.y - rhs.y);
        return new Vector2(this.x - rhs, this.y - rhs);
    }

    mult(factor: number): Vector2 {
        return new Vector2(this.x * factor, this.y * factor);
    }

    normalized(): Vector2 {
        const length: number = Math.sqrt(this.x ** 2 + this.y ** 2);
        return new Vector2(this.x / length, this.y / length);
    }

    length2(): number {
        return this.x ** 2 + this.y ** 2;
    }

    length(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    equals(that: Vector2): boolean {
        return this.x === that.x && this.y === that.y;
    }

    /** PUBLIC STATIC MEMBERS **/

    static readonly zero: Vector2 = new Vector2(0, 0);
    static readonly one: Vector2 = new Vector2(1, 1);
}
