/**
 * Created by benjamin on 7/20/17.
 */

import Vector2 from './Vector2';

export default class Utils {
    private constructor() {

    }

    /** PUBLIC STATIC MEMBERS **/

    static readonly CONTINUE: true = true;
    static readonly STOP: false = false;

    static forEach2D(dimensions: Vector2, processor: (x: number, y: number) => boolean): Vector2 | true {
        for (let x = 0; x < dimensions.x; ++x) {
            for (let y = 0; y < dimensions.y; ++y) {
                if (processor(x, y) === Utils.STOP) {
                    return new Vector2(x, y);
                }
            }
        }
        return true;
    }

    /** PRIVATE STATIC MEMBERS **/

}
