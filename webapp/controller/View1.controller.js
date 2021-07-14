sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
],
	function (Controller, MessageBox, JSONModel) {
		"use strict";

		return Controller.extend("fioriweatherapp.controller.View1", {
			onInit: function () {
				
			},

			makeHttpRequest: function (oRequestConfig) {
				return new Promise(function(resolve, reject) {
					if (oRequestConfig.sUrlEndPoint) {
						try {
							$.ajax({
								url: oRequestConfig.sUrlEndPoint,
								method: oRequestConfig.sMethod || "GET",
								dataType: "JSON",
								async: true,
								timeout: oRequestConfig.sWaitForResponseMaxTime || 60000,
								crossDomain: true,
								processData: false,
								contentType: false,
								beforeSend: function () {
									sap.ui.core.BusyIndicator.show();
								},
								complete: function () {
									sap.ui.core.BusyIndicator.hide();
								},
								error: function (response) {
									reject(response);
								},
								success: (oResponse) => {
									resolve(oResponse);									
								}								
							});				
						} catch (error) {
							console.error('Error during the HTTP request');
							reject(sApiKeyIsValid);
						}
					} else {
						console.error('URL para requisição não informada');
						reject();
					} 
				});
			},

			getApiKey: function () {
				var sApiKeyFound 		= false;
				var sApiConfigFilePath 	= jQuery.sap.getModulePath("fioriweatherapp", "/config/openweathermap.json"); 
				var oModel 				= new JSONModel(sApiConfigFilePath);

				return new Promise(function(resolve, reject) {
					try {
						oModel.attachRequestCompleted(function(event) {
							var sApiKey = event.getSource().getData().apiKey || false;

							if (sApiKey && sApiKey!= "") {
								resolve(sApiKey);
							}

							reject(sApiKeyFound);							
						});
					} catch (error) {
						console.error('Error during the API Key search');
						reject(sApiKeyFound);
					}
				});
			},

			checkServiceAvailability: function (sWaitForResponseMaxTime) {
				var getApiKey 			= this.getApiKey;
				var makeHttpRequest 	= this.makeHttpRequest;
				var showErrorCaseByStatusCode = this.showErrorCaseByStatusCode;
				
				var sServiceIsAvailable = false;

				return new Promise(function(resolve, reject) {
					try {
						getApiKey()
						.then(sApiKey => {
							var oRequestConfig = {
								sUrlEndPoint: `https://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=${sApiKey}`,
								sMethod: "POST", 
								sWaitForResponseMaxTime: sWaitForResponseMaxTime
							}
							
							return makeHttpRequest(oRequestConfig);																			
						})
						.then(response => {
							if (response) {								
								sServiceIsAvailable = true;
							}
													
							resolve(sServiceIsAvailable);
						})
						.catch(responseError => {
							if (responseError && responseError.status) {
								showErrorCaseByStatusCode(responseError.status);								
							}	

							reject(sServiceIsAvailable);	
						})						
					} catch (error) {
						console.error('Error during service availability check');
						reject(sServiceIsAvailable);
					}
				});
			},

			checkApiKey: function (sWaitForResponseMaxTime) {
				var getApiKey 		= this.getApiKey;
				var makeHttpRequest = this.makeHttpRequest;
				var sApiKeyIsValid 	= false;

				return new Promise(function(resolve, reject) {
					try {
						getApiKey()
						.then(sApiKey => {
							var oRequestConfig = {
								sUrlEndPoint: `https://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=${sApiKey}`,
								sMethod: "POST", 
								sWaitForResponseMaxTime: sWaitForResponseMaxTime
							}
							
							return makeHttpRequest(oRequestConfig);																			
						})
						.then(response => {
							if (response) {								
								sApiKeyIsValid = true;
							}
							
							resolve(sApiKeyIsValid);
						})
						.catch(responseError => {
							if (responseError && responseError.responseText) {
								console.error(responseError.responseText);
							}

							console.error('Error during the API Key check');
							reject(sApiKeyIsValid);
						})
					} catch (error) {
						console.error('Error during the API Key check');
						reject(sApiKeyIsValid);
					}
				});
			},	
			
			checkCityName: function () {
				
			},						

			getTilesModel: function () {
				
			},

			setTilesModel: function () {
				
			},

			getWeatherForecast: function () {
				
			},		

			handleWeatherForecastFailer: function () {
				
			},

			handleWeatherForecastExeption: function () {
				
			},

			showErrorCaseByStatusCode: function (status) {
				switch (status) {
					case 401:
						console.error('Error during the service check. Please check the following cases:');
						console.group();
							console.error('You did not specify your API key in API request.');
							console.error('Your API key is not activated yet. Within the next couple of hours, it will be activated and ready to use.');
							console.error('You are using wrong API key in API request. Please, check your right API key in personal account.');
							console.error('You have free subscription and try to get access to our paid services (for example, 16 days/daily forecast API, any historical weather data, Weather maps 2.0, etc). Please, check your tariff in your personal account and pay attention at our price and condition.');
						break;
					case 401:
						console.error('Error during the service check. Please check the following cases:');
						console.group();
							console.error('You make a wrong API request. Please, check your API request.');
							console.error('You specify wrong city name, ZIP-code or city ID.');
						break;	
					case 401:
						console.error('Error during the service check. Please check the following cases:');
						console.group();
							console.error('You make a wrong API request. Please, check your API request.');
							console.error('You specify wrong city name, ZIP-code or city ID.');
						break;		
				}
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
