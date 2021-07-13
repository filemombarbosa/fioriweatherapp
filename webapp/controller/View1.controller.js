sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
],
	function (Controller, MessageBox) {
		"use strict";

		return Controller.extend("weatherfioriapp.controller.View1", {
			onInit: function () {
				var _this = this,
					oRequestParameter = {
						sCityName: 'são paulo'
					}

				_this.execApiRequestCurrentWeather(oRequestParameter);
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
