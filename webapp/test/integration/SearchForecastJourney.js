/*global QUnit*/

sap.ui.define([
	"sap/ui/test/opaQunit",
	"./pages/Dashboard"
], function (opaTest) {
	"use strict";

	QUnit.module("Search Forecast Journey");

	opaTest("Should see the city name input", function (Given, When, Then) {		
		// Arrangements
        Given.iStartMyApp();

        // Assertions
		Then.onSearchForecast.iShouldSeeTheCityNameInput();	
        
        // Cleanup
        Then.iTeardownMyApp();
	});

    opaTest("Should see the search forecast button", function (Given, When, Then) {	
        // Arrangements
        Given.iStartMyApp();

        // Assertions
		Then.onSearchForecast.iShouldSeeTheSearchForecastButton();		

        // Cleanup
        Then.iTeardownMyApp();
	});

    opaTest("Should search for a city forecast", function (Given, When, Then) {	
        // Arrangements
        Given.iStartMyApp();

        // Actions
        When.onSearchForecast.iTypeTheCityName("Guarulhos")
        .and.iPressSearchForecastButton();
        
        // Assertions
        Then.onSearchForecast.iShouldSeeTheTiles();
        
        // Cleanup
        Then.iTeardownMyApp();
	});
});
