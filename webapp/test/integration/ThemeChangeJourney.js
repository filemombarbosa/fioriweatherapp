/*global QUnit*/

sap.ui.define([
	"sap/ui/test/opaQunit",
	"./pages/Dashboard"
], function (opaTest) {
	"use strict";

	QUnit.module("Theme Change Journey");

	opaTest("Should see the change theme button", function (Given, When, Then) {		
		// Arrangements
        Given.iStartMyApp();

		// Actions
		Then.onChangeTheme.iShouldSeeTheChangeThemeButton();	
		
		// Cleanup
        Then.iTeardownMyApp();
	});
	
	opaTest("Should change theme", function (Given, When, Then) {
		// Arrangements
        Given.iStartMyApp();

		// Actions
		When.onChangeTheme.iPressThemeChangeButton();

		// // Assertions
		Then.onChangeTheme.iShouldSeeTheDarkTheme();

		// Cleanup
        Then.iTeardownMyApp();
	});
});
