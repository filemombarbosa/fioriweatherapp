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
			'getApiConfigModel',
			'checkServiceAvailability',
			'checkApiKey',			
			'getCityModel',
			'setCityModel',						
			'getWeatherForecast',
			'formatWeatherApiResponse',
			'setWeatherForecastModel',
			'formatWeatherApiResponse',
			'setApiConfigModel',
			'formatDateUtc',

			'getTilesModel',
			'setTilesModel',			
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

		oController.getApiConfigModel()
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
			console.error('Error found check the Weather API Key service status');
			done();
		});
	});
	
	QUnit.test("It should get the city model", function (assert) {
		var done 		= assert.async();
		var oController = new Controller();

		oController.getCityModel()
		.then(result => {
			assert.ok(result);
			done();
		})
		.catch(function(err) {
			console.error('Error found in get the city model');
			done();
		});
	});

	QUnit.test("It should get the weather forecast for a given city", function (assert) {
		var done 		= assert.async();
		var oController = new Controller();

		oController.getWeatherForecast('Sao paulo')
		.then(result => {
			assert.ok(result);
			done();
		})
		.catch(function(err) {
			console.error('Error found in the weather forecast');
			done();
		});
	});
	
	QUnit.test("It should convert UTC time to dd/mm/yyyy format", function (assert) {
		var oController = new Controller();
		var result = oController.formatDateUtc(1626317953);
		assert.equal(result, '14/07/2021');
	});

});
