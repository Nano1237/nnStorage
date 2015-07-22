/**
 * @preserve Copyright 2015 Tim Ruecker.
 */
(function (window, angular, undefined) {
    angular.module('nnStorage', [])
        .service('$nnLocalStorage', storageServiceBuilder('localStorage'))
        .service('$nnSessionStorage', storageServiceBuilder('sessionStorage'));

    /**
     * @description
     * This Function creates a Service Object for the needed Storage API (localStorage and/or sessionStorage)
     * @param {string} storageType A string that contains the name of the Storage API (localStorage or sessionStorage is possible)
     * @returns {StorageFactory}
     */
    function storageServiceBuilder(storageType) {
        //
        StorageFactory.$inject = ['$window'];
        return StorageFactory;
        /**
         * @ngdoc service
         * @name nnStorage.service:$nnLocalStorage
         * @description
         * A custom localStorage Provider with fallback solution and object support.
         */
        /**
         * @ngdoc service
         * @name nnStorage.service:$nnSessionStorage
         * @description
         * A custom sessionStorage Provider with fallback solution and object support.
         */
        function StorageFactory($window) {

            var publicStorage = {get: getter, set: setter, remove: remove},
                privateStorage = isStorageSupported(storageType) ? $window[storageType] : new AlternateStorage();
            return publicStorage;

            /**
             * @description
             * This Storage is used if the Browser doesnt supports the local or session storage at the moment.
             * @name AlternateStorage
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
                this.removeItem = function (key) {
                    delete elements[key];
                    return undefined;
                };
            }

            /**
             *
             * @description
             * The original code can be found here https://github.com/gsklee/ngStorage but this Function is a little bit different
             * @param storageType
             * @returns {boolean} true if the browser supports the local/sessionStorages
             */
            function isStorageSupported(storageType) {
                var supported, key;
                // Some installations of IE, for an unknown reason, throw "SCRIPT5: Error: Access is denied"
                // when accessing window.localStorage. This happens before you try to do anything with it. Catch
                // that error and allow execution to continue.

                // fix 'SecurityError: DOM Exception 18' exception in Desktop Safari, Mobile Safari
                // when "Block cookies": "Always block" is turned on
                try {
                    supported = angular.isObject($window[storageType]);
                } catch (err) {
                    supported = false;
                }

                // When Safari (OS X or iOS) is in private browsing mode, it appears as though localStorage
                // is available, but trying to call .setItem throws an exception below:
                // "QUOTA_EXCEEDED_ERR: DOM Exception 22: An attempt was made to add something to storage that exceeded the quota."
                if (supported && storageType === 'localStorage') {
                    key = '__' + Math.round(Math.random() * 1e7);

                    try {
                        $window[storageType].setItem(key, key);
                        $window[storageType].removeItem(key);
                    } catch (err) {
                        supported = false;
                    }
                }
                return supported;
            }

            /**
             * @description
             * Removes the item from the localStorage
             * @methodOf AlternateStorage
             * @param {string} key the key of the element
             */

            function remove(key) {
                return privateStorage.removeItem(key);
            }

            /**
             * @description
             * Sets the passed value to the storage.
             * Values are parsed to strings.
             * @methodOf AlternateStorage
             * @param {string} key the key of the element
             * @param {*} value Any value that could be stored as string
             */
            function setter(key, value) {
                if (angular.isObject(value)) {
                    value = $window.JSON.stringify(value);
                }
                return privateStorage.setItem(key, value);
            }

            /**
             * @description
             * Returns the wanted value
             * @methodOf AlternateStorage
             * @param {string} key the key of the element
             * @returns {*}
             */
            function getter(key) {
                var value = privateStorage.getItem(key), ret;
                if (!angular.isString(value)) {//if the value received from the storage is not a string (nearly impossible)
                    return undefined;
                }
                try {//try to parse the value (works for everything except string without quotation marks)
                    ret = $window.JSON.parse(value);
                } catch (error) {
                    if (value.length) {//if it is a string without quotation marks
                        ret = value;
                    }
                }
                return ret;
            }

        }
    }
})(window, angular);