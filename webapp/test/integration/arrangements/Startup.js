sap.ui.define([
	"sap/ui/test/Opa5"
], function (Opa5) {
	"use strict";

	return Opa5.extend("fioriweatherapp.test.integration.arrangements.Startup", {

		iStartMyApp: function (oOptionsParameter) {
			var oOptions = oOptionsParameter || {};

			oOptions.delay = oOptions.delay || 1;

			if (jQuery(".sapUiOpaComponent").length !== 0) {
                this.iTeardownMyUIComponent();
			}	

			// start the app UI component
			this.iStartMyUIComponent({
				componentConfig: {
					name: "fioriweatherapp",
					async: true,
					manifest: true
				},
				hash: oOptions.hash,
				autoWait: oOptions.autoWait || true
			});
		}
	});
});
