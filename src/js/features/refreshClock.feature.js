
	c.ft.RefreshClock = (function()
	{
		const init = () =>
		{
            const galaxyHeader = c.DOM.getOne(".galaxyTable .galaxyRow.ctGalaxyHead:first-child");
			if (galaxyHeader) {
                const  clock= c.DOM.create('div');
				clock.id = 'uv_g_r_clock';
				clock.classList.add("uv-element");
								
				galaxyHeader.insertBefore(clock, galaxyHeader.firstChild);
			}
		};

        const refresh = () =>
		{
			const clock = $$.getElementById('uv_g_r_clock');
			if (clock !== null) {
				c.DOM.clear('#uv_g_r_clock');
				const currentClock = $$.querySelector('.OGameClock').textContent;
				clock.appendChild($$.createTextNode(currentClock));
			}
		};
		
		return {refresh, init};
	}());
	