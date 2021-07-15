sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
],
	function (Controller, MessageBox, JSONModel) {
		"use strict";

		return Controller.extend("fioriweatherapp.controller.View1", {
			onInit: function () {
				//var _this = this;

				this.setApiConfigModel()
				this.setCityModel();
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

			checkServiceAvailability: function (sWaitForResponseMaxTime) {
				var getApiConfigModel 		= this.getApiConfigModel;
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

			checkApiKey: function (sWaitForResponseMaxTime) {
				var getApiConfigModel 	= this.getApiConfigModel;
				var makeHttpRequest 		= this.makeHttpRequest;
				var sApiKeyIsValid 			= false;

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

			setApiConfigModel: function () {
				var _this = this;

				try {
					_this.getApiConfigModel()
					.then(oModelApiConfig => {
						_this.getView().setModel(oModelApiConfig, 'oModelApiConfig');
					})
				} catch (error) {
					console.error('Error during api config model setup');
				}
			},

			setCityModel: function () {
				var _this = this;

				try {
					_this.getCityModel()
					.then(oModel => {
						_this.getView().setModel(oModel, 'oModelCity');
					})
				} catch (error) {
					console.error('Error during city model setup');
				}
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

						var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
						

						var aFirstWeatherForecast	= oWeatherForecastData.list.filter(oForecast => {
							var sForecastDate 	= oForecast.dt_txt.substring(0, 10);
							var sForecastTime 	= oForecast.dt_txt.slice(-8);				
							var d 				= new Date(sForecastDate);
							
							oForecast.sDayName = days[d.getDay()];

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

			onPressSearch: function (event) {
				var sCityName = event.getSource().getValue();

				this.getWeatherForecast(sCityName)
				.then(response => {
					this.setWeatherForecastModel(response);
				})
			},

			formatDateUtc: function (sUtcDate) {
				var data = new Date(sUtcDate * 1000),
				dia  = data.getDate().toString(),
				diaF = (dia.length == 1) ? '0'+dia : dia,
				mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
				mesF = (mes.length == 1) ? '0'+mes : mes,
				anoF = data.getFullYear();
				
				return diaF+"/"+mesF+"/"+anoF;
			},

			getCurrentDateYYYYMMDD: function (sUtcDate) {
				var d = new Date(),
				month = '' + (d.getMonth() + 1),
				day = '' + d.getDate(),
				year = d.getFullYear();

				if (month.length < 2) 
					month = '0' + month;
				if (day.length < 2) 
					day = '0' + day;

				return [year, month, day].join('-');
			},

			setWheatherOverview: function () {
				debugger //oModelWeaatherFormatted

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
						  {"x": 0, "y": m1}, 	//{"x": 0, "y": M1},
						  {"x": m1, "y": m2 > m1 ? m2 : m1}, 	//{"x": M2, "y": M3},
						  {"x": m2 > m1 ? m2 : m1, "y": m3 > m2 ? m3 : m2}, 	//{"x": M3, "y": M4},
						  {"x": m3 > m2 ? m3 : m2, "y": m4 > m3 ? m4 : m3}, 	//{"x": M4, "y": M5},
						  {"x": m4 > m3 ? m4 : m3, "y": m5 > m4 ? m5 : m4}, 	//{"x": M4, "y": M5},
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

			onChangeTheme: function (event) {
				var sStatusButton = event.getSource().getState();

				if (sStatusButton) {
					sap.ui.getCore().applyTheme("sap_fiori_3_dark");
				} else {
					sap.ui.getCore().applyTheme("sap_fiori_3");
				}
				
			},
			
			
			
			checkCityName: function () {
				
			},

			getTilesModel: function () {
				
			},

			setTilesModel: function () {
				
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
