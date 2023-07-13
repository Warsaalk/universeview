

	if (config.type === "NEX" || config.type === "CRX") {

		context['AGO'] = (function () {

			var IDs = ["kfaofnlkooiapdmkbppmpgmjmhkolaeb", "ldbahlcmhmlpomdepooifmhnalokdhgm", "afdknninkegjlagjcacgicphekiaamde"], installed = {};

			var validate = function (extension) {

				if (IDs.indexOf(extension.id) !== -1) return true;

				return false;

			};

			var monitor = function () {

				chrome.management.onInstalled.addListener(function (extension) {

					debugger;

					if (validate(extension)) {
						installed[extension.id] = extension;
					}

					debugger;

				});

				chrome.management.onUninstalled.addListener(function (extension) {

					debugger;

					if (validate(extension) && installed[extension.id]) {
						delete installed[extension.id];
					}

					debugger;

				});

				chrome.management.onEnabled.addListener(function (extension) {

					if (validate(extension)) {
						installed[extension.id].enabled = true;
					}

				});

				chrome.management.onDisabled.addListener(function (extension) {

					if (validate(extension)) {
						installed[extension.id].enabled = false;
					}

				});

				chrome.management.getAll(function (extensions) {

					for (var i = extensions.length; i--;) {

						var extension = extensions[i];
						if (validate(extension)) {
							installed[extension.id] = extension;
						}

					}

				});

			};

			var isEnabled = function (callback) {

				for (var id in installed) {
					if (installed[id].enabled) return true;
				}

				return false;

			};

			return {'isEnabled': isEnabled, 'monitor': monitor};

		}());

		context.AGO.monitor();

	}