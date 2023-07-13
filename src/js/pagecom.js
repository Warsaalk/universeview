
	c['PageCom'] = (function () {
		var init = function () {
			window.addEventListener('message', function(event) {
				var data = event.data;
				
				if (event.origin === window.location.origin && event.data.context == "UniverseView") {
					if (data.ID && data.action && data.content) {
						switch (data.ID) {
							case 'simulate':
								if (data.action == 'eventfleet') {
									c.ft.Simulate.triggerSimulationButton(data.content.id, data.content.party);
								}
								break;
							case 'galaxy':
								if (data.action == 'contentUpdate') {
									c.Galaxy.hit(data.content);
								}
								break;
						}
					}
				}
			});
		};
		
		var sendMessage = function (ID, action, content) {
			
			window.postMessage({'context': 'UniverseView', 'ID': ID, 'action': action, 'content': content}, window.location.origin);
			
		};
		
		var tippedCreate = function (selector, text, options) {
			
			sendMessage('tipped', 'create', {'selector': selector, 'text': text, 'options': options});
			
		};
		
		var tippedRefresh = function (selector) {
			
			sendMessage('tipped', 'refresh', {'selector': selector});
			
		};

		const galaxyInitialize = () =>
		{
			sendMessage('galaxy', 'init', {});
		};
		
		var galaxyLoad = function (galaxy, system, buildListCountdowns) {
			
			sendMessage('galaxy', 'load', {'galaxy': galaxy, 'system': system, 'buildListCountdowns': buildListCountdowns});
			
		};
		
		var galaxyLocation = function (galaxy, system) {
			
			sendMessage('galaxy', 'location', {'galaxy': galaxy, 'system': system});
			
		};
		
		var jQueryDialog = function (selector, options) {
			
			sendMessage('jquery', 'dialog', {'selector': selector, 'options': options});
			
		};
		
		var jQueryColorPicker = function (selector, options) {
			
			sendMessage('jquery', 'colorpicker', {'selector': selector, 'defaultColor': options});
			
		};
		
		var googleAnalyticsInit = function (code, cid, domain) {
			
			sendMessage('ga', 'init', {'code': code, 'domain': domain, cid: cid});
			
		};
		
		var googleAnalyticsSendHeartbeat = function() {
			
			sendMessage('ga', 'pageview', {});
			
		};
		
		var googleAnalyticsSendEvent = function (cat, action, label) {
			
			sendMessage('ga', 'event', {'cat': cat, 'action': action, 'label': label});
			
		};
		
		var googleAnalyticsSendPageView = function (variables) {
			
			sendMessage('ga', 'pageview', {'variables': variables});
			
		};

		const fleetDispatchUpdateTarget = type =>
		{
			sendMessage('fleetDispatch', 'setTarget', {type: type});
		};
		
		return {
			'init': init,
			'Tipped': {
				'create': tippedCreate,
				'refresh': tippedRefresh
			}, 
			'Galaxy': {
				'init': galaxyInitialize,
				'load': galaxyLoad
			},
			'JQuery': {
				'dialog': jQueryDialog,
				'colorpicker': jQueryColorPicker
			},
			'GoogleAnalytics': {
				'init': googleAnalyticsInit,
				'sendHeartbeat': googleAnalyticsSendHeartbeat,
				'sendEvent': googleAnalyticsSendEvent,
				'sendPageView': googleAnalyticsSendPageView
			},
			FleetDispatch: {
				updateTarget: fleetDispatchUpdateTarget
			}
		};
		
	}());