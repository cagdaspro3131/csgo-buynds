'use strict';

// csgo-buynds controllers module tests

describe('controllers', function() {
    beforeEach(module('buyndsServices'));
    beforeEach(module('buyndsControllers'));

    var $controller;

    beforeEach(inject(function(_$controller_){
        $controller = _$controller_;
    }));

    describe('SingleKeyGenCtrl', function() {
        var scope, route, window, bindBuilder, dataService, controller, $httpBackend, createController,
            getBindableKeysHandler, getPrimaryWeaponsHandler, getSecondaryWeaponsHandler, getGearHandler,
            getGrenadesHandler;

        beforeEach(inject(function(_$rootScope_, _dataService_, _$httpBackend_) {
            scope = _$rootScope_.$new();
            dataService = _dataService_;
            $httpBackend = _$httpBackend_;

            getBindableKeysHandler = $httpBackend.whenGET(/data\/bindable-keys\.json.*/).respond({});
            getPrimaryWeaponsHandler = $httpBackend.whenGET(/data\/primary-weapons\.json.*/).respond({});
            getSecondaryWeaponsHandler = $httpBackend.whenGET(/data\/secondary-weapons\.json.*/).respond({});
            getGearHandler = $httpBackend.whenGET(/data\/gear\.json.*/).respond([]);
            getGrenadesHandler = $httpBackend.whenGET(/data\/grenades\.json.*/).respond([]);

            route = {};
            window = {};
            bindBuilder = {};

            createController = function() {
                var skgController = $controller('SingleKeyGenCtrl', {
                    $scope: scope, $route: route, $window: window,
                    bindBuilder: bindBuilder, dataService: dataService
                });
                $httpBackend.flush();
                return skgController;
            };
        }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        describe('setKeyToBindByCode(keyCode)', function () {

            beforeEach(function() {
                var bindableKeys = {
                    "keyGroups": [
                        {
                            "name": "Numeric Keypad",
                            "keys": [
                                {
                                    "name": "1 / End",
                                    "bind": "kp_end",
                                    "code": 97
                                },
                                {
                                    "name": "2 / Down Arrow",
                                    "bind": "kp_downarrow",
                                    "code": 98
                                },
                                {
                                    "name": "3 / Page Down",
                                    "bind": "kp_pgdn",
                                    "code": 99
                                }
                            ]
                        }
                    ]
                };
                getBindableKeysHandler.respond(bindableKeys);
                window = {
                    alert: function(message) {}
                };
                controller = createController();
            });

            it('should update the key to bind on the bind options', function() {
                var keyCode = 97;
                var expectedKeyBind = 'kp_end';
                scope.setKeyToBindByCode(keyCode);
                expect(scope.bindOptions.keyToBind).toEqual(expectedKeyBind);
            });

            it('should update the key to bind on the bind options with the correct bindable key', function() {
                var keyCode = 99;
                var expectedKeyBind = 'kp_pgdn';
                scope.setKeyToBindByCode(keyCode);
                expect(scope.bindOptions.keyToBind).toEqual(expectedKeyBind);
            });

            it('should alert user of error when given an unrecognized key code', function() {
                var keyCode = 93;
                var expectedErrorMessage = 'Unrecognized Key! (keyCode = 93)';
                spyOn(window, 'alert');
                scope.setKeyToBindByCode(keyCode);
                expect(window.alert).toHaveBeenCalledWith(expectedErrorMessage);
            });
        });
    });
});