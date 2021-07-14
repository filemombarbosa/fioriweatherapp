/*global QUnit*/

sap.ui.define([
	"fioriweatherapp/controller/View1.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Unit tests for View1 Controller");

	QUnit.test("It should call the init method", function (assert) {
		var oController = new Controller();
		oController.onInit();
		assert.ok(oController);
	});

	QUnit.test("I should find all main functions", function (assert) {
		var oController 		= new Controller();
		var oControllerMethod 	= oController.getMetadata().getAllMethods();
		var sAllFunctionsExist 	= true;
		var aMainFunctionList 	= [			
			'checkApiKey',
			'checkServiceAvailability',			
			'getTilesModel',
			'setTilesModel',			
			'getWeatherForecast',
			'makeHttpRequest',
			'handleWeatherForecastFailer',
			'handleWeatherForecastExeption',
		];
		
		aMainFunctionList.forEach(sFunctionName => {
			if(!oControllerMethod.hasOwnProperty(sFunctionName)){
				sAllFunctionsExist = false;
			}			 
		})

		assert.ok(sAllFunctionsExist);
	});

});
