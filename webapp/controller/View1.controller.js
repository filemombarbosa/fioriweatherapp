sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
],
	function (Controller, MessageBox, JSONModel) {
		"use strict";

		return Controller.extend("fioriweatherapp.controller.View1", {
			onInit: function () {
				var _this = this;

				_this.startupApp();
			},

			startupApp: function name() {
				var _this = this;

				try {
					_this.hideShowControl('idMainConteiner', false);
					_this.hideShowControl('idInputCity', false);					

					_this.getApiConfigModel()
					.then(oModelApiConfig => {
						if (oModelApiConfig.getData()) { 
							_this.setUpModel(oModelApiConfig, 'oModelApiConfig');

							return _this.checkApiKey()
						} else {
							console.error('Error configuration not loaded');

							throw "Error configuration not loaded";;
						}
					})
					.then(sStatusApiKeyCheck => {
						if (sStatusApiKeyCheck) {
							return _this.checkServiceAvailability()
						} else {
							console.error('Error API Key check');

							throw "Error API Key check";
						}
					})
					.then(sStatusServiceCheck => {
						if (sStatusServiceCheck) {
							_this.hideShowControl('idInputCity', true);

							return _this.getCityModel()
						} else {
							console.error('Error service check');

							throw "Error service check";
						}
					})
					.then(oModelCity => {
						if (oModelCity.getData()) { 
							_this.setUpModel(oModelCity, 'oModelCity');

							return _this.checkApiKey()
						} else {
							console.error('Error configuration not loaded');

							throw "Error configuration not loaded";
						}
					})
					.catch(error => {
						console.error('Error during App Inicialization');
						console.error(error);		
						
						MessageBox.error('Error during App Inicialization');
					})
				} catch (error) {
					console.error('Error during App Inicialization');
					console.error(error);		

					MessageBox.error('Error during App Inicialization');
				}		
			},

			hideShowControl: function (sIdContainer, sAction) {
				var oView = this;

				var sControl = oView.byId(sIdContainer)
				
				if (sAction) {
					sControl.setVisible(true)
				} else {
					sControl.setVisible(false)
				}
			},

			getApiConfigModel: function () {
				var sApiKeyFound 	= false;
				var sFilePath 		= jQuery.sap.getModulePath("fioriweatherapp", "/config/openweathermap.json"); 
				var oModel 			= new JSONModel(sFilePath);

				return new Promise(function(resolve, reject) {
					try {
						oModel.attachRequestCompleted(function(event) {
							if (event.getSource().getData()) {
								resolve(oModel);
							}

							reject(sApiKeyFound);							
						});
					} catch (error) {
						console.error('Error during the API Key search');
						reject(sApiKeyFound);
					}
				});
			},

			checkApiKey: function (sWaitForResponseMaxTime) {
				var getApiConfigModel 	= this.getApiConfigModel;
				var makeHttpRequest 	= this.makeHttpRequest;
				var sApiKeyIsValid 		= false;

				return new Promise(function(resolve, reject) {
					try {
						getApiConfigModel()
						.then(oModel => {
							var oApiConfig		= oModel.getData();
							var oRequestConfig 	= {
								sUrlEndPoint: `${oApiConfig.endPoint}/${oApiConfig.apiVersion}/weather?q=London,uk&lang=${oApiConfig.lang}&mode=${oApiConfig.mode}&units=${oApiConfig.units}&APPID=${oApiConfig.apiKey}`,
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
								MessageBox.error(responseError.responseText);

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

			checkServiceAvailability: function (sWaitForResponseMaxTime) {
				var getApiConfigModel 			= this.getApiConfigModel;
				var makeHttpRequest 			= this.makeHttpRequest;
				var showErrorCaseByStatusCode 	= this.showErrorCaseByStatusCode;				
				var sServiceIsAvailable 		= false;

				return new Promise(function(resolve, reject) {
					try {
						getApiConfigModel()
						.then(oModel => {
							var oApiConfig		= oModel.getData();
							var oRequestConfig 	= {
								sUrlEndPoint: `${oApiConfig.endPoint}/${oApiConfig.apiVersion}/weather?q=London,uk&lang=${oApiConfig.lang}&mode=${oApiConfig.mode}&units=${oApiConfig.units}&APPID=${oApiConfig.apiKey}`,
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

			getCityModel: function () {	
				var sDataIsLoaded	= false;
				var sFilePath 		= jQuery.sap.getModulePath("fioriweatherapp", "/model/city.list.br.json"); 
				var oModel 			= new JSONModel(sFilePath);

				return new Promise(function(resolve, reject) {
					try {
						oModel.attachRequestCompleted(function(event) {
							if (event.getSource().getData() && event.getSource().getData().length > 0) {
								resolve(oModel);
							}

							reject(sDataIsLoaded);							
						});
					} catch (error) {
						console.error('Error during the API Key search');
						reject(sDataIsLoaded);
					}
				});
			},

			searchCityWeatherForecast: function (event) {
				var _this 		= this;
				var sCityName 	= event.getSource().getValue();

				if (sCityName) {
					_this.hideShowControl('idMainConteiner', false);

					_this.getWeatherForecast(sCityName)
					.then(response => {
						_this.setWeatherForecastModel(response);
						
						_this.hideShowControl('idMainConteiner', true);
					})
					.catch(error => {
						console.error('Erro weather search');
						console.error(error);

						MessageBox.error('Erro during the weather forecast search. Make sure the city name is correct');
					})
				} else {
					MessageBox.warning('Please enter the city name');
				}
			},

			getWeatherForecast: function (sCityName, sWaitForResponseMaxTime) {				
				var getApiConfigModel 	= this.getApiConfigModel;
				var makeHttpRequest 		= this.makeHttpRequest;

				return new Promise(function(resolve, reject) {
					try {
						getApiConfigModel()
						.then(oModel => {
							var oApiConfig		= oModel.getData();
							var oRequestConfig 	= {
								sUrlEndPoint: `${oApiConfig.endPoint}/${oApiConfig.apiVersion}/${oApiConfig.apiService}?q=${sCityName}&lang=${oApiConfig.lang}&mode=${oApiConfig.mode}&units=${oApiConfig.units}&APPID=${oApiConfig.apiKey}`,
								sMethod: "POST", 
								sWaitForResponseMaxTime: sWaitForResponseMaxTime
							}
							
							return makeHttpRequest(oRequestConfig);																			
						})
						.then(response => {
							if (response) {		
								resolve(response);
							}
							
							reject(false);
						})
						.catch(responseError => {
							if (responseError && responseError.responseText) {
								MessageBox.error(responseError.responseText);
								console.error(responseError.responseText);
							}

							console.error('');
							reject(false);
						})
					} catch (error) {
						console.error('');
						reject(false);
					}
				});
			},

			setWeatherForecastModel: function (oWeatherForecastData) {
				var _this = this;

				try {
					var oWeaatherFormatted 	= _this.formatWeatherApiResponse(oWeatherForecastData);
					var oModel 				= new JSONModel(oWeaatherFormatted);
					
					_this.getView().setModel(oModel, 'oModelWeaatherFormatted');
					_this.setWheatherOverview();

				} catch (error) {				
					console.error('Error during weather forecast model setup');
				}
			},

			changeTheme: function (event) {
				var sStatusButton = event.getSource().getState();

				if (sStatusButton) {
					sap.ui.getCore().applyTheme("sap_fiori_3_dark");
				} else {
					sap.ui.getCore().applyTheme("sap_fiori_3");
				}
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

			setUpModel:  function (oModel, sModelAlias) {
				var _this = this;

				try {
					_this.getView().setModel(oModel, sModelAlias);
				} catch (error) {
					console.error('Error during model setup');
				}
			},

			formatWeatherApiResponse: function (oWeatherForecastData) {
				var _this = this;

				if (oWeatherForecastData) {
					try {						
						var sMetricSymbol 	= _this.getView().getModel('oModelApiConfig').getData().units == 'metric' ? '°C' : '' || false;
						var sCurrentDate 	= _this.getCurrentDateYYYYMMDD();						
						
						var aModelForecast 	= {
							aFirstWeatherOutput: [],
							oCityInfo: {
								sCityName: oWeatherForecastData.city.name,
								sCountry: oWeatherForecastData.city.country,								
							}
						};
						
						var aFirstWeatherForecast	= oWeatherForecastData.list.filter(oForecast => {
							var sForecastTime = oForecast.dt_txt.slice(-8);				
							
							oForecast.sDayName = _this.getDayNameFromDate(oForecast.dt_txt.substring(0, 10));

							if (sForecastTime == "06:00:00") {
								return oForecast;
							}
						});					

						aFirstWeatherForecast.forEach(oForecast => {						
							var oWeatherApiInfo = {
								sTemperature: Math.round(oForecast.main.temp) + sMetricSymbol,
								sTemperatureNumber: Math.round(oForecast.main.temp),
								sMinTemperature: Math.round(oForecast.main.temp_min),
								sMaxTemperature: Math.round(oForecast.main.temp_max),
								sFeelsLike: oForecast.main.feels_like,
								sHumidity: oForecast.main.humidity,
								sPressure: oForecast.main.pressure,
								sIcon: `https://openweathermap.org/img/wn/${oForecast.weather[0].icon}@2x.png` ,
								sDesc: oForecast.weather[0].main,  
								sDesc2: oForecast.weather[0].description, 
								sDate: _this.formatDateUtc(oForecast.dt),
								sDayName: oForecast.sDayName,
							}	

							aModelForecast.aFirstWeatherOutput.push(oWeatherApiInfo);						
						});			
	
						return aModelForecast;
					} catch (error) {
						console.error('Error during weather forecast model setup');
					}
				}				
			},	
			
			getDayNameFromDate: function (sDate) {
				var d 	 = new Date(sDate);
				var aDay = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
							
				return aDay[d.getDay()];
			},

			formatDateUtc: function (sUtcDate) {
				var d 		= new Date(sUtcDate * 1000),
					sDay  	= d.getDate().toString(),
					sDayF 	= (sDay.length == 1) ? '0' + sDay : sDay,
					sMonth  = (d.getMonth() + 1).toString(),
					sMonthF = (sMonth.length == 1) ? '0' + sMonth : sMonth,
					sYearF 	= d.getFullYear();
				
				return sDayF + "/" + sMonthF + "/" + sYearF;
			},

			getCurrentDateYYYYMMDD: function () {
				var d 		= new Date(),
					sMonth 	= '' + (d.getMonth() + 1),
					sDay 	= '' + d.getDate(),
					sYear 	= d.getFullYear();

				if (sMonth.length < 2) {
					sMonth = '0' + sMonth;
				}
					
				if (sDay.length < 2) {
					sDay = '0' + day;
				}					

				return [sYear, sMonth, sDay].join('-');
			},

			setWheatherOverview: function () {
				var aWeatherForecast = this.getView().getModel('oModelWeaatherFormatted').getData().aFirstWeatherOutput;

				var m1 = aWeatherForecast[0].sTemperatureNumber;
				var m2 = aWeatherForecast[1].sTemperatureNumber;
				var m3 = aWeatherForecast[2].sTemperatureNumber;
				var m4 = aWeatherForecast[3].sTemperatureNumber;
				var m5 = aWeatherForecast[4].sTemperatureNumber;

				var oWeekChartModel = {
					"lines": [
					  {
						"points": [
						  {"x": 0, "y": m1}, 								//{"x": 0, "y": M1},
						  {"x": m1, "y": m2 > m1 ? m2 : m1}, 				//{"x": M2, "y": M3},
						  {"x": m2 > m1 ? m2 : m1, "y": m3 > m2 ? m3 : m2}, //{"x": M3, "y": M4},
						  {"x": m3 > m2 ? m3 : m2, "y": m4 > m3 ? m4 : m3}, //{"x": M4, "y": M5},
						  {"x": m4 > m3 ? m4 : m3, "y": m5 > m4 ? m5 : m4}, //{"x": M4, "y": M5},
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
					}
				}

				var oModel = new JSONModel(oWeekChartModel);
				this.getView().setModel(oModel);
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
			}
		});
	});