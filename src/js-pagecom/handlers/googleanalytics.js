
	c.handlers['GoogleAnalytics'] = (function() {
		var data = null;

		var init = function (content) {
			data = content;
		};

		var getDefaultPayloadData = function (payload) {
			// Default parameters
			payload.v = 1;
			payload.tid = data.code;
			payload.cid = data.cid;

			// Anonymize IP address
			payload.aip = 1;

			// Extra information
			payload.dl = document.location.origin + document.location.pathname + document.location.search;
            payload.dt = document.title;
            payload.dh = document.querySelector('meta[name=ogame-universe]').getAttribute('content');
            payload.ul = navigator.language;
            payload.sr = screen.width + "x" + screen.height;
            payload.vp = window.innerWidth + "x" + window.innerHeight;

            return payload;
		};
		
		var sendEvent = function (content) {
			if (data) {
                sendRequest({
					t: 'event', 		// Event hit type
					ec: content.cat,    // Event Category. Required.
					ea: content.action, // Event Action. Required.
                	el: content.label   // Event label.
                });
            }
		};
		
		var sendPageView = function (content) {
            if (data) {
                if (!content.variables) {
                    content.variables = {};
                }
                content.variables.t = "pageview";

				sendRequest(content.variables);
            }
		};

		var encodePayload = function (payload) {
			var payloadData = [];
			for (var key in payload) {
				payloadData.push(encodeURIComponent(key) + "=" + encodeURIComponent(payload[key]));
			}
			return payloadData.join("&");
		};

		var sendRequest = function (payload) {
            payload = getDefaultPayloadData(payload);

            var request = new XMLHttpRequest();
            request.open("POST", "https://www.google-analytics.com/collect", true);
            request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            request.send(encodePayload(payload));
		};
		
		var handle = function (action, content) {
			
			switch (action) {
			case 'init': init(content); break;
			case 'event': sendEvent(content); break;
			case 'pageview': sendPageView(content); break;
			}
			
		};
		
		return {'handle': handle};
		
	}());