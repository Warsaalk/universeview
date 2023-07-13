
	c.fn.extend('loadFleetDispatch', function (parameters)
	{
		let fleetPageUrl = "/game/index.php?page=ingame&component=fleetdispatch";

		if (c.Application.data.OGAMELEGACY) fleetPageUrl = "/game/index.php?page=fleet1";

		let query = [];

		for (const key in parameters) {
			query.push(key + "=" + encodeURIComponent(parameters[key]));
		}

		window.location = window.location.origin + fleetPageUrl + "&" + query.join("&");
	});