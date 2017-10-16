/**
 * Created by benjamin on 7/11/17.
 */

import Vector2 from './Vector2';

export default class Box {
    /** PUBLIC FIELDS **/

    readonly origin: Vector2;
    readonly extents: Vector2;

    /** PUBLIC METHODS **/

    // todo doc
    constructor(origin: Vector2, extents: Vector2) {
        this.origin = origin;
        this.extents = extents;
    }

    area(): number {
        return this.extents.length();
    }

    /** PUBLIC STATIC MEMBERS **/

    static readonly unit: Box = new Box(Vector2.zero, Vector2.one);
}
