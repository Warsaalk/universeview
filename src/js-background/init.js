
	// Create APIs
	let API = {
		universe: new UniverseApi()
    };

	// Runtime listener to communicate with the front-end
	runtime.onMessage.addListener(function(request, sender, callback) {
        var result = /s(\d+)-(\w+)\.ogame\.gameforge\.com/.exec(sender.url),
            universeID = result[1] + '-' + result[2];

		if (request.action === "launch") {
			config.ago = context.AGO.isEnabled();
			callback({
				'config': config
			});

            API.universe.initialize(universeID);
		}

		if (request.action === 'events') {
			context.ft.EventNotification.updateEvents(request.data, sender.tab.id, sender.tab.windowId);
		}

		if (request.action === 'idleTimer:updateObject') {
			context.ft.IdleTimer.updateObject(request.data);
		}

		if (request.action === 'idleTimer:registerObjects') {
			context.ft.IdleTimer.registerObjects(request.data);
		}

        if (request.action === 'idleTimer:updateEvents') {
            context.ft.IdleTimer.updateEvents(request.data);
        }

		if (request.action === 'idleTimer:getData') {
			callback(context.ft.IdleTimer.getData());
		}

		if (request.action === "googleAnalytics") {
			callback(config.googleAnalyticsEnabled);
		}

		if (request.action === "googleAnalyticsPopup") {
            config.googleAnalyticsEnabled = request.accepted;

            if (googleAnalyticsPopupTab !== null) {
                browser.tabs.remove(googleAnalyticsPopupTab.id);
			}
        }

        if (request.action === "API") {
			let apiCall = request.call.split(":"), parameters = request.parameters || [];

			parameters.unshift(universeID, callback);

			setTimeout(function (module, method, parameters) {
                API[module][method].apply(API[module], parameters);
			}, 0, apiCall[0], apiCall[1], parameters);

			return true; // Make it async
		}
	});

	if (runtime.onSuspend !== void 0) {
        runtime.onSuspend.addListener(function (a, b, c) {
            API.universe.saveChanges();
            debugger;
        });
    }

	context.ft.IdleTimer.init();