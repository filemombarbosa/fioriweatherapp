/*global QUnit*/

sap.ui.define([
	"fioriweatherapp/controller/View1.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Unit tests for View1 Controller");

	QUnit.test("It should call the init method", function (assert) {
		var oController = new Controller();
		//debugger
		oController.onInit();
		assert.ok(oController);
	});

	QUnit.test("I should find all main functions", function (assert) {
		var oController = new Controller();
		var oControllerMethod = oController.getMetadata().getAllMethods();
		var aMainFunctionList = [
			'checkApiKey',
			'checkServiceAvailability',

		]
		oControllerMethods.hasOwnProperty('teste')

		var teste = {teste:123}
		var teste2 = {teste:1123}

		assert.ok(teste, teste2)

		//assert.ok(oController);
	});

});
