/*global QUnit*/

sap.ui.define([
	"fioriweatherapp/controller/View1.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Unit tests for View1 Controller");

	QUnit.test("It should call the init method no problems", function (assert) {
		var oController = new Controller();
		oController.onInit();
		assert.ok(oController);
	});

	QUnit.test("It should find all main functions", function (assert) {
		var oController 		= new Controller();
		var oControllerMethod 	= oController.getMetadata().getAllMethods();
		var sAllFunctionsExist 	= true;
		var aNotFounMethods 	= [];
		var aMainFunction 		= [	
			'makeHttpRequest',		
			'getApiKey',
			'checkServiceAvailability',
			'checkApiKey',			
			'checkCityName',
			'getTilesModel',
			'setTilesModel',			
			'getWeatherForecast',			
			'handleWeatherForecastFailer',
			'handleWeatherForecastExeption',
			'showErrorCaseByStatusCode',
		];
		
		aMainFunction.forEach(sFunctionName => {
			if(!oControllerMethod.hasOwnProperty(sFunctionName)){
				aNotFounMethods.push(sFunctionName);
				sAllFunctionsExist = false;
			}			 
		});
		
		if (aNotFounMethods.length > 0) {
			console.error('Not found methods: ' + aNotFounMethods)
		}

		assert.ok(sAllFunctionsExist);		
	});

	QUnit.test("It should find the Weather API Key", function (assert) {
		var done 		= assert.async();
		var oController = new Controller();

		oController.getApiKey()
		.then(result => {
			assert.ok(result);
			done();
		})
		.catch(function(err) {
			console.error('Error found in the promise function');
			done();
		});
	});

	QUnit.test("It should validate the Weather API Key", function (assert) {
		var done 		= assert.async();
		var oController = new Controller();

		oController.checkApiKey(10000)
		.then(result => {
			assert.ok(result);
			done();
		})
		.catch(function(err) {
			console.error('Error found in the API Key check');
			done();
		});
	});

	QUnit.test("It should check the Weather API Key service status", function (assert) {
		var done 		= assert.async();
		var oController = new Controller();

		oController.checkServiceAvailability(10000)
		.then(result => {
			assert.ok(result);
			done();
		})
		.catch(function(err) {
			console.error('Error found in the API service check');
			done();
		});
	});
	
	QUnit.test("It should check for valid city", function (assert) {
		var oController = new Controller();
		var result = oController.checkCityName();

		assert.ok(result);
	});


});
