/*global QUnit*/

sap.ui.define([
	"fioriweatherapp/controller/Dashboard.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Unit tests for Dashboard Controller");

		QUnit.test("Should find all main functions", function (assert) {
			var oController 		= new Controller();
			var oControllerMethod 	= oController.getMetadata().getAllMethods();
			var sAllFunctionsExist 	= true;
			var aNotFounMethods 	= [];
			var aMainFunction 		= [	
				'onInit',
				'startupApp',
				'hideShowControl',
				'getApiConfigModel',
				'checkApiKey',
				'checkServiceAvailability',
				'getCityModel',
				'searchCityWeatherForecast',
				'getWeatherForecast',
				'setWeatherForecastModel',
				'changeTheme',
				'makeHttpRequest',
				'setUpModel',
				'getFormattedWeatherTile',
				'getFormattedWeatherTable',
				'setForecastTable',
				'getDayNameFromDate',
				'formatDateUtc',
				'getCurrentDateYYYYMMDD',
				'setWheatherOverview',
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

		QUnit.test("Should find the Weather API Key", function (assert) {
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

		QUnit.test("Should validate the Weather API Key", function (assert) {
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

		QUnit.test("Should check the Weather API Key service status", function (assert) {
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

		QUnit.test("Should get the config model", function (assert) {
			var done 		= assert.async();
			var oController = new Controller();

			oController.getApiConfigModel()
			.then(result => {
				assert.ok(result);
				done();
			})
			.catch(function(err) {
				console.error('Error found in get the config model');
				done();
			});
		});
		
		QUnit.test("Should get the city model", function (assert) {
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

		QUnit.test("Should get the weather forecast for a given city", function (assert) {
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

		QUnit.test("Should convert UTC time to dd/mm/yyyy format", function (assert) {
			var oController = new Controller();
			var result = oController.formatDateUtc(1626317953);
			assert.equal(result, '14/07/2021');
		});

		QUnit.test("Should return the day for a given date", function (assert) {
			var oController = new Controller();
			var result = oController.getDayNameFromDate('2021-07-14');
			assert.equal(result, 'Wednesday');
		});
		
});
