"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by javier.cuicapuza on 3/6/2017.
 */
var GeneralTextMask = (function () {
    function GeneralTextMask() {
    }
    Object.defineProperty(GeneralTextMask, "datetimeMask", {
        get: function () { return [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(GeneralTextMask, "timeMask", {
        get: function () { return [/\d/, /\d/, ':', /\d/, /\d/]; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(GeneralTextMask, "datetime", {
        get: function () { return [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ':', /\d/, /\d/]; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(GeneralTextMask, "currencyMask", {
        get: function () { return [/\d/, /\d/, /\d/, /\d/, /\d/, ',', /\d/, /\d/]; },
        enumerable: true,
        configurable: true
    });
    ;
    return GeneralTextMask;
}());
GeneralTextMask.placerholderFormatDateTime = "MM/DD/YYYY HH:MM";
GeneralTextMask.placerholderFormatDate = "MM/DD/YYYY";
exports.GeneralTextMask = GeneralTextMask;
