
	c.handlers.Galaxy = (function ()
	{
		let originalRenderContentGalaxy = null;

		const initialize = content =>
		{
			if (originalRenderContentGalaxy === null) {
				originalRenderContentGalaxy = renderContentGalaxy;

				renderContentGalaxy = newRenderContentGalaxy;
			}
		};

		const newRenderContentGalaxy = data =>
		{
			originalRenderContentGalaxy(data);

			c.sendMessage("galaxy", "contentUpdate", JSON.parse(data));
		};

		const loadContent = content =>
		{
			if (0 === content.galaxy.length || !$.isNumeric(+content.galaxy)) {
				content.galaxy = 1
			}
			if (0 === content.system.length || !$.isNumeric(+content.system)) {
				content.system = 1
			}

			$("#galaxy_input").val(content.galaxy);
			$("#system_input").val(content.system);

			submitForm();
		};

		const handle = (action, content) =>
		{
			switch (action) {
				case 'init': initialize(content); break;
				case 'load': loadContent(content); break;
			}
		};
		
		return {handle: handle};
	}());