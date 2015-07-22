# nnStorage
a pretty lightweight and simple to use localStorage and sessionStorage Module.
You don't have to worry about Browser support or stringify your objects.


```javascript
angular.module('test', [
    'nnStorage'//require the nnStorage Module
]).run([
    '$nnLocalStorage',//require the $nnLocalStorage (or $nnSessionStorage) Service
    function ($nnLocalStorage) {
        $nnLocalStorage.set('test', {a: (new Date()).getTime(), b: 4}); //Set any value
    }
]).run([
    '$nnLocalStorage',
    function ($nnLocalStorage) {
        console.log($nnLocalStorage.get('test')); //and get any key
    }
]).run([
    '$nnLocalStorage',
    function ($nnLocalStorage) {
        console.log($nnLocalStorage.get('test')) //everywhere the same object with the same values
    }
]);
```