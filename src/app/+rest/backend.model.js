/**
 * Created by josediaz on 22/02/2017.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RequestTypes;
(function (RequestTypes) {
    RequestTypes[RequestTypes["get"] = 0] = "get";
    RequestTypes[RequestTypes["post"] = 1] = "post";
    RequestTypes[RequestTypes["put"] = 2] = "put";
    RequestTypes[RequestTypes["delete"] = 3] = "delete";
    RequestTypes[RequestTypes["patch"] = 4] = "patch";
    RequestTypes[RequestTypes["head"] = 5] = "head";
    RequestTypes[RequestTypes["options"] = 6] = "options";
})(RequestTypes = exports.RequestTypes || (exports.RequestTypes = {}));
