
	function XHR(settings)
	{
		this.xhr = new XMLHttpRequest();

		/* Private variables */
		let inited			= false,
			methods			= ['GET','POST','HEAD'],
			method			= 'GET',
			url				= '',
			responseTypes	= ['json','xml','html','text'],
			response		= 'text',
			data			= {},
			documentSupport	= true,
			cache			= true,
			async			= true;

		/* Callbacks */
		let onStart 	= function () {},
			onError 	= function () {},
			onReceived 	= function () {},
			onStop 		= function () {};

		/* Handlers */
		let process = function (x) {};

		/* Listeners */
		let listeners = {
			loadstart: function (e) {
				onStart.call(this);
			},

			progress: function (e) {
				//c.Utils.log('progress');
			},

			error: function (e) {
				onError.call(this);
			},

			abort: function (e) {
				//c.Utils.log('aborted');
			},

			load: function (e) {
				if (this.status === 200) {
					let resp = "";

					if (response === "json" ) resp = JSON.parse(this.responseText);
					else if (response === "xml" || (documentSupport && response === "html")) resp = this.responseXML;
					else resp = this.responseText;

					onReceived.call(this, resp);
				} else
					onError.call(this);
			},

			loadend: function (e) {
				onStop.call(this);
			}
		};

		let processSettings = function (settings)
		{
			if (typeof settings.method === 'string') {
				let i = methods.indexOf(settings.method.toUpperCase());
				if (i !== -1) method = methods[i];
			}

			if (typeof settings.response === 'string') {
				let i = responseTypes.indexOf(settings.response.toLowerCase());
				if( i !== -1) response = responseTypes[i];
			}

			if (typeof settings.url === 'string') 		url = settings.url;
			if (typeof settings.data === 'object') 		data = settings.data;
			if (typeof settings.cache === 'boolean') 	cache = settings.cache;
			if (typeof settings.async === 'boolean') 	async = settings.async;

			if (typeof settings.onStart === 'function')		onStart 	= settings.onStart;
			if (typeof settings.onError === 'function')		onError 	= settings.onError;
			if (typeof settings.onReceived === 'function')	onReceived	= settings.onReceived;
			if (typeof settings.onStop === 'function')		onStop 		= settings.onStop;
		};

		let processEvents = function()
		{
			this.xhr.onreadystatechange = process;

			this.xhr.addEventListener('loadstart', 	listeners.loadstart,false);
			this.xhr.addEventListener('progress', 	listeners.progress, false);
			this.xhr.addEventListener('error', 		listeners.error, 	false);
			this.xhr.addEventListener('abort',		listeners.abort, 	false);
			this.xhr.addEventListener('load', 		listeners.load, 	false);
			this.xhr.addEventListener('loadend', 	listeners.loadend, 	false);
		};

		let processData = function()
		{
			let first = false, temp = "";

			function filterData(d, depth) {
				for (let index in d) {
					let value = d[index], key = depth == null ? index : (depth + '[' + index + ']');

					if (typeof value === 'object')
						filterData(value, key);
					else {
						if (!first)	first = true;
						else 		temp += "&";

						temp += key + "=" + value;
					}
				}
			}

			filterData(data);

			data = temp;
		};

		let openRequest = function()
		{
			if (method === 'GET' && data.length > 0) url += "?" + data;
			if (!cache) url += ((/\?/).test(url) ? "&" : "?") + '__' +(new Date()).getTime();

			this.xhr.open(method, url, async);

			if (method === "POST") this.xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

			if (response === "html") {
				try {
					this.xhr.responseType = 'document';
				} catch(e) {
					documentSupport = false;
				}
			}
		};

		let sendRequest = function()
		{
			if (method === "POST") 	this.xhr.send(data);
			else					this.xhr.send();
		};

        if (inited === true) return;
        inited = true; //Done allow 2 inits

        processSettings.call(this, settings);
        processEvents.call(this);
        processData.call(this);

        openRequest.call(this);
        sendRequest.call(this);
	}
	