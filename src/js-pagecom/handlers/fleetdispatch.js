
	c.handlers.FleetDispatch = (function ()
	{
		const setTarget = content =>
		{
			fleetDispatcher.updateTarget();

			if (content.type === 3) {
				fleetDispatcher.setTargetType(fleetDispatcher.fleetHelper.PLANETTYPE_MOON);
			} else if (content.type === 2) {
				fleetDispatcher.setTargetType(fleetDispatcher.fleetHelper.PLANETTYPE_DEBRIS);
			} else {
				fleetDispatcher.setTargetType(fleetDispatcher.fleetHelper.PLANETTYPE_PLANET);
			}

			fleetDispatcher.updateTargetDropDowns();
			fleetDispatcher.refresh();
		};

		const handle = (action, content) =>
		{
			switch (action) {
				case 'setTarget': setTarget(content); break;
			}
		};
		
		return {handle: handle};
	}());