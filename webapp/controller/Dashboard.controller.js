sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
],
	function (Controller, MessageBox, JSONModel) {
		"use strict";

		return Controller.extend("fioriweatherapp.controller.Dashboard", {
			onInit: function () {
				var _this = this;

				_this.startupApp();
			},

			startupApp: function () {
				var _this = this;

				try {
					_this.hideShowControl('idMainConteiner', false);
					_this.hideShowControl('idInputCity', false);					

					_this.getApiConfigModel()
					.then(oModelApiConfig => {
						if (oModelApiConfig.getData()) { 
							_this.setUpModel(oModelApiConfig, 'oModelApiConfig');

							return _this.checkApiKey();
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

							return _this.getCityModel();
						} else {
							console.error('Error service check');

							throw "Error service check";
						}
					})
					.then(oModelCity => {
						if (oModelCity.getData()) { 
							_this.setUpModel(oModelCity, 'oModelCity');

							return _this.checkApiKey();
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

				try {
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
				} catch (error) {
					console.error('Error during Api config get');
				}				
			},

			checkApiKey: function (sWaitForResponseMaxTime) {
				var getApiConfigModel 	= this.getApiConfigModel;
				var makeHttpRequest 	= this.makeHttpRequest;
				var sApiKeyIsValid 		= false;

				try {
					return new Promise(function(resolve, reject) {
						try {
							getApiConfigModel()
							.then(oModel => {
								var oApiConfig		= oModel.getData();
								var oRequestConfig 	= {
									sUrlEndPoint: `${oApiConfig.endPoint}/${oApiConfig.apiVersion}/weather?q=London,uk&lang=${oApiConfig.lang}&mode=${oApiConfig.mode}&units=${oApiConfig.units}&APPID=${oApiConfig.apiKey}`,
									sMethod: "GET", 
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
				} catch (error) {
					console.error('Error during api key check');
				}
			},

			checkServiceAvailability: function (sWaitForResponseMaxTime) {
				var getApiConfigModel 			= this.getApiConfigModel;
				var makeHttpRequest 			= this.makeHttpRequest;
				var showErrorCaseByStatusCode 	= this.showErrorCaseByStatusCode;				
				var sServiceIsAvailable 		= false;

				try {
					return new Promise(function(resolve, reject) {
						try {
							getApiConfigModel()
							.then(oModel => {
								var oApiConfig		= oModel.getData();
								var oRequestConfig 	= {
									sUrlEndPoint: `${oApiConfig.endPoint}/${oApiConfig.apiVersion}/weather?q=London,uk&lang=${oApiConfig.lang}&mode=${oApiConfig.mode}&units=${oApiConfig.units}&APPID=${oApiConfig.apiKey}`,
									sMethod: "GET", 
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
				} catch (error) {
					console.error('Error during service availability check');
				}
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
						console.error('Error during the city model get');
						reject(sDataIsLoaded);
					}
				});	
							
			},

			searchCityWeatherForecast: function (event) {
				var _this 		= this;
				var sCityName 	= event.getSource().getValue();

				try {
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
						})
					} else {
						MessageBox.warning('Please enter the city name');
					}
				} catch (error) {
					console.error('Error during the weather search');
				}
			},

			getWeatherForecast: function (sCityName, sWaitForResponseMaxTime) {
				var _this 				= this;
				var getApiConfigModel 	= _this.getApiConfigModel;
				var makeHttpRequest 	= _this.makeHttpRequest;

				return new Promise(function(resolve, reject) {
					try {
						getApiConfigModel()
						.then(oModel => {
							var oApiConfig		= oModel.getData();
							var oRequestConfig 	= {
								sUrlEndPoint: `${oApiConfig.endPoint}/${oApiConfig.apiVersion}/${oApiConfig.apiService}?q=${sCityName}&lang=${oApiConfig.lang}&mode=${oApiConfig.mode}&units=${oApiConfig.units}&APPID=${oApiConfig.apiKey}`,
								sMethod: "GET", 
								sWaitForResponseMaxTime: sWaitForResponseMaxTime
							}
							
							return makeHttpRequest(oRequestConfig);																			
						})
						.then(ApiResponse => {
							if (ApiResponse) {		
								resolve(ApiResponse);
							}
							
							reject(false);
						})
						.catch(responseError => {
							if (responseError && responseError.responseText) {
								MessageBox.error(responseError.responseText);
								console.error(responseError.responseText);
							}

							console.error('Error while getting the weather forecast');
							reject(false);
						})
					} catch (error) {
						console.error('Error while getting the weather forecast');
						reject(false);
					}
				});
			},

			setWeatherForecastModel: function (oWeatherForecastData) {
				var _this = this;

				try {
					var aFormattedWeatherTable 	= _this.getFormattedWeatherTable(oWeatherForecastData);
					var aFormattedWeatherTile 	= _this.getFormattedWeatherTile(oWeatherForecastData);
					var oModel 					= new JSONModel(aFormattedWeatherTile);

					_this.setForecastTable(aFormattedWeatherTable);
					
					_this.getView().setModel(oModel, 'oModelWeaatherFormatted');

					_this.setWheatherOverview();

				} catch (error) {				
					console.error('Error during weather forecast model setup');
				}
			},

			setForecastTable: function (aForecastTable) {
				var _this = this;

				try {
					var oTabelaWeather = new sap.m.Table({
						growing: true,
						growingThreshold: 20,						
						columns: [
							new sap.m.Column({
								width: '50px',
								header: new sap.m.Label({
									text: "Day"
								})
							}),							
							new sap.m.Column({
								width: '50px',
								sortIndicator: sap.ui.core.SortOrder.Ascending,
								header: new sap.m.Label({
									text: "Date"
								})
							}),
							new sap.m.Column({
								width: '40px',
								sortIndicator: sap.ui.core.SortOrder.Ascending,
								header: new sap.m.Label({
									text: "Time"
								})
							}),							
							new sap.m.Column({
								width: '80px',
								header: new sap.m.Label({
									text: ""
								})
							}),
							new sap.m.Column({
								width: '70px',
								header: new sap.m.Label({
									text: "Current"
								})
							}),
							new sap.m.Column({
								width: '70px',
								header: new sap.m.Label({
									text: "Min"
								})
							}),
							new sap.m.Column({
								width: '70px',
								header: new sap.m.Label({
									text: "Max"
								})
							}),
							new sap.m.Column({
								width: '70px',
								header: new sap.m.Label({
									text: "Humidty"
								})
							}),
							new sap.m.Column({
								width: '70px',
								header: new sap.m.Label({
									text: "Pressure"
								})
							}),
						],
						items: {
							path: '/',
							template: new sap.m.ColumnListItem({
								cells: [
									new sap.m.Text({
										text:"{sDay}",
									}),
									new sap.m.Text({
										text:"{sDate}",
									}),				 
									new sap.m.Text({
										text:"{sTime}",
									}),					
									new sap.m.HBox({
										items: [
											new sap.m.Image({
												width: '2rem',
												src:"{sIcon}",
											}),
											new sap.m.Text({
												text:"{sDesc}",
											}),
										]
									}),									
									new sap.m.ObjectStatus({
										state:  { 
											path: 'sTempNumber', 
											formatter: _this.getTempColor
										},
										text:"{sTemp}",
									}),
									new sap.m.ObjectStatus({
										state:  { 
											path: 'sTempMinNumber', 
											formatter: _this.getTempColor
										},
										text:"{sTempMin}",
									}),
									new sap.m.ObjectStatus({
										state:  { 
											path: 'sTempMaxNumber', 
											formatter: _this.getTempColor
										},
										text:"{sTempMax}",
									}),
									new sap.m.Text({
										text:"{sHumidity}",
									}),
									new sap.m.Text({
										text:"{sPressure}",
									}),
								]
							})
						}
					});
	
					var oModel = new sap.ui.model.json.JSONModel(aForecastTable);

					oTabelaWeather.setModel(oModel);

					_this.byId('idContainerTable').removeAllContent();
					
					_this.byId('idInputCity').resetProperty('value');

					_this.byId('idContainerTable').addContent(oTabelaWeather);
				} catch (error) {
					console.error('Error during forecast table setup');
				}
			},

			getTempColor: function (sTempeture) {
				var sColor	= '';

				if (sTempeture) {
					try {
						if (sTempeture) {
							if (sTempeture <= 15) {
								sColor = 'Information';
							} else if (sTempeture > 15 &&  sTempeture <= 23 ) {
								sColor = 'Success';
							} else if (sTempeture > 23 &&  sTempeture <= 25 ) {
								sColor = 'Warning';
							} else if (sTempeture > 25 ) {
								sColor = 'Error';
							}							
						}
					} catch (error) {
						console.error('Error during the temperature color get');
					}
				}

				return sColor;				
			},

			changeTheme: function (event) {
				var sStatusButton = event.getSource().getState();

				try {
					if (sStatusButton) {
						sap.ui.getCore().applyTheme("sap_fiori_3_dark");
					} else {
						sap.ui.getCore().applyTheme("sap_fiori_3");
					}
				} catch (error) {
					console.error('Error during the theme change');
				}
			},			

			setUpModel:  function (oModel, sModelAlias) {
				var _this = this;

				try {
					_this.getView().setModel(oModel, sModelAlias);
				} catch (error) {
					console.error('Error during model setup');
				}
			},

			getFormattedWeatherTable: function (oWeatherForecastData) {
				var _this = this;
				
				try {
					var aForecastTable = []  
					var sMetricSymbol 	= _this.getView().getModel('oModelApiConfig').getData().units == 'metric' ? '°C' : '' || false;
					
					oWeatherForecastData.list.filter(oForecast => {
						var sForecastTime = oForecast.dt_txt.slice(11);

						if (sForecastTime !== '00:00:00') {
							var oTableRow = {
								sDate: _this.formatDateUtc(oForecast.dt),
								sTime: oForecast.dt_txt.slice(-8).substring(0,5),
								sDay: _this.getDayNameFromDate(oForecast.dt_txt.substring(0, 10)),							
								sIcon: `https://openweathermap.org/img/wn/${oForecast.weather[0].icon}@2x.png`,
								sDesc: oForecast.weather[0].main, 
								sTemp: Math.round(oForecast.main.temp) + sMetricSymbol,
								sTempNumber: Math.round(oForecast.main.temp),
								sTempMin: Math.round(oForecast.main.temp_min) + sMetricSymbol,
								sTempMinNumber: Math.round(oForecast.main.temp_min),
								sTempMax: Math.round(oForecast.main.temp_max) + sMetricSymbol,	
								sTempMaxNumber: Math.round(oForecast.main.temp_max),
								sHumidity: oForecast.main.humidity, 
								sPressure: oForecast.main.pressure, 
							}

							aForecastTable.push(oTableRow);
						}
					});

					return aForecastTable;
				} catch (error) {
					console.error('Error duting table setup');
				}
				
			},

			getFormattedWeatherTile: function (oWeatherForecastData) {
				var _this = this;

				if (oWeatherForecastData) {
					try {						
						var sMetricSymbol 	= _this.getView().getModel('oModelApiConfig').getData().units == 'metric' ? '°C' : '' || false;
						
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
				var _this = this;

				try {
					var aWeatherForecast = _this.getView().getModel('oModelWeaatherFormatted').getData().aFirstWeatherOutput;
					var sTemperature1 	 = aWeatherForecast[0].sTemperatureNumber;
					var sTemperature2 	 = aWeatherForecast[1].sTemperatureNumber;
					var sTemperature3 	 = aWeatherForecast[2].sTemperatureNumber;
					var sTemperature4 	 = aWeatherForecast[3].sTemperatureNumber;
					var sTemperature5 	 = aWeatherForecast[4].sTemperatureNumber;

					var oWeekChartModel = {
						"lines": [
						{
							"points": [
								{"x": 0, "y": sTemperature1},
								{"x": 2, "y": sTemperature2},
								{"x": 3, "y": sTemperature3},
								{"x": 4, "y": sTemperature4},
								{"x": 5, "y": sTemperature5},
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
					
					_this.getView().setModel(oModel);
				} catch (error) {
					console.error('Error during week overview get');
				}				
			},
			
			showErrorCaseByStatusCode: function (sStastusCode) {
				switch (sStastusCode) {
					case 401:
						console.error('Error during the service check. Please check the following cases:');
						console.group();
							console.error('You did not specify your API key in API request.');
							console.error('Your API key is not activated yet. Within the next couple of hours, it will be activated and ready to use.');
							console.error('You are using wrong API key in API request. Please, check your right API key in personal account.');
							console.error('You have free subscription and try to get access to our paid services (for example, 16 days/daily forecast API, any historical weather data, Weather maps 2.0, etc). Please, check your tariff in your personal account and pay attention at our price and condition.');
						break;
					case 404:
						console.error('Error during the service check. Please check the following cases:');
						console.group();
							console.error('You make a wrong API request. Please, check your API request.');
							console.error('You specify wrong city name, ZIP-code or city ID.');
						break;	
					case 429:
						console.error('Error during the service check. Please check the following cases:');
						console.group();
							console.error('You make a wrong API request. Please, check your API request.');
							console.error('You specify wrong city name, ZIP-code or city ID.');
						break;		
				}
			},

			makeHttpRequest: function (oRequestConfig) {
				var _this = this;

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
							reject(false);
						}
					} else {
						console.error('Error during the HTTP request');
						reject(false);
					} 
				});
			},
		});
	});