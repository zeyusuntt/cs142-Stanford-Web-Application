'use strict';
/* 
1. declare the global function, cs142MakeMultiFilter, the parameter is original array. 
return the filter function arrayFilterer
2. arrayFilterer keeps track of a notion called currentArray. it takes two functions as parameters.
3. filterCriteria: 
    i. take the array element as parameter and return boolean
    ii. false, remove from the current arraylist
    iii. no function, immediately return the current array
4. callback: 
    i. take the value of current Array as an argument, no return
    ii. access this should reference the value original array
*/

function cs142MakeMultiFilter(originalArray) {
    let currentArray = originalArray;
    return function arrayFilterer(filterCriteria, callback) {
        if (typeof filterCriteria !== 'function') {
            return currentArray;
        }
        currentArray = currentArray.filter(filterCriteria);
        if (typeof callback === "function") {
            callback.call(originalArray,currentArray);
        }
        return arrayFilterer;
    };
}