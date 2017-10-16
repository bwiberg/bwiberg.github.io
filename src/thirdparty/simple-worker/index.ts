import Q = require('q');

declare function importScripts(...urls: string[]): void;

const workerSource: string = (function __workerEnv() {
    const functionRegExp: RegExp = /^function\s*([a-zA-Z0-9_$]*)\s*\(([a-zA-Z0-9_$,\s]*)\)\s*[^{]*{\s*([\d\D]*)\s*}[^}]*$/gim;

    function postResult(result: any) {
        self.postMessage(result, <string><any>undefined, undefined);
        self.close();
    }

    function deserializeFunction(functionText: string): any {
        const functionParts: RegExpExecArray = <RegExpExecArray> functionRegExp.exec(functionText);
        const functionArgs: any = functionParts[2].split(/\s*,\s*/);
        const functionBody: any = functionParts[3];

        return Function.apply(null, functionArgs.concat(functionBody));
    }

    self.onmessage = function (evt: any): any {
        const commandObject: any = evt.data;
        let invokeFn: any, invokeArguments: any, invokeResult: any;

        switch (commandObject.command.toLowerCase()) {
            case "import":
                importScripts.apply(null, commandObject.arguments);
                break;
            case "invoke":
                invokeFn = deserializeFunction(commandObject.arguments[0]);
                invokeArguments = commandObject.arguments.slice(1);

                invokeResult = invokeFn.apply(this, invokeArguments);

                // The result is a Promise-like object. Wait until it's resolved.
                if (invokeResult != null && typeof invokeResult.then == 'function') {
                    invokeResult.then(postResult)
                }
                // Has immediate value. Post back.
                else {
                    postResult(invokeResult)
                }
                break;
        }
    };
}).toString().replace(/^[^{]*{\s*([\d\D]*)\s*}[^}]*$/, '$1');

const workerBlob: Blob = new Blob([workerSource]);
const workerUrl: string = window.URL.createObjectURL(workerBlob);

// Transform relative script URLs into absolute URLs
function getScriptUrl(scriptPath: string): string {
    const absoluteUrlRegExp: RegExp = /^https?:/;
    if (absoluteUrlRegExp.test(scriptPath)) {
        return scriptPath;
    }

    return location.protocol + "//" + location.hostname +
        (location.port && ":" + location.port) + "/" + scriptPath;
}

export default function SimpleWorker<T>(workerFunction: Function, ...imports: string[]): (...args: any[]) => Q.Promise<T> {
    const importUrls: string[] = (imports || []).map(getScriptUrl);

    return function __SimpleWorker_Run__(...args: any[]) {
        const worker: Worker = new Worker(workerUrl),
            deferred = Q.defer<T>();

        worker.addEventListener('message', function (evt) {
            deferred.resolve(evt.data);
        }, false);

        worker.addEventListener('error', function (errorEvent) {
            deferred.reject(errorEvent);
        }, false);

        worker.postMessage({
            command: "import",
            arguments: importUrls
        });

        worker.postMessage({
            command: "invoke",
            arguments: [workerFunction.toString()]
                .concat([].slice.call(arguments))
        });

        return deferred.promise;
    };
};
