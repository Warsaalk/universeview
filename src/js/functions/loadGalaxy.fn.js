
	c.fn.extend('loadGalaxy', function (target)
	{
		const coords = target.dataset.coords.split(':');
		
		if (c.Utils.checkPage("galaxy")) {
			c.Ogame.canLoadSystem(coords[0],coords[1]);
		} else {
			let galaxyPageUrl = "/game/index.php?page=ingame&component=galaxy";

			if (c.Application.data.OGAMELEGACY) galaxyPageUrl = "/game/index.php?page=galaxy";

			window.location = window.location.origin + galaxyPageUrl + "&galaxy=" + coords[0] + "&system=" + coords[1] + "&position=" + coords[2];
		}
	});