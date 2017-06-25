/**
 * Created by javier.cuicapuza on 5/3/2017.
 */
export function AutoUnsubscribe( constructor ) {

    const original = constructor.prototype.ngOnDestroy;

    constructor.prototype.ngOnDestroy = function () {
        for ( let prop in this ) {
            const property = this[ prop ];
            if ( property && (typeof property.unsubscribe === "function") ) {
                property.unsubscribe();
            }
        }
        original && typeof original === "function" && original.apply(this, arguments);
        console.log('Finished autoUnsubscribe');
    };

}