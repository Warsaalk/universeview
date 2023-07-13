
	c['handlers'] = {};
	c['actions'] = {};

	c.sendMessage = function (ID, action, content) {
			
		window.postMessage({'context': 'UniverseView', 'ID': ID, 'action': action, 'content': content}, window.location.origin);
		
	};
	
	window.UV = true;
	window[cName] = {
		'actions': c['actions']
	};
	
	window.addEventListener('message', function(event) { 
		
		var data = event.data;
		
		if (event.origin === window.location.origin && event.data.context == "UniverseView") {
			
			if (data.ID && data.action && data.content) {
				
				var handler;
				
				switch (data.ID) {
					case 'tipped': handler = c.handlers.Tipped; break;
					case 'galaxy': handler = c.handlers.Galaxy; break;
					case 'jquery': handler = c.handlers.JQuery; break;
					case 'fleetDispatch': handler = c.handlers.FleetDispatch; break;
					case 'ga': handler = c.handlers.GoogleAnalytics; break;
				}
				
				if (handler) {
					handler.handle(data.action, data.content);
				}
				
			}
			
		}
		
	});