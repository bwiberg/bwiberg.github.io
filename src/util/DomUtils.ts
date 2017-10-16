/**
 * Created by benjamin on 7/22/17.
 */

export default class DomUtils {
    /** PRIVATE METHODS **/

    private constructor() {

    }

    /** PUBLIC STATIC MEMBERS **/

    static getAbsolutePosition(element: HTMLElement): {top: number, left: number} {
        let top = 0, left = 0;
        do {
            top += element.offsetTop  || 0;
            left += element.offsetLeft || 0;
            element = <HTMLElement> element.offsetParent;
        } while(element);

        return {
            top: top,
            left: left
        };
    }

    /** PRIVATE STATIC MEMBERS **/

}
