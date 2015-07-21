(function (window, angular, undefined) {
    var module = angular.module('nnStorage', []);
    module.factory('$nnLocalStorage', LocalSessionStorage('localStorage'));
    module.factory('$nnSessionStorage', LocalSessionStorage('sessionStorage'));


    function LocalSessionStorage(storageType) {
        //
        StorageFactory.$inject = ['$window'];
        return StorageFactory;
        //
        //
        function StorageFactory($window) {

            var storage = {get: getter, set: setter},
                storageObject = getHtml5Storage(storageType);
            return storage;

            /**
             * @description
             * This Storage is used if the Browser doesnt supports the local or session storage at the moment.
             * @constructor
             */
            function AlternateStorage() {
                var elements = {};
                this.setItem = function (key, value) {
                    elements[key] = value;
                };
                this.getItem = function (key) {
                    return elements[key];
                };
            }

            /**
             * @description
             * The original code can be found here https://github.com/gsklee/ngStorage
             * @param storageType
             * @returns {*}
             */
            function getHtml5Storage(storageType) {
                var supported, key;
                // Some installations of IE, for an unknown reason, throw "SCRIPT5: Error: Access is denied"
                // when accessing window.localStorage. This happens before you try to do anything with it. Catch
                // that error and allow execution to continue.

                // fix 'SecurityError: DOM Exception 18' exception in Desktop Safari, Mobile Safari
                // when "Block cookies": "Always block" is turned on
                try {
                    supported = $window[storageType];
                } catch (err) {
                    supported = new AlternateStorage();
                }

                // When Safari (OS X or iOS) is in private browsing mode, it appears as though localStorage
                // is available, but trying to call .setItem throws an exception below:
                // "QUOTA_EXCEEDED_ERR: DOM Exception 22: An attempt was made to add something to storage that exceeded the quota."
                if (supported && storageType === 'localStorage') {
                    key = '__' + Math.round(Math.random() * 1e7);

                    try {
                        localStorage.setItem(key, key);
                        localStorage.removeItem(key);
                    } catch (err) {
                        supported = new AlternateStorage();
                    }
                }
                return supported;
            }

            /**
             * @description
             * Sets the passed value to the storage.
             * Values are parsed to strings.
             * @param {string} key the key of the element
             * @param {*} value Any value that could be stored as string
             */
            function setter(key, value) {
                if (angular.isObject(value)) {
                    value = $window.JSON.stringify(value);
                }
                storageObject.setItem(key, value);
            }

            /**
             * @description
             * Returns the wanted value
             * @param {string} key the key of the element
             * @returns {*}
             */
            function getter(key) {
                var value = storageObject.getItem(key), ret;
                if (!angular.isString(value)) {//if the value received from the storage is not a string (nearly impossible)
                    return;
                }
                try {
                    ret = $window.JSON.parse(value);
                } catch (error) {
                    if (value.length) {//somebody could have stored a string without quotation marks
                        ret = value;
                    }
                }
                return ret;
            }

        }
    }
})(window, angular)