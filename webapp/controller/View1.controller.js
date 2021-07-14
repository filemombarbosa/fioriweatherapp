sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
],
	function (Controller, MessageBox, JSONModel) {
		"use strict";

		return Controller.extend("fioriweatherapp.controller.View1", {
			onInit: function () {
				this.teste();
			},

			checkApiKey: function () {
				
			},

			checkServiceAvailability: function () {
				
			},

			getTilesModel: function () {
				
			},

			setTilesModel: function () {
				
			},

			getWeatherForecast: function () {
				
			},

			makeHttpRequest: function () {
				
			},

			handleWeatherForecastFailer: function () {
				
			},

			handleWeatherForecastExeption: function () {
				
			},

			teste: function () {
				var teste = 1 + 2;
			},

			setupModel: function () {
				var _this = this,
					oRequestParameter = {
						sCityName: 'são paulo'
					}

				//_this.execApiRequestCurrentWeather(oRequestParameter);

				var oWeekChartModel = {
					"lines": [
					  {
						"points": [
						  {"x": 0, "y": 35},
						  {"x": 20, "y": 53},
						  {"x": 40, "y": 10},
						  {"x": 60, "y": 30},
						  {"x": 80, "y": 52},
						  {"x": 100, "y": 73}
						]
					  }
					],
					"size": "Responsive",
					"threshold": 40,
					"chartTwoColors": {
						"showPoints": true,
						"color": {"above": "Good", "below": "Error"}
					},
					"chartNoThreshold": {
						"threshold": null,
						"showPoints": true,
						"color": {"above": "Good", "below": "Critical"}
					},

					
				}
				

				var sPath = jQuery.sap.getModulePath("sap.suite.ui.microchart.sample.LineMicroChartGenericTile", "/SampleData.json");
				var oModel = new JSONModel(oWeekChartModel);
				this.getView().setModel(oModel);
			},

			execApiRequestCurrentWeather: function (oRequestParameter) {
				var _this 	= this,
					sApiKey = "918025524dd07e9ca19e2ce27158b6b8";

				try {
					fetch(`https://api.openweathermap.org/data/2.5/weather?q=${oRequestParameter.sCityName}&units=metric&APPID=${sApiKey}`)
					.then(response => {	
						if (!response.ok) {
							console.error("Error in the API Response");
						}

						return response.json();		
					})
					.then(oResponse => {
						if (oResponse && oResponse.cod != "404") {
							var oWeatherApiInfo = {
								sCityName: oResponse.name,
								sTemperature: Math.round(oResponse.main.temp),
								sMinTemperature: Math.round(oResponse.main.temp_min),
								sMaxTemperature: Math.round(oResponse.main.temp_max),
								sFeelsLike: oResponse.main.feels_like,
								sHumidity: oResponse.main.humidity,
								sCountry: oResponse.sys.country,
							}

							MessageBox.alert(`${oWeatherApiInfo.sCityName} (${oWeatherApiInfo.sCountry}) ${Math.round(oWeatherApiInfo.sTemperature)} °C`);

							console.log(oResponse);
						}						
					})
				} catch (error) {
					console.error(error);
				}
			}

			
		});
	});
