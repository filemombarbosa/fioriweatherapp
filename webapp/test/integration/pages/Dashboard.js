sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
], function (Opa5, Press, EnterText) {
	"use strict";

	var sViewName = "fioriweatherapp.view.Dashboard";
	
	Opa5.createPageObjects({
		onChangeTheme: {
			actions: {
                iPressThemeChangeButton: function () {
                    return this.waitFor({
                        id: 'idThemeBtn',
                        viewName: sViewName,
						actions: new Press(),
                        errorMessage: "The button dos not have a trigger"
                    });
                },
            },

			assertions: {
				iShouldSeeTheChangeThemeButton: function () {
                    return this.waitFor({
                        id: 'idThemeBtn',
                        viewName: sViewName,
						success: function (oChangeThemeButton) {							
							Opa5.assert.ok(true, "The change theme button was found");
						},
                        errorMessage: "The change theme button was not found"
                    });
                },
				
				iShouldSeeTheDarkTheme: function () {
					return this.waitFor({
						viewName: sViewName,
						success: function (oAppConfiguration) {
							var sAppTheme = sap.ui.test.Opa5.getWindow().sap.ui.getCore().getConfiguration().getTheme();

							Opa5.assert.equal(sAppTheme, "sap_fiori_3_dark", "The theme was changed");
						},
						errorMessage: "The theme was not changed"
					});
				}			
			}
		},

		onSearchForecast: {
			actions: {
                iPressThemeSearchButton: function () {
                    return this.waitFor({
                        id: 'idThemeBtn',
                        viewName: sViewName,
						actions: new Press(),
                        errorMessage: "The button dos not have a trigger"
                    });
                },

				iTypeTheCityName: function (sCityNameBegin) {
                    return this.waitFor({
                        id: 'idInputCity',
                        viewName: sViewName,
						actions: new EnterText({
							text: sCityNameBegin
						}),
                        errorMessage: "There was no Input"
                    });
                },

				iPressSearchForecastButton: function (sCityNameBegin) {
                    return this.waitFor({
                        id: 'idInputCity',
                        viewName: sViewName,
						actions: new EnterText({
							text: sCityNameBegin
						}),
						success: function (oInput) {		
							oInput.fireValueHelpRequest();
						},
                        errorMessage: "There was no Input"
                    });
                },
            },

			assertions: {
				iShouldSeeTheCityNameInput: function () {
                    return this.waitFor({
                        id: 'idInputCity',
                        viewName: sViewName,
						success: function (oInput) {	
							Opa5.assert.ok(true, "The city name input was found");
						},
                        errorMessage: "The city name input was not found"
                    });
                },

				iShouldSeeTheSearchForecastButton: function () {
                    return this.waitFor({
                        id: 'idInputCity',
                        viewName: sViewName,
						success: function (oInput) {	
							Opa5.assert.ok(oInput.getShowValueHelp(), "The search forecast button was found");
						},
                        errorMessage: "The search forecast button was found"
                    });
                },
				
				iShouldSeeTheTiles: function () {
                    return this.waitFor({                        
                        viewName: sViewName,
						controlType: "sap.m.GenericTile",
						success: function (oTile) {
							Opa5.assert.ok(true, "The tiles were found");
						},
                        errorMessage: "The tiles were not found"
                    });
                },
			}
		}
	});

});
