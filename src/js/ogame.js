
	c.Ogame = (function()
	{
		const canLoadSystem = (galaxy, system, event) =>
		{
			$$.getElementById('galaxy_input').value = galaxy;
			$$.getElementById('system_input').value = system;
			
			c.PageCom.Galaxy.load(galaxy, system, true);
			
		};
		
		return {canLoadSystem: canLoadSystem};
	}());