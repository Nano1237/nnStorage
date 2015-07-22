'use strict';

/* global describe, beforeEach, it, module, inject, expect, chai */

describe('ngStorage', function () {
    var expect = chai.expect;

    beforeEach(module('nnStorage'));

    it('should contain a $nnLocalStorage service', inject(function ($nnLocalStorage) {
        expect($nnLocalStorage).not.to.equal(null);
    }));

    it('should contain a $nnSessionStorage service', inject(function ($nnSessionStorage) {
        expect($nnSessionStorage).not.to.equal(null);
    }));

    /**
     * @todo add unit tests for the local and session storage
     */

});
